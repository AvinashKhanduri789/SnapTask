package com.snaptask.server.snaptask_server.controller.poster;

import com.snaptask.server.snaptask_server.dto.notification.PosterNotificationDto;
import com.snaptask.server.snaptask_server.dto.user.ProfileDto;
import com.snaptask.server.snaptask_server.dto.user.RegisterFcmDto;
import com.snaptask.server.snaptask_server.dto.user.SetLocationDto;
import com.snaptask.server.snaptask_server.dto.user.UpdatePosterProfileDto;
import com.snaptask.server.snaptask_server.service.task.TaskService;
import com.snaptask.server.snaptask_server.service.user.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/poster/profile")
public class PosterProfileController {
    private final UserService userService;

    @Autowired
    private TaskService taskService;
    public PosterProfileController(UserService userService){
        this.userService = userService;
    }

    /**
     * Update the poster’s current location.
     * Example: PUT /poster/profile/location
     */
    @PutMapping("/location")
    public ResponseEntity<?> updateLocation(@Valid @RequestBody SetLocationDto dto) {
        return userService.setLocation(dto);
    }

    /**
     * Register or update FCM token (for push notifications).
     * Example: POST /poster/profile/fcm
     */
    @PostMapping("/fcm")
    public ResponseEntity<?> registerFcm(@Valid @RequestBody RegisterFcmDto dto) {
        return userService.registerFcm(dto);
    }

    /**
     *  Fetch current logged-in poster’s profile.
     * Example: GET /poster/profile
     */
    @GetMapping
    public ResponseEntity<ProfileDto> getProfile() {
        return ResponseEntity.ok(userService.getProfile());
    }

    /**
     * Update editable fields in poster’s profile.
     * Example: PUT /poster/profile
     */
    @PutMapping
    public ResponseEntity<String> updateProfile(@Valid @RequestBody UpdatePosterProfileDto dto) {
        return userService.updateProfile(dto);
    }

    /**
     * Get all active notifications for this poster.
     * Example: GET /poster/profile/notifications
     */
    @GetMapping("/notifications")
    public ResponseEntity<List<PosterNotificationDto>> getPosterNotifications() {
        return userService.getAllPosterNotifications();
    }

//    test controller
     @PostMapping("/test")
    public String testPushNotification(@RequestParam String token){
        taskService.sendPushNotification(token, "this is test title ", "working fine ");
        return "notfication send successfully";
     }

}
