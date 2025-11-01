package com.snaptask.server.snaptask_server.repository.notification;

import com.snaptask.server.snaptask_server.enums.NotificationStatus;
import com.snaptask.server.snaptask_server.modals.Notification;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Slf4j
public class CustomNotificationRepository {

    private final MongoTemplate mongoTemplate;

    @Autowired
    public CustomNotificationRepository(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    public List<Notification> findByReceiverIdAndStatus(String receiverId, NotificationStatus status) {
        log.info("Executing custom Mongo query for receiverId={} and status={}", receiverId, status);

        Criteria criteria = new Criteria().andOperator(
                Criteria.where("user_id").in(receiverId),  // ✅ matches array elements
                Criteria.where("status").is(status.name())
        );

        Query query = new Query(criteria);
        log.info("Mongo Query Object: {}", query);

        List<Notification> results = mongoTemplate.find(query, Notification.class);
        log.info("Found {} notifications for user {}", results.size(), receiverId);

        return results;
    }




}
