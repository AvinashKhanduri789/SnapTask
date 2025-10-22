package com.snaptask.server.snaptask_server.repository.bid;

import com.snaptask.server.snaptask_server.modals.Bid;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface BidRepository extends MongoRepository<Bid,String> {
    List<Bid> findByTaskId(String taskId);
}
