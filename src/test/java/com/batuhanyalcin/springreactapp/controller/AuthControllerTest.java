package com.batuhanyalcin.springreactapp.controller;

import com.batuhanyalcin.springreactapp.dto.LoginDTO;
import com.batuhanyalcin.springreactapp.dto.SignupDTO;
import com.batuhanyalcin.springreactapp.model.ERole;
import com.batuhanyalcin.springreactapp.model.Role;
import com.batuhanyalcin.springreactapp.model.User;
import com.batuhanyalcin.springreactapp.repository.RoleRepository;
import com.batuhanyalcin.springreactapp.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashSet;
import java.util.Set;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
        roleRepository.deleteAll();

        // Varsayılan rolleri oluştur
        for (ERole roleName : ERole.values()) {
            Role role = new Role();
            role.setName(roleName);
            roleRepository.save(role);
        }
    }

    @Test
    void testRegisterUser() throws Exception {
        SignupDTO signupDTO = new SignupDTO();
        signupDTO.setUsername("testuser");
        signupDTO.setEmail("test@example.com");
        signupDTO.setPassword("Test123!");
        Set<String> roles = new HashSet<>();
        roles.add("user");
        signupDTO.setRoles(roles);

        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signupDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Kullanıcı başarıyla kaydedildi!"));
    }

    @Test
    void testRegisterDuplicateUsername() throws Exception {
        // İlk kullanıcıyı kaydet
        User user = new User();
        user.setUsername("testuser");
        user.setEmail("test@example.com");
        user.setPassword(passwordEncoder.encode("Test123!"));
        userRepository.save(user);

        // Aynı kullanıcı adıyla kayıt dene
        SignupDTO signupDTO = new SignupDTO();
        signupDTO.setUsername("testuser");
        signupDTO.setEmail("test2@example.com");
        signupDTO.setPassword("Test123!");
        Set<String> roles = new HashSet<>();
        roles.add("user");
        signupDTO.setRoles(roles);

        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signupDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Hata: Bu kullanıcı adı zaten kullanılıyor!"));
    }

    @Test
    void testAuthenticateUser() throws Exception {
        // Test kullanıcısını oluştur
        User user = new User();
        user.setUsername("testuser");
        user.setEmail("test@example.com");
        user.setPassword(passwordEncoder.encode("Test123!"));
        
        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Hata: Rol bulunamadı"));
        Set<Role> roles = new HashSet<>();
        roles.add(userRole);
        user.setRoles(roles);
        
        userRepository.save(user);

        // Giriş yap
        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setUsername("testuser");
        loginDTO.setPassword("Test123!");

        mockMvc.perform(post("/api/auth/signin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.type").value("Bearer"))
                .andExpect(jsonPath("$.username").value("testuser"));
    }

    @Test
    void testAuthenticateUserWithWrongPassword() throws Exception {
        // Test kullanıcısını oluştur
        User user = new User();
        user.setUsername("testuser");
        user.setEmail("test@example.com");
        user.setPassword(passwordEncoder.encode("Test123!"));
        userRepository.save(user);

        // Yanlış şifre ile giriş dene
        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setUsername("testuser");
        loginDTO.setPassword("WrongPassword123!");

        mockMvc.perform(post("/api/auth/signin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDTO)))
                .andExpect(status().isUnauthorized());
    }
} 