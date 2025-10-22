package com.snaptask.server.snaptask_server.repository.user;

import com.snaptask.server.snaptask_server.enums.UserRole;
import com.snaptask.server.snaptask_server.modals.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class UserRepositoryCustomImpl implements UserRepositoryCustom {

    private final MongoTemplate mongoTemplate;

    @Override
    public List<User> findUsersByFilters(String college, UserRole role, boolean enabledOnly) {
        Criteria criteria = new Criteria();

        // Dynamically add filters only if values are provided
        if (college != null && !college.isEmpty()) {
            criteria.and("college").is(college);
        }
        if (role != null) {
            criteria.and("role").is(role);
        }
        if (enabledOnly) {
            criteria.and("enabled").is(true);
        }

        Query query = new Query(criteria);
        return mongoTemplate.find(query, User.class);
    }
}