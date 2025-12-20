package com.snaptask.server.snaptask_server.dto.auth;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VerifyUserDto {
    @NotBlank(message = "Email can't be blank")
    @Email(message = "Pls enter a valid email formate")
    private String email;

    @NotBlank(message = "Otp can't be blank")
    @Size(min = 6,max = 6, message = "6 digit code required")
    private String otp;
}
