package com.example.parking_management.config;

import com.example.parking_management.model.user.User;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

@Configuration
@EnableJpaAuditing
public class JpaAuditingConfig {

    @Bean
    public AuditorAware<String> auditorProvider() {
        return () -> {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
                Object principal = auth.getPrincipal();
                if (principal instanceof User user) {
                    if (user.getUsername() != null) {
                        return Optional.of(user.getUsername());
                    }
                    if (user.getEmail() != null) {
                        return Optional.of(user.getEmail());
                    }
                }
                if (principal instanceof String name) {
                    return Optional.of(name);
                }
            }
            return Optional.of("system");
        };
    }
}
