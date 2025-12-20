package com.snaptask.server.snaptask_server.service.task;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.firebase.messaging.*;
import com.snaptask.server.snaptask_server.dto.bid.AssignedBidInfoDto;
import com.snaptask.server.snaptask_server.dto.bid.PosterBidSummaryDto;
import com.snaptask.server.snaptask_server.dto.notification.FCMNotificationDto;
import com.snaptask.server.snaptask_server.dto.task.*;
import com.snaptask.server.snaptask_server.enums.*;
import com.snaptask.server.snaptask_server.exceptions.customExceptions.ResourceNotFoundException;
import com.snaptask.server.snaptask_server.modals.Bid;
import com.snaptask.server.snaptask_server.modals.Task;
import com.snaptask.server.snaptask_server.modals.User;
import com.snaptask.server.snaptask_server.modals.embedded.CompletionDetail;
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
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.snaptask.server.snaptask_server.modals.Notification;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
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
                .status(TaskStatus.ACTIVE)
                .mode(dto.getMode())
                .posterId(helper.getCurrentLoggedInUser().getId())
                .bidIds(List.of())
                .bidsCount(0)
                .postedOn(LocalDateTime.now())
                .isAssigned(false)
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

    @Transactional
    public ResponseEntity<?> deleteTask(DeleteTaskDto dto) {

        User currentUser = helper.getCurrentLoggedInUser();
        String taskId = dto.getTaskId();

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task with id " + taskId + " not found"));


        if (!task.getPosterId().equals(currentUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                    Map.of(
                            "message", "You are not authorized to delete this task",
                            "taskId", taskId
                    )
            );
        }

        if (task.isAssigned() && task.getAssignedSeekerId() != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    Map.of(
                            "message", "You cannot delete this task because it is already assigned to a seeker",
                            "taskId", taskId,
                            "assignedSeekerId", task.getAssignedSeekerId()
                    )
            );
        }

        bidRepository.deleteAllByTaskId(taskId);
        notificationRepository.deleteAllByTaskId(taskId);
        taskRepository.delete(task);

        return ResponseEntity.ok(
                Map.of(
                        "message", "Task deleted successfully",
                        "taskId", taskId
                )
        );
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
                        .description(task.getDescription())
                        .category(task.getCategory())
                        .createdAt(task.getPostedOn())
                        .build())
                .toList();

        // Group by status
        Map<TaskStatus, List<PosterTaskSummaryDto>> grouped = taskDtos.stream()
                .collect(Collectors.groupingBy(PosterTaskSummaryDto::getStatus));

        PosterTasksGroupedDto groupedDto = PosterTasksGroupedDto.builder()
                .active(grouped.getOrDefault(TaskStatus.ACTIVE, List.of()))
                .pending(grouped.getOrDefault(TaskStatus.PENDING, List.of()))
                .completed(grouped.getOrDefault(TaskStatus.COMPLETED, List.of()))
                .build();

        return ResponseEntity.ok(groupedDto);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<PosterTaskDetailDto> getPosterTaskDetails(String taskId) {

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + taskId));

        String currentUserId = helper.getCurrentLoggedInUser().getId();
        if (!task.getPosterId().equals(currentUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // Fetch Bids
        List<Bid> bids = bidRepository.findByTaskId(taskId);

        List<PosterBidSummaryDto> bidDtos = bids.stream()
                .map(bid -> PosterBidSummaryDto.builder()
                        .id(bid.getId())
                        .seekerName(bid.getSeekerName())
                        .tagline(bid.getTagline())
                        .rating(bid.getRating())
                        .bidAmount(bid.getBidAmount())
                        .message(bid.getProposal())
                        .completedTasks(bid.getCompletedTasks())
                        .build()
                ).toList();

        // Assigned Bid
        AssignedBidInfoDto assignedBidInfo = null;
        if (task.getAssignedBidId() != null) {
            assignedBidInfo = bidRepository.findById(task.getAssignedBidId())
                    .map(bid -> AssignedBidInfoDto.builder()
                            .bidId(bid.getId())
                            .seekerId(bid.getSeekerId())
                            .seekerName(bid.getSeekerName())
                            .tagline(bid.getTagline())
                            .seekerRating(bid.getRating())
                            .bidAmount(bid.getBidAmount())
                            .proposal(bid.getProposal())
                            .seekerCompletedTasks(bid.getCompletedTasks())
                            .build()
                    ).orElse(null);
        }

        // Completion Request Mapping
        TaskCompletionRequest completionRequest = null;
        CompletionDetail cd = task.getCompletionDetail();

        if (cd != null) {
            completionRequest = TaskCompletionRequest.builder()
                    .taskId(task.getId())
                    .note(cd.getNote())
                    .submissionLinks(cd.getSubmissionLinks())
                    .build();
        }

        PosterTaskDetailDto response = PosterTaskDetailDto.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .category(task.getCategory())
                .budget(task.getBudget())
                .deadline(task.getDeadline())
                .status(task.getStatus())
                .bidsList(bidDtos)
                .assignedBidInfo(assignedBidInfo)
                .taskCompletionRequest(completionRequest)
                .build();

        return ResponseEntity.ok(response);
    }

    @Transactional
    public ResponseEntity<Map<String, Object>> approveTaskCompletion(String taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + taskId));

        String currentUserId = helper.getCurrentLoggedInUser().getId();
        if (!task.getPosterId().equals(currentUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                    Map.of(
                            "message", "You are not authorized to approve this task.",
                            "taskId", taskId
                    )
            );
        }

        if (task.getCompletionDetail() == null || !task.getCompletionDetail().isCompleted()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    Map.of(
                            "message", "No completion request found for this task.",
                            "taskId", taskId
                    )
            );
        }

        task.getCompletionDetail().setApprovedByPoster(true);
        task.getCompletionDetail().setReviewedOn(LocalDateTime.now());
        task.setStatus(TaskStatus.COMPLETED);

        Optional<User> user = userRepository.findById(task.getAssignedSeekerId());
        user.get().setCompletedTasks(user.get().getCompletedTasks()+1);
        userRepository.save(user.get());

        if (task.getAssignedSeekerId() != null) {
            userRepository.findById(task.getAssignedSeekerId()).ifPresent(seeker -> {
                seeker.setCompletedTasks(seeker.getCompletedTasks() + 1);
                userRepository.save(seeker);
            });
        }

        taskRepository.save(task);

        return ResponseEntity.ok(
                Map.of(
                        "message", "Task marked as completed successfully.",
                        "taskId", taskId,
                        "status", task.getStatus().name()
                )
        );
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


