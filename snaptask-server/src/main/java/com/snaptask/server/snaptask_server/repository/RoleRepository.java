package com.snaptask.server.snaptask_server.repository;

import com.snaptask.server.snaptask_server.enums.UserRole;
import com.snaptask.server.snaptask_server.modals.Role;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends MongoRepository<Role, String> {

    /**
     * Finds a Role by its enum name.
     * Spring Data MongoDB will automatically implement this query.
     *
     * @param name RoleEnum value
     * @return Optional<Role> containing the role if found
     */
    Optional<Role> findByName(UserRole name);
}
