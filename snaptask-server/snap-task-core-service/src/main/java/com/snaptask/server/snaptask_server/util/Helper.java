package com.snaptask.server.snaptask_server.util;

import com.snaptask.server.snaptask_server.enums.UserRole;
import com.snaptask.server.snaptask_server.enums.WorkMode;
import com.snaptask.server.snaptask_server.modals.Task;
import com.snaptask.server.snaptask_server.modals.User;
import com.snaptask.server.snaptask_server.repository.user.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Metrics;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Random;

@Component
@Slf4j
public class Helper {
    private final UserRepository userRepository;

    public Helper(UserRepository userRepository){
        this.userRepository  = userRepository;
    }
    public String generateVerificationCode() {
        Random random = new Random();
        int code = random.nextInt(900000) + 100000;
        return String.valueOf(code);
    }

    public User getCurrentLoggedInUser() {
        var context = SecurityContextHolder.getContext();
        if (context == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Security context is missing. User may not be authenticated.");
        }

        Authentication authentication = context.getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No authenticated user found in security context.");
        }

        String email = authentication.getName();
        if (email == null || email.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authenticated user has no email set.");
        }

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "User with email '" + email + "' not found."));
    }

    public List<User> findEligibleSeekers(Task task, GeoJsonPoint posterLocation) {
        if (task.getMode() == WorkMode.ONSITE) {
            if (posterLocation == null) {
                log.warn("ON_SITE task {} missing poster location, skipping geo notifications", task.getId());
                return List.of();
            }
            var seekers = userRepository.findByRoleAndGeoJsonPointNear(
                    UserRole.SEEKER,
                    posterLocation,
                    new Distance(10, Metrics.KILOMETERS)
            );
            log.info("Found {} seekers within 10 km for task {}", seekers.size(), task.getId());
            return seekers;
        }

        if (task.getMode() == WorkMode.REMOTE) {
            var seekers = userRepository.findByRoleAndSkillsIn(
                    UserRole.SEEKER,
                    List.of(task.getCategory())
            );
            log.info("Found {} remote seekers for task {} based on skills/category", seekers.size(), task.getId());
            return seekers;
        }

        log.warn("Task {} has unknown work mode {}, skipping notifications", task.getId(), task.getMode());
        return List.of();
    }

}
