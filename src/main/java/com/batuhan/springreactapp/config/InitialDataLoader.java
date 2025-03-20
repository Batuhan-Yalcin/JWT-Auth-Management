package com.batuhan.springreactapp.config;

import com.batuhan.springreactapp.model.ERole;
import com.batuhan.springreactapp.model.Role;
import com.batuhan.springreactapp.model.User;
import com.batuhan.springreactapp.repository.RoleRepository;
import com.batuhan.springreactapp.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Set;

@Configuration
public class InitialDataLoader {

    @Bean
    CommandLineRunner initDatabase(RoleRepository roleRepository,
                                 UserRepository userRepository,
                                 PasswordEncoder passwordEncoder) {
        return args -> {
            // Rolleri oluştur
            if (roleRepository.count() == 0) {
                Role userRole = new Role(ERole.ROLE_USER);
                Role modRole = new Role(ERole.ROLE_MODERATOR);
                Role adminRole = new Role(ERole.ROLE_ADMIN);

                roleRepository.save(userRole);
                roleRepository.save(modRole);
                roleRepository.save(adminRole);

                System.out.println("Roller başarıyla oluşturuldu");
            }

            // Admin kullanıcısını oluştur
            if (!userRepository.existsByUsername("admin")) {
                User adminUser = new User();
                adminUser.setUsername("admin");
                adminUser.setEmail("admin@example.com");
                adminUser.setPassword(passwordEncoder.encode("admin123")); // Güvenli bir şifre kullanın

                Set<Role> roles = new HashSet<>();
                Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                        .orElseThrow(() -> new RuntimeException("Admin rolü bulunamadı"));
                roles.add(adminRole);
                adminUser.setRoles(roles);

                userRepository.save(adminUser);
                System.out.println("Admin kullanıcısı başarıyla oluşturuldu");
                System.out.println("Kullanıcı adı: admin");
                System.out.println("Şifre: admin123");
            }
        };
    }
} 