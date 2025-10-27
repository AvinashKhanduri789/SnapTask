package com.snaptask.server.snaptask_server.service.user;

import com.snaptask.server.snaptask_server.dto.notification.PosterNotificationDto;
import com.snaptask.server.snaptask_server.dto.user.ProfileDto;
import com.snaptask.server.snaptask_server.dto.user.RegisterFcmDto;
import com.snaptask.server.snaptask_server.dto.user.SetLocationDto;
import com.snaptask.server.snaptask_server.enums.NotificationStatus;
import com.snaptask.server.snaptask_server.modals.Notification;
import com.snaptask.server.snaptask_server.modals.User;
import com.snaptask.server.snaptask_server.repository.notification.NotificationRepository;
import com.snaptask.server.snaptask_server.repository.user.UserRepository;
import com.snaptask.server.snaptask_server.util.Helper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
@Transactional
public class UserService {
    private final UserRepository userRepository;
    private final Helper helper;
    private final NotificationRepository notificationRepository;


    public UserService(
            UserRepository userRepository,
            Helper helper,
            NotificationRepository notificationRepository
    ){
        this.userRepository = userRepository;
        this.helper = helper;
        this.notificationRepository = notificationRepository;
    }
    public ResponseEntity<?> setLocation(SetLocationDto dto) {
        User user = helper.getCurrentLoggedInUser();
        user.setGeoJsonPoint(new GeoJsonPoint(dto.getLongitude(), dto.getLatitude()));
        user.setAddress(dto.getAddress());
        userRepository.save(user);
        return ResponseEntity.ok("Location updated successfully");
    }

    public ResponseEntity<?> registerFcm(RegisterFcmDto dto){
        User user = helper.getCurrentLoggedInUser();

        // 3️⃣ Idempotent update — update only if changed
        String existingToken = user.getFcmToken();
        if (dto.getToken().equals(existingToken)) {
            return ResponseEntity
                    .ok("Token already up-to-date");
        }

        user.setFcmToken(dto.getToken());
        log.info("✅ FCM token updated for user: {}", user.getEmail());
        return ResponseEntity.ok("Token saved successfully");
    }

    @Transactional(readOnly = true)
    public ProfileDto getProfile() {
        User user = helper.getCurrentLoggedInUser();
        return ProfileDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .workplace(user.getWorkplace())
                .address(user.getAddress())
                .bio(user.getBio())
                .skills(user.getSkills())
                .role(user.getRole())
                .rating(user.getRating())
                .joinDate(user.getJoinDate())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    @Transactional
    public ResponseEntity<String> updateProfile(ProfileDto dto) {
        User currentUser = helper.getCurrentLoggedInUser();

        boolean isUpdated = false;

        if (dto.getName() != null && !dto.getName().equals(currentUser.getName())) {
            currentUser.setName(dto.getName());
            isUpdated = true;
        }

        if (dto.getPhone() != null && !dto.getPhone().equals(currentUser.getPhone())) {
            currentUser.setPhone(dto.getPhone());
            isUpdated = true;
        }

        if (dto.getWorkplace() != null && !dto.getWorkplace().equals(currentUser.getWorkplace())) {
            currentUser.setWorkplace(dto.getWorkplace());
            isUpdated = true;
        }

        if (dto.getBio() != null && !dto.getBio().equals(currentUser.getBio())) {
            currentUser.setBio(dto.getBio());
            isUpdated = true;
        }

        if (dto.getSkills() != null && !dto.getSkills().equals(currentUser.getSkills())) {
            currentUser.setSkills(dto.getSkills());
            isUpdated = true;
        }
        if (isUpdated) {
            currentUser.setUpdatedAt(LocalDateTime.now());
            userRepository.save(currentUser);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_MODIFIED)
                    .body("No changes detected in the profile.");
        }

        return ResponseEntity.ok("Profile updated successfully.");
    }

    public ResponseEntity<List<PosterNotificationDto>> getAllPosterNotifications() {
        User user = helper.getCurrentLoggedInUser();
        List<Notification> notifications =
                notificationRepository.findByReceiverIdsContainingAndStatus(user.getId(), NotificationStatus.NEW);

        if (notifications.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        List<PosterNotificationDto> notificationDtos = notifications.stream()
                .map(n -> PosterNotificationDto.builder()
                        .id(n.getId())
                        .type(n.getType())
                        .seekerName(n.getSeekerName())
                        .taskTitle(n.getTaskTitle())
                        .time(n.getCreatedAt() != null ? n.getCreatedAt().toString() : null)
                        .seekerRating(n.getSeekerRating())
                        .completedTasks(n.getCompletedTasks())
                        .message(n.getMessage())
                        .bidAmount(n.getExtraInfo())
                        .timeline(n.getTimeline())
                        .status(n.getStatus())
                        .build()
                ).toList();

        return ResponseEntity.ok(notificationDtos);
    }

}
