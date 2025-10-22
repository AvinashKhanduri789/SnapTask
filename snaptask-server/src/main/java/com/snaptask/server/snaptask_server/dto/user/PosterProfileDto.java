package com.snaptask.server.snaptask_server.dto.user;

import com.snaptask.server.snaptask_server.enums.UserRole;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO representing poster's profile information.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PosterProfileDto {

    @NotBlank(message = "User ID cannot be blank")
    private String id;

    @NotBlank(message = "Name cannot be blank")
    @Size(min = 3, max = 100, message = "Name must be between 3 and 100 characters")
    private String name;

    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Email must be valid")
    private String email;

    @Size(max = 15, message = "Phone number cannot exceed 15 characters")
    private String phone;

    @Size(max = 150, message = "College/Workplace cannot exceed 150 characters")
    private String workplace;

    @Size(max = 200, message = "Address cannot exceed 200 characters")
    private String address;

    @Size(max = 2000, message = "Bio cannot exceed 2000 characters")
    private String bio;

    @Size(max = 500, message = "Skills cannot exceed 500 characters")
    private List<String> skills;

    @NotNull(message = "Role is required")
    private UserRole role;

    @DecimalMin(value = "0.0", inclusive = true, message = "Rating cannot be negative")
    @DecimalMax(value = "5.0", inclusive = true, message = "Rating cannot exceed 5")
    private double rating;

    @PastOrPresent(message = "Join date cannot be in the future")
    private LocalDateTime joinDate;

    @PastOrPresent(message = "Last updated date cannot be in the future")
    private LocalDateTime updatedAt;
}