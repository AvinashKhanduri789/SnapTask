package com.snaptask.server.snaptask_server.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginUserDto {

    @NotBlank(message = "email required")
    @Email(message = "wrong email formate")
    private String email;


    @NotBlank(message = "password required")
    private String password;


}
