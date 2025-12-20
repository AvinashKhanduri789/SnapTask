package com.snaptask.server.snaptask_server.modals.embedded;
import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimelineStage {
    private String stage;     // e.g. "Created", "Assigned", etc.
    private LocalDateTime date;
    private boolean completed;
}
