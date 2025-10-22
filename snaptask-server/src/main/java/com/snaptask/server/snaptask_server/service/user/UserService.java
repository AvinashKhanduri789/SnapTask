package com.snaptask.server.snaptask_server.service.user;

import com.snaptask.server.snaptask_server.dto.user.PosterProfileDto;
import com.snaptask.server.snaptask_server.dto.user.SetLocationDto;
import com.snaptask.server.snaptask_server.dto.user.UpdatePosterProfileDto;
import com.snaptask.server.snaptask_server.exceptions.customExceptions.ResourceNotFoundException;
import com.snaptask.server.snaptask_server.modals.User;
import com.snaptask.server.snaptask_server.repository.user.UserRepository;
import com.snaptask.server.snaptask_server.util.Helper;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final Helper helper;

    public UserService(
            UserRepository userRepository,
            Helper helper
    ){
        this.userRepository = userRepository;
        this.helper = helper;
    }

    public ResponseEntity<?> setLocation(SetLocationDto dto) {
        User user = helper.getCurrentLoggedInUser();
        user.setGeoJsonPoint(new GeoJsonPoint(dto.getLongitude(), dto.getLatitude()));
        user.setAddress(dto.getAddress());
        userRepository.save(user);
        return ResponseEntity.ok("Location updated successfully");
    }

    @Transactional(readOnly = true)
    public PosterProfileDto getPosterProfile() {
        helper.getCurrentLoggedInUser().getEmail();

        User user = helper.getCurrentLoggedInUser();
        return PosterProfileDto.builder()
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
    public ResponseEntity<String> updatePosterProfile(UpdatePosterProfileDto dto) {
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

}
