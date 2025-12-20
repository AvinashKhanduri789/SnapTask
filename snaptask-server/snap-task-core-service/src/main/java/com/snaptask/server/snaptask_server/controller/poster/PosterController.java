package com.snaptask.server.snaptask_server.controller.poster;

import com.snaptask.server.snaptask_server.dto.task.*;
import com.snaptask.server.snaptask_server.modals.Task;
import com.snaptask.server.snaptask_server.service.bid.BidServices;
import com.snaptask.server.snaptask_server.service.task.TaskService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/poster")
public class PosterController {

    private final TaskService taskService;
    private final BidServices bidServices;

    public PosterController(
            TaskService taskService,
            BidServices bidServices
    ){
        this.taskService = taskService;
        this.bidServices = bidServices;
    }

    @GetMapping("/health")
    public String healthCheck(){
        return "working...";
    }


    @PostMapping("/create")
    public ResponseEntity<String> createTask(@Valid @RequestBody CreateTaskDto dto) {
        return taskService.createTask(dto);
    }


    @PutMapping("/update")
    public ResponseEntity<String> updateTask(@Valid @RequestBody UpdateTaskDto dto) {
        return taskService.updateTask(dto);
    }


    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteTask(@Valid @RequestBody DeleteTaskDto dto) {
        return taskService.deleteTask(dto);
    }

    @GetMapping("tasks/summary")
    public ResponseEntity<PosterTasksGroupedDto> getPosterTasksSummary() {
        return taskService.getPosterTasksSummary();
    }

    @GetMapping("task/{taskId}")
    public ResponseEntity<PosterTaskDetailDto> getPosterTaskDetails(
            @PathVariable @NotBlank(message = "Task ID cannot be blank") String taskId
    ) {
        return taskService.getPosterTaskDetails(taskId);
    }


    @GetMapping("/bidDetails/{id}")
    public ResponseEntity<?> getBidDetail(@PathVariable String id) {
        return bidServices.getBidDetail(id);
    }


    @PostMapping("/{bidId}/accept")
    public ResponseEntity<?> acceptBid(@PathVariable String bidId) {
        return bidServices.acceptBid(bidId);
    }


    @PostMapping("/{bidId}/reject")
    public ResponseEntity<?> rejectBid(@PathVariable String bidId) {
        return bidServices.rejectBid(bidId);
    }

    @PostMapping("/{taskId}/approve_completion")
    public ResponseEntity<Map<String, Object>> approveTaskCompletion(@PathVariable String taskId) {
        return taskService.approveTaskCompletion(taskId);
    }


}
