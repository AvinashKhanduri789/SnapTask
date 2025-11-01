package com.snaptask.server.snaptask_server.dto.bid;

import jakarta.validation.constraints.*;
import lombok.*;

/**
 * Lightweight summary of a bid for poster-side task details.
 * Used in task detail responses and bid listing screens.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PosterBidSummaryDto {

    @NotBlank(message = "Bid ID cannot be blank")
    private String id;

    @NotBlank(message = "Seeker name cannot be blank")
    private String seekerName;

    @Size(max = 150, message = "Tagline cannot exceed 150 characters")
    private String tagline;

    @DecimalMin(value = "0.0", inclusive = true, message = "Rating cannot be negative")
    @DecimalMax(value = "5.0", inclusive = true, message = "Rating cannot exceed 5.0")
    private double rating;

    @PositiveOrZero(message = "Bid amount must be zero or a positive number")
    private double bidAmount;

    @Size(max = 100, message = "Timeline summary cannot exceed 100 characters")
    private String timeline;

    @Size(max = 2000, message = "Message cannot exceed 2000 characters")
    private String message;

    @PositiveOrZero(message = "Completed tasks count cannot be negative")
    private int completedTasks;
}