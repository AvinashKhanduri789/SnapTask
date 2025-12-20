package com.snaptask.server.snaptask_server.dto.auth;

import com.snaptask.server.snaptask_server.enums.UserRole;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RegisterUserDto {

    @NotBlank(message = "Name is required")
    private String userName;

    @Email(message = "Invalid email formate")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Pattern(
            regexp = "^[0-9]{10}$",
            message = "Phone number must be 10 digits"
    )
    private String phone;


    @NotBlank(message = "phone number is required")
    @Size(min = 8, message = "Password length should be minimum 8")
    private String password;

    @NotNull(message = "User role required")
    private UserRole role;

}
