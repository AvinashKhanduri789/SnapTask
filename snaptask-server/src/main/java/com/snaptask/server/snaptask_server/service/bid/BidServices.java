package com.snaptask.server.snaptask_server.service.bid;

import com.snaptask.server.snaptask_server.dto.bid.PosterBidDetailDto;
import com.snaptask.server.snaptask_server.enums.*;
import com.snaptask.server.snaptask_server.exceptions.customExceptions.ResourceNotFoundException;
import com.snaptask.server.snaptask_server.modals.Bid;
import com.snaptask.server.snaptask_server.modals.Notification;
import com.snaptask.server.snaptask_server.modals.User;
import com.snaptask.server.snaptask_server.repository.bid.BidRepository;
import com.snaptask.server.snaptask_server.repository.notification.NotificationRepository;
import com.snaptask.server.snaptask_server.repository.task.TaskRepository;
import com.snaptask.server.snaptask_server.repository.user.UserRepository;
import com.snaptask.server.snaptask_server.service.ExpoPushService;
import com.snaptask.server.snaptask_server.service.FirebaseService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.mongodb.core.aggregation.ArithmeticOperators;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
public class BidServices {
    private final BidRepository bidRepository;
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final ExpoPushService expoPushService;
    private final NotificationRepository notificationRepository;

    public BidServices(
            BidRepository bidRepository,
            UserRepository userRepository,
            TaskRepository taskRepository,
            ExpoPushService expoPushService,
            NotificationRepository notificationRepository

    ){
        this.bidRepository = bidRepository;
        this.userRepository = userRepository;
        this.taskRepository= taskRepository;
        this.expoPushService = expoPushService;
        this.notificationRepository = notificationRepository;
    }


    @Transactional(readOnly = true)
    public ResponseEntity<?> getBidDetail(String id) {

        Optional<Bid> bidOpt = bidRepository.findById(id);
        if (bidOpt.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Bid not found", "bidId", id));
        }

        Bid bid = bidOpt.get();


        Optional<User> seekerOpt = userRepository.findById(bid.getSeekerId());
        User seeker = seekerOpt.orElse(null); // safe fallback


        PosterBidDetailDto dto = PosterBidDetailDto.builder()
                .id(bid.getId())
                .taskId(bid.getTaskId())
                .seekerName(nonNull(bid.getSeekerName(), seeker != null ? seeker.getName() : "Unknown"))
                .tagline(nonNull(bid.getTagline(), ""))
                .bio(nonNull(bid.getBio(), seeker != null ? seeker.getBio() : ""))
                .rating(String.valueOf(bid.getRating()))
                .completedTasks(String.valueOf(bid.getCompletedTasks()))
                .bidAmount(String.valueOf(bid.getBidAmount()))
                .timeline(nonNull(bid.getSuccessRate(), "Not specified"))
                .proposal(nonNull(bid.getProposal(), ""))
                .similarWorkLinks(bid.getSimilarWorks() != null ? bid.getSimilarWorks() : List.of())
                .canCompleteInTime(String.valueOf(bid.isCanCompleteInTime()))
                .communicationPreference(nonNull(bid.getCommunicationPreference(), "Not specified"))
                .communicationDetail(nonNull(bid.getCommunicationDetail(), ""))
                .bidStatus(bid.getBidStatus() != null ? bid.getBidStatus().name() : "PENDING")
                .portfolio(nonNull(bid.getPortfolio().getFirst(), ""))
                .responseTime(nonNull(bid.getResponseTime(),
                        seeker != null && seeker.getBio() != null ? seeker.getBio() : "N/A"))
                .memberSince(nonNull(bid.getMemberSince(),
                        seeker != null && seeker.getJoinDate() != null
                                ? seeker.getJoinDate().getMonth() + " " + seeker.getJoinDate().getYear()
                                : "N/A"))
                .build();


        return ResponseEntity.ok(dto);
    }


