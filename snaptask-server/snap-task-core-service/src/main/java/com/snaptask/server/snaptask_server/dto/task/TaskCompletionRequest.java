package com.snaptask.server.snaptask_server.dto.task;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class TaskCompletionRequest {

    @NotBlank(message = "Task ID is required")
    private String taskId;

    @Size(max = 500, message = "Note must be at most 500 characters")
    private String note;

    private List<String> submissionLinks;
}
