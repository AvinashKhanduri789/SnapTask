package com.snaptask.server.snaptask_server.modals.embedded;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompletionDetail {
    private boolean completed;
    private String note;
    private List<String> submissionLinks;
    private LocalDateTime completedOn;
    private Boolean approvedByPoster;
    private String posterFeedback;
    private LocalDateTime reviewedOn;
}