    private String nonNull(String value, String fallback) {
        return (value != null && !value.isBlank()) ? value : fallback;
    }


    @Transactional
    public ResponseEntity<?> acceptBid(String bidId) {
        var bid = bidRepository.findById(bidId)
                .orElseThrow(() -> new ResourceNotFoundException("Bid not found"));

        var task = taskRepository.findById(bid.getTaskId())
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        if (task.isAssigned()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Task already assigned"));
        }


        bid.setBidStatus(BidStatus.ACCEPTED);
        bid.setUpdatedAt(LocalDateTime.now());
        bidRepository.save(bid);

        task.setAssignedSeekerId(bid.getSeekerId());
        task.setAssignedBidId(bid.getId());
        task.setAssigned(true);
        task.setStatus(TaskStatus.PENDING);
        taskRepository.save(task);


        List<Bid> otherBids = bidRepository.findByTaskId(task.getId());
        otherBids.stream()
                .filter(b -> !b.getId().equals(bid.getId()))
                .forEach(b -> {
                    b.setBidStatus(BidStatus.REJECTED);
                    b.setUpdatedAt(LocalDateTime.now());
                });
        bidRepository.saveAll(otherBids);


        Optional<User> posterOpt = userRepository.findById(task.getPosterId());
        Optional<User> seekerOpt = userRepository.findById(bid.getSeekerId());
        if (posterOpt.isEmpty() || seekerOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Poster or Seeker not found"));
        }

        User poster = posterOpt.get();
        User seeker = seekerOpt.get();


        Notification acceptedNotification = Notification.builder()
                .receiverIds(List.of(seeker.getId()))
                .senderId(poster.getId())
                .senderName(poster.getName())
                .taskId(task.getId())
                .taskTitle(task.getTitle())
                .message("Your bid for task \"" + task.getTitle() + "\" has been accepted by " + poster.getName() + ".")
                .type(NotificationType.BID)
                .status(NotificationStatus.NEW)
                .userRole(UserRole.POSTER)
                .targetRole(UserRole.SEEKER)
                .posterName(poster.getName())
                .posterRating(poster.getRating())
                .budget(task.getBudget().toString())
                .deadline(task.getDeadline().toString())
                .updateInfo("Bid accepted, task assigned")
                .createdAt(Instant.now())
                .build();

        try {
            notificationRepository.save(acceptedNotification);
        } catch (Exception e) {
            log.error("Failed to save accepted notification entity: {}", e.getMessage());
        }


        try {
            if (seeker.getFcmToken() != null && !seeker.getFcmToken().isBlank()) {
                Map<String, Object> data = Map.of(
                        "type", "BID_ACCEPTED",
                        "taskId", task.getId(),
                        "taskTitle", task.getTitle(),
                        "posterName", poster.getName()
                );

                expoPushService.sendNotification(
                        seeker.getFcmToken(),
                        "🎉 Your Bid Was Accepted!",
                        "Your bid on \"" + task.getTitle() + "\" was accepted by " + poster.getName() + ".",
                        data
                );
            }
        } catch (Exception e) {
            log.error("Failed to send Expo notification to seeker: {}", e.getMessage());
        }


        return ResponseEntity.ok(Map.of("message", "Bid accepted, task assigned, and notifications sent."));
    }

    @Transactional
    public ResponseEntity<?> rejectBid(String bidId) {
        var bid = bidRepository.findById(bidId)
                .orElseThrow(() -> new ResourceNotFoundException("Bid not found"));

        if (bid.getBidStatus() == BidStatus.REJECTED) {
            return ResponseEntity.badRequest().body(Map.of("message", "Bid already rejected"));
        }

        bid.setBidStatus(BidStatus.REJECTED);
        bid.setUpdatedAt(LocalDateTime.now());
        bidRepository.save(bid);

        return ResponseEntity.ok(Map.of("message", "Bid rejected successfully"));
    }






}
