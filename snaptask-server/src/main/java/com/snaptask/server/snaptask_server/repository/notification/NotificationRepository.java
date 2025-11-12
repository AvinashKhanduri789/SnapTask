package com.snaptask.server.snaptask_server.repository.notification;
import com.snaptask.server.snaptask_server.enums.NotificationStatus;
import com.snaptask.server.snaptask_server.modals.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {

    List<Notification> findByReceiverIdsInAndStatus(List<String> receiverIds, NotificationStatus status);
    List<Notification> findByTaskId(String taskId);
    void deleteAllByTaskId(String taskId);


}

