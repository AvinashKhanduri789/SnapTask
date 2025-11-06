package com.snaptask.server.snaptask_server.controller.seeker;

import com.snaptask.server.snaptask_server.dto.task.CreateBidDto;
import com.snaptask.server.snaptask_server.modals.Task;
import com.snaptask.server.snaptask_server.service.task.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/seeker")
public class SeekerController {
    private final TaskService taskService;
    SeekerController(TaskService taskService){
        this.taskService = taskService;
    }
    @GetMapping("/health")
    public String healthCheck(){
        return "working...";
    }

    @GetMapping("/tasks/summery")
    public ResponseEntity<?> getTasksByCategory(@RequestParam String category) {
        if (category == null || category.isBlank()) {
            return ResponseEntity.badRequest().body("Category must not be empty.");
        }
        return taskService.getSeekerTaskSummery(category);
    }

    @GetMapping("/tasks/assigned")
    public ResponseEntity<?> getAssignedTaskSummery() {
        return taskService.getAssignedTasksForSeeker();
    }

    @GetMapping("/tasks/completed")
    public ResponseEntity<?> getCompletedTaskSummery() {
        return taskService.getCompletedTasksForSeeker();
    }

    @GetMapping("/tasks/{taskId}")
    public ResponseEntity<?> getTaskDetails(@PathVariable String taskId) {
        return taskService.getSeekerTaskDetails(taskId);
    }

    @PostMapping("/makeBid")
    public ResponseEntity<?> makeBid(@Valid @RequestBody CreateBidDto dto) {
        return taskService.makeBid(dto);
    }

}
