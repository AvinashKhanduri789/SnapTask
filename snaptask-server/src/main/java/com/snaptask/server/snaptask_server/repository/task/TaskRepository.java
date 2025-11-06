package com.snaptask.server.snaptask_server.repository.task;

import com.snaptask.server.snaptask_server.enums.TaskStatus;
import com.snaptask.server.snaptask_server.modals.Task;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends MongoRepository<Task,String> {
    List<Task> findByPosterId(String posterId);
    List<Task> findByCategoryAndIsAssignedFalse(String category);
    List<Task> findByAssignedSeekerIdAndIsAssignedTrue(String assignedSeekerId);
    List<Task> findByAssignedSeekerIdAndStatus(String assignedSeekerId, TaskStatus status);
}
