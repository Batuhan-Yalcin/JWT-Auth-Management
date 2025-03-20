package com.batuhanyalcin.springreactapp.config;

import com.batuhanyalcin.springreactapp.model.ERole;
import com.batuhanyalcin.springreactapp.model.Role;
import com.batuhanyalcin.springreactapp.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    private final RoleRepository roleRepository;

    public DataInitializer(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... args) {
        // Varsayılan rolleri oluştur
        for (ERole roleName : ERole.values()) {
            if (!roleRepository.existsByName(roleName)) {
                Role role = new Role();
                role.setName(roleName);
                roleRepository.save(role);
            }
        }
    }
} 