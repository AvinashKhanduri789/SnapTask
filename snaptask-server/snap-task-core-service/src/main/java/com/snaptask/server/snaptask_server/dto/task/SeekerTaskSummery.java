package com.snaptask.server.snaptask_server.dto.task;

import lombok.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO representing a summarized view of a task.
 * Suitable for API responses showing lightweight task info
 * such as in task listings or dashboards.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SeekerTaskSummery {

    private String id;

    private String title;

    private String description;

    private BigDecimal budget;

    private String location;

    private LocalDateTime deadline;

    private LocalDateTime postedTime;

    private int applicantsCount;

    private List<String> skills;

    private String status;
    
    private boolean alredyMadebid;
}
