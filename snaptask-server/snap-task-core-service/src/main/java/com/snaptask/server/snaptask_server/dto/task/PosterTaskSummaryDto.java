package com.snaptask.server.snaptask_server.dto.task;

import com.snaptask.server.snaptask_server.enums.TaskStatus;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Lightweight DTO for showing poster's task summary (used on home/list screen).
 * Includes only the essential information to improve performance.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PosterTaskSummaryDto {

    @NotBlank(message = "Task ID cannot be blank")
    private String id;

    @NotBlank(message = "Task title cannot be empty")
    @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
    private String title;

    private String description;

    @PositiveOrZero(message = "Budget must be zero or a positive number")
    private double budget;

    @FutureOrPresent(message = "Deadline must be in the present or future")
    private LocalDateTime deadline;

    @PositiveOrZero(message = "Bids count cannot be negative")
    private int bidsCount;

    @NotNull(message = "Task status is required")
    private TaskStatus status;

    @NotBlank(message = "Category is required")
    @Size(max = 50, message = "Category cannot exceed 50 characters")
    private String category;

    @PastOrPresent(message = "Created date cannot be in the future")
    private LocalDateTime createdAt;
}
