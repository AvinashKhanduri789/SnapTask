package com.snaptask.server.snaptask_server.dto.task;

import lombok.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.List;

/**
 * Represents a detailed task view for seekers.
 * Includes nested poster information for frontend task details.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SeekerTaskDetail {

    @NotBlank
    private String id;

    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @NotNull
    @PositiveOrZero
    private BigDecimal budget;

    @NotBlank
    private String location;

    @NotBlank
    private String deadline;

    @NotBlank
    private String applicants;  // could be derived or converted to int if needed

    @NotEmpty
    private List<String> skills;

    @NotBlank
    private String status;

    @NotBlank
    private String projectType;

    @NotNull
    private PostedBy postedBy;

    private boolean alredyMadebid;

    private boolean isAssignedToMe;


    /**
     * Nested class representing task poster info.
     * Encapsulates key details about the person who posted the task.
     */
    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PostedBy {

        @NotBlank
        private String name;

        @NotBlank
        private String role;

        @NotBlank
        private String experience;

        @DecimalMin("0.0")
        @DecimalMax("5.0")
        private Double rating;

        @PositiveOrZero
        private Integer completedTasks;

        @NotBlank
        private String responseTime;

        @NotBlank
        private String memberSince;
    }
}
