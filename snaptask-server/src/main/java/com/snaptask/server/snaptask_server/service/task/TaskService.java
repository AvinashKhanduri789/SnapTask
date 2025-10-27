package com.snaptask.server.snaptask_server.service.task;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.firebase.messaging.*;
import com.snaptask.server.snaptask_server.dto.bid.PosterBidSummaryDto;
import com.snaptask.server.snaptask_server.dto.notification.FCMNotificationDto;
import com.snaptask.server.snaptask_server.dto.task.*;
import com.snaptask.server.snaptask_server.enums.*;
import com.snaptask.server.snaptask_server.exceptions.customExceptions.ResourceNotFoundException;
import com.snaptask.server.snaptask_server.modals.Bid;
import com.snaptask.server.snaptask_server.modals.Task;
import com.snaptask.server.snaptask_server.modals.User;
import com.snaptask.server.snaptask_server.repository.bid.BidRepository;
import com.snaptask.server.snaptask_server.repository.notification.NotificationRepository;
import com.snaptask.server.snaptask_server.repository.task.TaskRepository;
import com.snaptask.server.snaptask_server.repository.user.UserRepository;
import com.snaptask.server.snaptask_server.service.ExpoPushService;
import com.snaptask.server.snaptask_server.service.FirebaseService;
import com.snaptask.server.snaptask_server.util.Helper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Metrics;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.snaptask.server.snaptask_server.modals.Notification;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
@Slf4j
public class TaskService {
    private final TaskRepository taskRepository;
    private final Helper helper;
    private final UserRepository userRepository;
    private final BidRepository bidRepository;
    private final FirebaseService fcmService;
    private final ExpoPushService expoPushService;
    private final NotificationRepository notificationRepository;

//    jsut for testing
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final RestTemplate restTemplate = new RestTemplate();
    public TaskService(
            TaskRepository taskRepository,
            Helper helper,
            UserRepository userRepository,
            BidRepository bidRepository,
            FirebaseService firebaseService,
            NotificationRepository notificationRepository,
            ExpoPushService expoPushService
    ){
        this.taskRepository = taskRepository;
        this.helper = helper;
        this.userRepository = userRepository;
        this.bidRepository = bidRepository;
        this.fcmService = firebaseService;
        this.notificationRepository = notificationRepository;
        this.expoPushService = expoPushService;
    }

    @Transactional
    @Async
    public void notifySeekersForTask(Task task, GeoJsonPoint posterLocation) {
        if (task == null) {
            log.warn("Task is null, skipping notifications");
            return;
        }

        try {
            List<User> targetSeekers = helper.findEligibleSeekers(task, posterLocation);

            if (targetSeekers.isEmpty()) {
                log.info("No seekers to notify for task {}", task.getId());
                return;
            }

            // 🔹 Collect Expo tokens and receiver IDs
            List<String> expoTokens = targetSeekers.stream()
                    .map(User::getFcmToken) // 👈 ensure you have this field in User
                    .filter(token -> token != null && !token.isBlank())
                    .distinct()
                    .toList();

            List<String> receiverIds = targetSeekers.stream()
                    .map(User::getId)
                    .distinct()
                    .toList();

            if (expoTokens.isEmpty()) {
                log.info("No valid Expo push tokens found for task {}", task.getId());
                return;
            }

            // 🔹 Save single notification record
            Notification notification = Notification.builder()
                    .senderId(helper.getCurrentLoggedInUser().getId())
                    .posterName(helper.getCurrentLoggedInUser().getName())
                    .receiverIds(receiverIds)
                    .taskId(task.getId())
                    .taskTitle(task.getTitle())
                    .message("A new task matching your skills is available!")
                    .budget(task.getBudget() != null ? String.valueOf(task.getBudget()) : null)
                    .deadline(task.getDeadline() != null ? task.getDeadline().toString() : null)
                    .type(NotificationType.BID)
                    .status(NotificationStatus.NEW)
                    .isSeen(false)
                    .build();

            notificationRepository.save(notification);
            log.info("Saved broadcast notification for task {} with {} seekers", task.getId(), receiverIds.size());

            // 🔹 Prepare payload
            String title = "New Task Available!";
            String body = task.getTitle() + " - " + task.getCategory();
            Map<String, Object> data = Map.of(
                    "taskId", task.getId(),
                    "taskTitle", task.getTitle(),
                    "taskCategory", task.getCategory(),
                    "type", NotificationType.BID.name(),
                    "notificationId", notification.getId()
            );

            // 🔹 Send Expo push notifications directly — no need for another async layer
            final int batchSize = 100;
            for (int i = 0; i < expoTokens.size(); i += batchSize) {
                List<String> batch = expoTokens.subList(i, Math.min(i + batchSize, expoTokens.size()));
                expoPushService.sendBatchNotifications(batch, title, body, data);
            }

            log.info(" Expo push dispatch started for task {} ({} total tokens)", task.getId(), expoTokens.size());

        } catch (Exception e) {
            log.error("Unexpected error while notifying seekers for task {}: {}", task.getId(), e.getMessage(), e);
        }
    }

