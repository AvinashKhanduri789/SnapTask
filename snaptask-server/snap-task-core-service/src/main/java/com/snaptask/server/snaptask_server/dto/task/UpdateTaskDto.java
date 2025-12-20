package com.snaptask.server.snaptask_server.dto.task;


import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * DTO for updating a Task.
 * Only fields that are allowed to be updated are included.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateTaskDto {

    @NotBlank(message = "taskId can not be blank")
    private String taskId;

    @Size(max = 150, message = "Title must not exceed 150 characters")
    private String title;

    @Size(max = 5000, message = "Description must not exceed 5000 characters")
    private String description;

    @Size(max = 100, message = "Category must not exceed 100 characters")
    private String category;

    @DecimalMin(value = "0.0", inclusive = true, message = "Budget must be greater than or equal to 0")
    private Double budget;

    @Future(message = "Deadline must be in the future")
    private LocalDateTime deadline;

    public boolean hasUpdates() {
        return title != null || description != null || category != null || budget != null || deadline != null;
    }
}