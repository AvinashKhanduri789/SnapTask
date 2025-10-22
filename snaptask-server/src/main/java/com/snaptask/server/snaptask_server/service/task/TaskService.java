package com.snaptask.server.snaptask_server.service.task;

import com.snaptask.server.snaptask_server.dto.bid.PosterBidSummaryDto;
import com.snaptask.server.snaptask_server.dto.task.*;
import com.snaptask.server.snaptask_server.enums.TaskStatus;
import com.snaptask.server.snaptask_server.enums.UserRole;
import com.snaptask.server.snaptask_server.enums.WorkMode;
import com.snaptask.server.snaptask_server.exceptions.customExceptions.ResourceNotFoundException;
import com.snaptask.server.snaptask_server.modals.Bid;
import com.snaptask.server.snaptask_server.modals.Task;
import com.snaptask.server.snaptask_server.modals.User;
import com.snaptask.server.snaptask_server.repository.bid.BidRepository;
import com.snaptask.server.snaptask_server.repository.task.TaskRepository;
import com.snaptask.server.snaptask_server.repository.user.UserRepository;
import com.snaptask.server.snaptask_server.util.Helper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Metrics;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Slf4j
public class TaskService {
    private final TaskRepository taskRepository;
    private final Helper helper;
    private final UserRepository userRepository;
    private final BidRepository bidRepository;
    public TaskService(
            TaskRepository taskRepository,
            Helper helper,
            UserRepository userRepository,
            BidRepository bidRepository
    ){
        this.taskRepository = taskRepository;
        this.helper = helper;
        this.userRepository = userRepository;
        this.bidRepository = bidRepository;
    }

    @Async
    public void notifySeekersForTask(Task task, GeoJsonPoint posterLocation) {
        if (task == null) {
            log.warn("Task is null, skipping notifications");
            return;
        }

        List<User> targetSeekers = new ArrayList<>();

        try {
            if (task.getMode() == WorkMode.ONSITE) {
                if (posterLocation == null) {
                    log.warn("ON_SITE task {} missing poster location, skipping geo notifications", task.getId());
                } else {
                    targetSeekers = userRepository.findByRoleAndGeoJsonPointNear(
                            UserRole.SEEKER,
                            posterLocation,
                            new Distance(10, Metrics.KILOMETERS)
                    );
                    log.info("Found {} seekers within 10 km for task {}", targetSeekers.size(), task.getId());
                }
            } else if (task.getMode() == WorkMode.REMOTE) {
                targetSeekers = userRepository.findByRoleAndSkillsIn(
                        UserRole.SEEKER,
                        List.of(task.getCategory()) // Or a skill list if more complex matching
                );
                log.info("Found {} remote seekers for task {} based on skills/category", targetSeekers.size(), task.getId());
            } else {
                log.warn("Task {} has unknown work mode {}, skipping notifications", task.getId(), task.getMode());
                return;
            }


            if (targetSeekers.isEmpty()) {
                log.info("No seekers to notify for task {}", task.getId());
                return;
            }


            targetSeekers.forEach(seeker -> {
                try {
//                    if (seeker.getFcmToken() == null || seeker.getFcmToken().isBlank()) {
//                        log.warn("Seeker {} does not have FCM token, skipping", seeker.getId());
//                        return;
//                    }
//                    fcmService.sendNotification(
//                            seeker.getFcmToken(),
//                            "New Task Available!",
//                            task.getTitle() + " - " + task.getCategory()
//                    );
                } catch (Exception e) {
                    log.error("Failed to send notification to seeker {}: {}", seeker.getId(), e.getMessage(), e);
                }
            });

            log.info("Notification process completed for task {} ({} seekers notified)", task.getId(), targetSeekers.size());

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

//        notifySeekersForTask(savedTask,helper.getCurrentLoggedInUser().getGeoJsonPoint());


        return ResponseEntity.status(HttpStatus.CREATED).body("Task created successfully");
    }

    public ResponseEntity<String> updateTask(UpdateTaskDto dto) {
        // Validate taskId
        if (dto.getTaskId() == null || dto.getTaskId().isBlank()) {
            return ResponseEntity.badRequest().body("Task ID must not be blank");
        }

        Task task;
        try {
            task = taskRepository.findById(dto.getTaskId())
                    .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + dto.getTaskId()));
        } catch (Exception e) {
            log.error("Error fetching task with id {}: {}", dto.getTaskId(), e.getMessage());
            throw e; // Let global exception handler handle it
        }

        // Optional: verify current user is owner of the task
        String currentUserId = helper.getCurrentLoggedInUser().getId();
        if (!task.getPosterId().equals(currentUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not allowed to update this task");
        }

        // Update fields if present
        if (dto.getTitle() != null) task.setTitle(dto.getTitle().trim());
        if (dto.getDescription() != null) task.setDescription(dto.getDescription().trim());
        if (dto.getCategory() != null) task.setCategory(dto.getCategory().trim());
        if (dto.getBudget() != null) task.setBudget(dto.getBudget());
        if (dto.getDeadline() != null) task.setDeadline(dto.getDeadline());

        task.setUpdatedAt(LocalDateTime.now());

        // Save updated task
        try {
            taskRepository.save(task);
            log.info("Task {} updated successfully by user {}", task.getId(), currentUserId);
        } catch (Exception e) {
            log.error("Error updating task {}: {}", task.getId(), e.getMessage());
            throw e;
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
}
