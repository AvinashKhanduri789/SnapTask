package com.snaptask.server.snaptask_server.dto.task;

import jakarta.validation.constraints.*;
import lombok.*;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateBidDto {

    @NotBlank(message = "Task ID cannot be blank")
    private String taskId;

    @NotBlank(message = "Tagline cannot be blank")
    private String tagline;

    @NotBlank(message = "Proposal cannot be blank")
    @Size(min = 10, message = "Proposal must be at least 10 characters long")
    private String proposal;

    private List<String> similarWorks;
    private String portfolio;

    @NotNull(message = "Bid amount is required")
    @DecimalMin(value = "1.0", message = "Bid amount must be greater than zero")
    private Double bidAmount;

    private boolean canCompleteInTime;

    @NotBlank(message = "Communication preference is required")
    private String communicationPreference;

    private String communicationDetail;
}
