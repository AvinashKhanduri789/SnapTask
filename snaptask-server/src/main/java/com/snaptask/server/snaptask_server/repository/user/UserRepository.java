package com.snaptask.server.snaptask_server.repository.user;


import com.snaptask.server.snaptask_server.enums.UserRole;
import com.snaptask.server.snaptask_server.modals.User;
import org.springframework.data.geo.Distance;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String>, UserRepositoryCustom {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);

    List<User> findByRoleAndGeoJsonPointNear(
            UserRole role,
            GeoJsonPoint location,
            Distance distance
    );

    List<User> findByRoleAndSkillsIn(UserRole role, List<String> skills);
}