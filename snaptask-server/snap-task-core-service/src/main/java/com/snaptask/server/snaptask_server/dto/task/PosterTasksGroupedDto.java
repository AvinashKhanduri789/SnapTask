package com.snaptask.server.snaptask_server.dto.task;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PosterTasksGroupedDto {
    private List<PosterTaskSummaryDto> active;
    private List<PosterTaskSummaryDto> pending;
    private List<PosterTaskSummaryDto> completed;
}