    public ResponseEntity<String> createTask(CreateTaskDto dto) {
        Task task = Task.builder()
                .title(dto.getTitle().trim())
                .description(dto.getDescription().trim())
                .category(dto.getCategory().trim())
                .deadline(dto.getDeadline())
                .isUnpaid(Boolean.TRUE.equals(dto.getIsUnpaid()))
                .budget(dto.getBudget())
                .status(TaskStatus.NEW)
                .mode(dto.getMode())
                .posterId(helper.getCurrentLoggedInUser().getId())
                .bidIds(List.of())
                .bidsCount(0)
                .postedOn(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        Task savedTask = taskRepository.save(task);

        notifySeekersForTask(savedTask,helper.getCurrentLoggedInUser().getGeoJsonPoint());
        return ResponseEntity.status(HttpStatus.CREATED).body("Task created successfully");
    }

    @Transactional
    public ResponseEntity<String> updateTask(UpdateTaskDto dto) {
        if (dto.getTaskId() == null || dto.getTaskId().isBlank()) {
            return ResponseEntity.badRequest().body("Task ID must not be blank");
        }

        Task task = taskRepository.findById(dto.getTaskId())
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + dto.getTaskId()));

        String currentUserId = helper.getCurrentLoggedInUser().getId();

        if (!task.getPosterId().equals(currentUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not allowed to update this task");
        }

        //  Update only provided fields
        if (dto.getTitle() != null) task.setTitle(dto.getTitle().trim());
        if (dto.getDescription() != null) task.setDescription(dto.getDescription().trim());
        if (dto.getCategory() != null) task.setCategory(dto.getCategory().trim());
        if (dto.getBudget() != null) task.setBudget(dto.getBudget());
        if (dto.getDeadline() != null) task.setDeadline(dto.getDeadline());
        task.setUpdatedAt(LocalDateTime.now());

        taskRepository.save(task);
        log.info("Task {} updated successfully by poster {}", task.getId(), currentUserId);

        //  Notify assigned seeker only if exists
        if (task.getAssignedSeekerId() != null) {
            Optional<User> seekerOpt = userRepository.findById(task.getAssignedSeekerId());
            if (seekerOpt.isPresent()) {
                User seeker = seekerOpt.get();

                // ---  Save Notification record ---
                Notification notification = Notification.builder()
                        .receiverIds(List.of(seeker.getId()))
                        .senderId(currentUserId)
                        .senderName(helper.getCurrentLoggedInUser().getName())
                        .posterName(helper.getCurrentLoggedInUser().getName())
                        .posterRating(helper.getCurrentLoggedInUser().getRating()) // optional
                        .taskId(task.getId())
                        .taskTitle(task.getTitle())
                        .type(NotificationType.UPDATE)
                        .status(NotificationStatus.NEW)
                        .targetRole(UserRole.SEEKER)
                        .userRole(UserRole.POSTER)
                        .message("Poster has updated your assigned task. Please review the new details.")
                        .budget(task.getBudget() != null ? String.valueOf(task.getBudget()) : null)
                        .deadline(task.getDeadline() != null ? task.getDeadline().toString() : null)
                        .isSeen(false)
                        .build();

                notificationRepository.save(notification);
                log.info("Saved update notification for seeker {} (taskId={})", seeker.getId(), task.getId());

                // ---Send Push Notification (async safe call) ---
                CompletableFuture.runAsync(() -> {
                    String title = "Task Updated!";
                    String body = task.getTitle() + " has been updated by " + notification.getPosterName();

                    Map<String, Object> data = Map.of(
                            "taskId", task.getId(),
                            "notificationId", notification.getId(),
                            "type", NotificationType.UPDATE.name()
                    );

                    expoPushService.sendNotification(
                            seeker.getFcmToken(),
                            title,
                            body,
                            data
                    );
                });
            }
        }

        return ResponseEntity.ok("Task updated successfully");
    }

