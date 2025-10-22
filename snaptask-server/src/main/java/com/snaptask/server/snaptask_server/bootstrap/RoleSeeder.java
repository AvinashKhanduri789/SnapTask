package com.snaptask.server.snaptask_server.bootstrap;

import com.snaptask.server.snaptask_server.enums.UserRole;
import com.snaptask.server.snaptask_server.modals.Role;
import com.snaptask.server.snaptask_server.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;

import java.util.EnumMap;
import java.util.Map;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class RoleSeeder implements ApplicationListener<ContextRefreshedEvent> {

    private static final Logger log = LoggerFactory.getLogger(RoleSeeder.class);

    private final RoleRepository roleRepository;

    // Role descriptions can be easily extended
    private static final Map<UserRole, String> ROLE_DESCRIPTIONS = new EnumMap<>(UserRole.class);

    static {
        ROLE_DESCRIPTIONS.put(UserRole.POSTER, "Can post tasks and manage submissions from seekers");
        ROLE_DESCRIPTIONS.put(UserRole.SEEKER, "Can browse available tasks and submit proposals to earn rewards");
    }

    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        seedRoles();
    }

    private void seedRoles() {
        for (UserRole roleName : UserRole.values()) {
            Optional<Role> existingRole = roleRepository.findByName(roleName);

            if (existingRole.isPresent()) {
                log.info("Role already exists: {}", roleName);
            } else {
                Role roleToCreate = Role.builder()
                        .name(roleName)
                        .description(ROLE_DESCRIPTIONS.getOrDefault(roleName, "Default role description"))
                        .build();

                roleRepository.save(roleToCreate);
                log.info("Created role: {}", roleName);
            }
        }
    }
}
