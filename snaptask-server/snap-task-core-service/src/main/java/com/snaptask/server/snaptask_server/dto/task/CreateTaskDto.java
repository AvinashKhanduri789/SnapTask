package com.snaptask.server.snaptask_server.dto.task;
import com.snaptask.server.snaptask_server.enums.WorkMode;
import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateTaskDto {

    @NotBlank(message = "Task title cannot be empty.")
    @Size(max = 150, message = "Task title cannot exceed 150 characters.")
    private String title;

    @NotBlank(message = "Task description cannot be empty.")
    @Size(max = 5000, message = "Task description cannot exceed 5000 characters.")
    private String description;

    @NotBlank(message = "Task category is required.")
    @Size(max = 100, message = "Task category cannot exceed 100 characters.")
    private String category;

    @NotNull(message = "work mode can not be blank")
    private WorkMode mode;

    @NotNull(message = "Task deadline is required.")
    @Future(message = "Deadline must be a future date and time.")
    private LocalDateTime deadline;

    @NotNull(message = "Please specify if the task is unpaid or paid.")
    private Boolean isUnpaid;

    @DecimalMin(value = "0.0", inclusive = true, message = "Budget must be zero or a positive number.")
    private double budget;

    @AssertTrue(message = "If the task is unpaid, the budget must be 0.")
    private boolean isBudgetConsistent() {
        return !Boolean.TRUE.equals(isUnpaid) || budget == 0.0;
    }
}