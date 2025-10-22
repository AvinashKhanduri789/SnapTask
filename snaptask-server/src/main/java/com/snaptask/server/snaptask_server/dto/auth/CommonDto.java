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
public class CommonDto {
    @NotBlank(message = "Email can't be blank")
    @Email(message = "Please enter a valid email")
    private String email;

    @Size(min = 6, max = 6, message = "6 digit code required")
    private String code;
}
