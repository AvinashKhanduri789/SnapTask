package com.snaptask.server.snaptask_server.dto.task;

import com.snaptask.server.snaptask_server.dto.bid.AssignedBidInfoDto;
import com.snaptask.server.snaptask_server.dto.bid.PosterBidSummaryDto;
import com.snaptask.server.snaptask_server.enums.TaskStatus;
import com.snaptask.server.snaptask_server.enums.WorkMode;
import com.snaptask.server.snaptask_server.modals.embedded.TimelineStage;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for exposing detailed task information to a poster.
 * Contains both static task data and dynamic runtime fields (bids, timeline).
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PosterTaskDetailDto {

    @NotBlank(message = "Task ID cannot be blank")
    private String id;

    @NotBlank(message = "Title cannot be empty")
    @Size(min = 3, max = 120, message = "Title must be between 3 and 120 characters")
    private String title;

    @NotBlank(message = "Description cannot be empty")
    @Size(min = 10, max = 3000, message = "Description must be between 10 and 3000 characters")
    private String description;

    @PositiveOrZero(message = "Budget must be zero or a positive number")
    private double budget;

    @NotBlank(message = "Category cannot be blank")
    @Size(max = 60, message = "Category cannot exceed 60 characters")
    private String category;

    @NotNull(message = "Task status is required")
    private TaskStatus status;

    @FutureOrPresent(message = "Deadline must be present or in the future")
    private LocalDateTime deadline;

    @PastOrPresent(message = "Posted date cannot be in the future")
    private LocalDateTime postedOn;

    @NotNull(message = "Work mode is required")
    private WorkMode mode;

    @PositiveOrZero(message = "Bids count cannot be negative")
    private int bidsCount;

    @Valid
    @Size(max = 10, message = "Timeline cannot exceed 10 stages")
    private List<TimelineStage> timeline;

    @Valid
    @Size(max = 100, message = "Too many bids to serialize; please use pagination if needed")
    private List<PosterBidSummaryDto> bidsList;

    @PastOrPresent(message = "Created date cannot be in the future")
    private LocalDateTime createdAt;

    private AssignedBidInfoDto assignedBidInfo;

    private TaskCompletionRequest taskCompletionRequest;


}
