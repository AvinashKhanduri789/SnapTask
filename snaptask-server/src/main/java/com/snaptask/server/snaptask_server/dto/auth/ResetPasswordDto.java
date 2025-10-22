package com.snaptask.server.snaptask_server.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;


/**
 * DTO for handling password reset requests.
 */
@Getter
@Setter
public class ResetPasswordDto {

    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Please enter a valid email format")
    private String email;

    @NotBlank(message = "New password cannot be blank")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    private String newPassword;
}
