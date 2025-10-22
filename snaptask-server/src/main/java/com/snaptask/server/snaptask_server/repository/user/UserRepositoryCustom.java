package com.snaptask.server.snaptask_server.repository.user;

import com.snaptask.server.snaptask_server.enums.UserRole;
import com.snaptask.server.snaptask_server.modals.User;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepositoryCustom {
    List<User> findUsersByFilters(String college, UserRole role, boolean enabledOnly);
}