//    ----------------------------------------
    @Transactional(readOnly = true)
    public ResponseEntity<?> getSeekerTaskSummery(String category) {
        var currentUser = helper.getCurrentLoggedInUser();
        String seekerId = currentUser.getId();

        // Step 1: Fetch all unassigned tasks for the given category
        List<Task> tasks = taskRepository.findByCategoryAndIsAssignedFalse(category);
        log.info("getSeekerTaskSummery() called: category={}, foundTasks={}", category, tasks.size());

        if (tasks.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        // Step 2: Collect taskIds to minimize DB round-trips
        List<String> taskIds = tasks.stream()
                .map(Task::getId)
                .filter(Objects::nonNull)
                .distinct()
                .toList();

        // Step 3: Fetch all bids made by current seeker on these tasks
        List<Bid> seekerBids = taskIds.isEmpty()
                ? Collections.emptyList()
                : bidRepository.findBySeekerIdAndTaskIdIn(seekerId, taskIds);

        Set<String> biddedTaskIds = seekerBids.stream()
                .map(Bid::getTaskId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        log.debug("Seeker={} has made bids on taskIds={}", seekerId, biddedTaskIds);

        // Step 4: Map tasks to DTOs
        List<SeekerTaskSummery> summaries = tasks.stream()
                .map(task -> SeekerTaskSummery.builder()
                        .id(task.getId())
                        .title(task.getTitle())
                        .description(task.getDescription())
                        .budget(task.getBudget() != null ? BigDecimal.valueOf(task.getBudget()) : BigDecimal.ZERO)
                        .location(task.getMode() != null ? task.getMode().name() : "Remote")
                        .deadline(task.getDeadline())
                        .postedTime(task.getPostedOn())
                        .applicantsCount(task.getBidsCount())
                        .skills(List.of(task.getCategory()))
                        .status(task.getStatus() != null ? task.getStatus().name() : "UNKNOWN")
                        .alredyMadebid(biddedTaskIds.contains(task.getId()))
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(summaries);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<?> getAssignedTasksForSeeker() {
        // Get the currently logged-in seeker
        User seeker = helper.getCurrentLoggedInUser();
        String seekerId = seeker.getId();
        log.info("Fetching assigned tasks for seeker with ID: {}", seekerId);

        // Fetch all tasks assigned to this seeker
        List<Task> assignedTasks = taskRepository.findByAssignedSeekerIdAndIsAssignedTrueAndStatus(seekerId,TaskStatus.PENDING);
        log.info("Found {} assigned tasks for seeker {}", assignedTasks.size(), seekerId);

        if (assignedTasks.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        List<SeekerTaskSummery> summaries = assignedTasks.stream()
                .map(task -> SeekerTaskSummery.builder()
                        .id(task.getId())
                        .title(task.getTitle())
                        .description(task.getDescription())
                        .budget(task.getBudget() != null ? BigDecimal.valueOf(task.getBudget()) : BigDecimal.ZERO)
                        .location(task.getMode() != null ? task.getMode().name() : "Remote")
                        .deadline(task.getDeadline())
                        .postedTime(task.getPostedOn())
                        .applicantsCount(task.getBidsCount())
                        .skills(List.of(task.getCategory()))
                        .status(task.getStatus() != null ? task.getStatus().name() : "UNKNOWN")
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(summaries);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<?> getCompletedTasksForSeeker() {
        // Get the currently logged-in seeker
        User seeker = helper.getCurrentLoggedInUser();
        String seekerId = seeker.getId();
        log.info("Fetching completed tasks for seeker with ID: {}", seekerId);

        // Fetch all completed tasks assigned to this seeker
        List<Task> completedTasks = taskRepository.findByAssignedSeekerIdAndStatus(seekerId, TaskStatus.COMPLETED);
        log.info("Found {} completed tasks for seeker {}", completedTasks.size(), seekerId);

        if (completedTasks.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        // Map to summary DTO
        List<SeekerTaskSummery> summaries = completedTasks.stream()
                .map(task -> SeekerTaskSummery.builder()
                        .id(task.getId())
                        .title(task.getTitle())
                        .description(task.getDescription())
                        .budget(task.getBudget() != null ? BigDecimal.valueOf(task.getBudget()) : BigDecimal.ZERO)
                        .location(task.getMode() != null ? task.getMode().name() : "Remote")
                        .deadline(task.getDeadline())
                        .postedTime(task.getPostedOn())
                        .applicantsCount(task.getBidsCount())
                        .skills(List.of(task.getCategory()))
                        .status(task.getStatus() != null ? task.getStatus().name() : "UNKNOWN")
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(summaries);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<?> getSeekerTaskDetails(String id) {
        Optional<Task> optionalTask = taskRepository.findById(id);
        if (optionalTask.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Task not found", "taskId", id));
        }

        Task task = optionalTask.get();

        Optional<User> posterOpt = userRepository.findById(task.getPosterId());
        if (posterOpt.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Poster not found", "posterId", task.getPosterId()));
        }

        User poster = posterOpt.get();
        var currentUser = helper.getCurrentLoggedInUser();
        String seekerId = currentUser.getId();

        boolean alreadyMadeBid = bidRepository.existsByTaskIdAndSeekerId(task.getId(), seekerId);
        boolean isAssignedToMe = task.getAssignedSeekerId() != null
                && task.getAssignedSeekerId().equals(currentUser.getId());

        SeekerTaskDetail dto = SeekerTaskDetail.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .budget(BigDecimal.valueOf(task.getBudget() != null ? task.getBudget() : 0))
                .location(task.getMode() != null ? task.getMode().name() : "Remote")
                .deadline(task.getDeadline() != null ? task.getDeadline().toString() : "N/A")
                .applicants(task.getBidsCount() + " applicants")
                .isAssignedToMe(isAssignedToMe)
                .skills(List.of())
                .status(task.getStatus().name().toLowerCase())
                .projectType("Freelance")
                .postedBy(SeekerTaskDetail.PostedBy.builder()
                        .posterId(poster.getId())
                        .name(poster.getName())
                        .role(poster.getRole() != null ? poster.getRole().name() : "Unknown")
                        .experience(poster.getWorkplace() != null ? poster.getWorkplace() : "Not specified")
                        .rating(poster.getRating())
                        .completedTasks(poster.getCompletedTasks())
                        .responseTime(poster.getBio() != null ? poster.getBio() : "N/A")
                        .memberSince(poster.getJoinDate() != null
                                ? poster.getJoinDate().getMonth() + " " + poster.getJoinDate().getYear()
                                : "N/A")
                        .build())
                .alredyMadebid(alreadyMadeBid)
                .build();

        return ResponseEntity.ok(dto);
    }

    public ResponseEntity<?> makeBid(CreateBidDto createBidDto) {
        User seeker = helper.getCurrentLoggedInUser();
        Optional<Task> optionalTask = taskRepository.findById(createBidDto.getTaskId());
        if (optionalTask.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Task not found"));
        }
        Task task = optionalTask.get();

        boolean alreadyBid = bidRepository.existsByTaskIdAndSeekerId(task.getId(), seeker.getId());
        if (alreadyBid) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "You have already placed a bid on this task."));
        }

        Bid bid = Bid.builder()
                .taskId(task.getId())
                .seekerId(seeker.getId())
                .seekerName(seeker.getName())
                .tagline(createBidDto.getTagline())
                .bio(seeker.getBio())
                .rating(seeker.getRating())
                .completedTasks(seeker.getCompletedTasks())
                .bidAmount(createBidDto.getBidAmount())
                .proposal(createBidDto.getProposal())
                .skills(seeker.getSkills())
                .similarWorks(createBidDto.getSimilarWorks())
                .portfolio(createBidDto.getPortfolio())
                .canCompleteInTime(createBidDto.isCanCompleteInTime())
                .memberSince(seeker.getJoinDate().toString())
                .communicationPreference(createBidDto.getCommunicationPreference())
                .communicationDetail(createBidDto.getCommunicationDetail())
                .bidStatus(BidStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Bid savedBid = bidRepository.save(bid);

        task.setBidIds(List.of(savedBid.getId()));
        task.setBidsCount(task.getBidsCount()+1);
        taskRepository.save(task);

        Notification notification = Notification.builder()
                .receiverIds(List.of(task.getPosterId()))
                .senderId(seeker.getId())
                .senderName(seeker.getName())
                .taskId(task.getId())
                .taskTitle(task.getTitle())
                .message(seeker.getName() + " placed a new bid on your task \"" + task.getTitle() + "\".")
                .type(NotificationType.BID)
                .status(NotificationStatus.NEW)
                .userRole(UserRole.SEEKER)
                .targetRole(UserRole.POSTER)
                .seekerName(seeker.getName())
                .seekerRating(seeker.getRating())
                .completedTasks(seeker.getCompletedTasks())
                .bidAmount(String.valueOf(createBidDto.getBidAmount()))
                .timeline(createBidDto.isCanCompleteInTime() ? "Can complete on time" : "May need more time")
                .budget(task.getBudget().toString())
                .deadline(task.getDeadline().toString())
                .createdAt(Instant.now())
                .build();

        try {
            notificationRepository.save(notification);
        } catch (Exception e) {
            log.error("Failed to save notification entity: {}", e.getMessage());
        }


        try {
            Optional<User> posterOpt = userRepository.findById(task.getPosterId());
            if (posterOpt.isPresent()) {
                User poster = posterOpt.get();
                if (poster.getFcmToken() != null && !poster.getFcmToken().isBlank()) {
                    Map<String, Object> data = Map.of(
                            "type", "BID",
                            "taskId", task.getId(),
                            "taskTitle", task.getTitle(),
                            "bidId", bid.getId(),
                            "seekerName", seeker.getName()
                    );

                    // @Async call → non-blocking
                    expoPushService.sendNotification(
                            poster.getFcmToken(),
                            "New Bid Received 💼",
                            seeker.getName() + " placed a new bid on your task \"" + task.getTitle() + "\".",
                            data
                    );
                }
            }
        } catch (Exception e) {
            log.error("Failed to send Expo notification: {}", e.getMessage());
        }

        return ResponseEntity.ok(Map.of(
                "message", "Bid placed successfully!",
                "bidId", savedBid.getId(),
                "taskId", task.getId()
        ));
    }

    @Transactional
    public ResponseEntity<?> markTaskAsCompleted(TaskCompletionRequest request) {
        log.info("Seeker {} attempting to mark task  as completed", request.getTaskId());
        User user = helper.getCurrentLoggedInUser();
        String seekerId = user.getId();

        Task task = taskRepository.findById(request.getTaskId()).orElse(null);
        if (task == null) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Task not found"));
        }


        if (task.getAssignedSeekerId() == null || !task.getAssignedSeekerId().equals(seekerId)) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "You are not authorized to complete this task"));
        }


        if (task.getCompletionDetail() != null) {
            log.info("Task completion has already been requested");
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Task completion has already been requested"));
        }


        User seeker = userRepository.findById(seekerId)
                .orElseThrow(() -> new RuntimeException("Seeker not found"));


        CompletionDetail completionDetail = CompletionDetail.builder()
                .completed(true)
                .note(request.getNote())
                .submissionLinks(request.getSubmissionLinks())
                .completedOn(LocalDateTime.now())
                .approvedByPoster(null)
                .build();


        task.setCompletionDetail(completionDetail);
        task.setUpdatedAt(LocalDateTime.now());
        taskRepository.save(task);


        Notification notification = Notification.builder()
                .receiverIds(List.of(task.getPosterId()))
                .senderId(seekerId)
                .senderName(seeker.getName())
                .taskId(task.getId())
                .taskTitle(task.getTitle())
                .message(request.getNote())
                .type(NotificationType.UPDATE)
                .status(NotificationStatus.NEW)
                .userRole(UserRole.SEEKER)
                .targetRole(UserRole.POSTER)
                .extraInfo("Seeker " + seeker.getName() + " has marked the task as completed and submitted their work.")
                .build();

        notificationRepository.save(notification);

        log.info("✅ Task {} marked as completed by seeker {}. Notification stored for poster {}",
                task.getId(), seekerId, task.getPosterId());


        try {
            userRepository.findById(task.getPosterId()).ifPresent(poster -> {
                String token = poster.getFcmToken();
                if (token != null && !token.isBlank()) {
                    Map<String, Object> data = new HashMap<>();
                    data.put("type", "COMPLETION_REQUEST");
                    data.put("taskId", task.getId());
                    data.put("taskTitle", task.getTitle());
                    data.put("seekerName", seeker.getName());
                    data.put("taskStatus", task.getStatus().name());

                    expoPushService.sendNotification(
                            token,
                            "✅ Task Marked as Completed",
                            seeker.getName() + " has marked the task \"" + task.getTitle() + "\" as completed. Please review their submission and take action.",
                            data
                    );

                    log.info("📩 Sent FCM completion notification to poster {} for task {}", poster.getEmail(), task.getId());
                } else {
                    log.warn("⚠️ Poster {} has no valid FCM token", poster.getEmail());
                }
            });
        } catch (Exception e) {
            log.error("❌ Failed to send completion request notification for task {}: {}", task.getId(), e.getMessage());
        }


        return ResponseEntity.ok(Map.of(
                "message", "Task marked as completed successfully",
                "taskId", task.getId(),
                "completionNote", request.getNote(),
                "submittedLinks", request.getSubmissionLinks()
        ));
    }



}
