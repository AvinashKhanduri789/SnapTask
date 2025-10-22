package com.snaptask.server.snaptask_server.dto.task;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO to delete a Task by its ID.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeleteTaskDto {

    @NotBlank(message = "Task ID cannot be blank")
    private String taskId;
}