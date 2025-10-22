package com.snaptask.server.snaptask_server.dto.user;

import jakarta.validation.constraints.*;
import lombok.*;

import java.util.List;

/**
 * DTO for updating poster profile.
 * Only editable fields are included: name, phone, bio, workplace, address, skills.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePosterProfileDto {

    @NotBlank(message = "Name cannot be blank")
    @Size(min = 3, max = 100, message = "Name must be between 3 and 100 characters")
    private String name;

    @Size(max = 15, message = "Phone number cannot exceed 15 characters")
    private String phone;

    @Size(max = 150, message = "College/Workplace cannot exceed 150 characters")
    private String workplace;

    @Size(max = 2000, message = "Bio cannot exceed 2000 characters")
    private String bio;

    @Size(max = 500, message = "Skills cannot exceed 500 characters")
    private List<String> skills;
}