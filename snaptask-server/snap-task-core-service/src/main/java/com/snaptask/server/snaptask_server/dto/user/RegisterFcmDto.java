package com.snaptask.server.snaptask_server.dto.user;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class RegisterFcmDto {
    @NotBlank(message = "token required.")
    private String token;
}