    public ResponseEntity<String> deleteTask(DeleteTaskDto dto) {
        // Fetch current user (poster)
        User currentUser = helper.getCurrentLoggedInUser();

        // Find the task by ID
        Task task = taskRepository.findById(dto.getTaskId())
                .orElseThrow(() -> new ResourceNotFoundException("Task with id " + dto.getTaskId() + " not found"));

        // Ensure that only the poster who created the task can delete it
        if (!task.getPosterId().equals(currentUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You are not authorized to delete this task");
        }

        // Delete the task
        taskRepository.delete(task);

        return ResponseEntity.ok("Task deleted successfully");
    }

    @Transactional(readOnly = true)
    public ResponseEntity<PosterTasksGroupedDto> getPosterTasksSummary() {
        String posterId = helper.getCurrentLoggedInUser().getId();

        List<Task> tasks = taskRepository.findByPosterId(posterId);

        if (tasks.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }

        // Map tasks to DTOs first (efficient)
        List<PosterTaskSummaryDto> taskDtos = tasks.stream()
                .map(task -> PosterTaskSummaryDto.builder()
                        .id(task.getId())
                        .title(task.getTitle())
                        .budget(task.getBudget())
                        .deadline(task.getDeadline())
                        .bidsCount(task.getBidsCount())
                        .status(task.getStatus())
                        .category(task.getCategory())
                        .createdAt(task.getPostedOn())
                        .build())
                .toList();

        // Group by status
        Map<TaskStatus, List<PosterTaskSummaryDto>> grouped = taskDtos.stream()
                .collect(Collectors.groupingBy(PosterTaskSummaryDto::getStatus));

        PosterTasksGroupedDto groupedDto = PosterTasksGroupedDto.builder()
                .active(grouped.getOrDefault(TaskStatus.ACTIVE, List.of()))
                .pending(grouped.getOrDefault(TaskStatus.PENDING_REVIEW, List.of()))
                .completed(grouped.getOrDefault(TaskStatus.COMPLETED, List.of()))
                .build();

        return ResponseEntity.ok(groupedDto);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<PosterTaskDetailDto> getPosterTaskDetails(String taskId) {
        // Fetch task by ID
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + taskId));

        // Verify that the current user is the poster
        String currentUserId = helper.getCurrentLoggedInUser().getId();
        if (!task.getPosterId().equals(currentUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // Fetch associated bids efficiently
        List<Bid> bids = bidRepository.findByTaskId(taskId);

        // Map bids to PosterBidSummaryDto
        List<PosterBidSummaryDto> bidDtos = bids.stream()
                .map(bid -> PosterBidSummaryDto.builder()
                        .bidId(bid.getId())
                        .seekerName(bid.getSeekerName())
                        .tagline(bid.getTagline())
                        .rating(bid.getRating())
                        .bidAmount(bid.getBidAmount())
                        .timeline(bid.getTimeline())
                        .message(bid.getProposal())
                        .completedTasks(bid.getCompletedTasks())
                        .build())
                .toList();

        // Build the PosterTaskDetailDto
        PosterTaskDetailDto taskDetailDto = PosterTaskDetailDto.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .budget(task.getBudget())
                .category(task.getCategory())
                .status(task.getStatus())
                .deadline(task.getDeadline())
                .postedOn(task.getPostedOn())
                .mode(task.getMode())
                .bidsCount(task.getBidsCount())
                .timeline(task.getTimeline())
                .bidsList(bidDtos)
                .createdAt(task.getPostedOn())
                .build();

        return ResponseEntity.ok(taskDetailDto);
    }


    public void sendPushNotification(String expoToken, String title, String body) {
        try {
            // Prepare payload
            Map<String, Object> payload = new HashMap<>();
            payload.put("to", expoToken);
            payload.put("sound", "default");
            payload.put("title", title);
            payload.put("body", body);
            payload.put("priority", "high");

            // Convert map to JSON string
            String jsonBody = objectMapper.writeValueAsString(payload);

            // Create headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Create request
            HttpEntity<String> request = new HttpEntity<>(jsonBody, headers);

            // Send request
            ResponseEntity<String> response = restTemplate.postForEntity("https://exp.host/--/api/v2/push/send", request, String.class);

            System.out.println("✅ Expo push response: " + response.getBody());
        } catch (Exception e) {
            System.err.println("❌ Failed to send Expo push notification: " + e.getMessage());
        }
    }

}
