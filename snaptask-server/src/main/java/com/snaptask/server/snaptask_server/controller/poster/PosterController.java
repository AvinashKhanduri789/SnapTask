package com.snaptask.server.snaptask_server.controller.poster;

import com.snaptask.server.snaptask_server.dto.task.*;
import com.snaptask.server.snaptask_server.modals.Task;
import com.snaptask.server.snaptask_server.service.task.TaskService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/poster")
public class PosterController {

    private final TaskService taskService;

    public PosterController(TaskService taskService){
        this.taskService = taskService;
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
    public ResponseEntity<String> deleteTask(@Valid @RequestBody DeleteTaskDto dto) {
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


}
