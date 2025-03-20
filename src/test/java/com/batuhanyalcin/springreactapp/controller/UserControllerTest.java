package com.batuhanyalcin.springreactapp.controller;

import com.batuhanyalcin.springreactapp.dto.PasswordUpdateDTO;
import com.batuhanyalcin.springreactapp.dto.UserDTO;
import com.batuhanyalcin.springreactapp.dto.UserUpdateDTO;
import com.batuhanyalcin.springreactapp.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    private UserDTO testUserDTO;
    private UserUpdateDTO testUserUpdateDTO;
    private PasswordUpdateDTO testPasswordUpdateDTO;

    @BeforeEach
    void setUp() {
        testUserDTO = new UserDTO();
        testUserDTO.setId(1L);
        testUserDTO.setUsername("testuser");
        testUserDTO.setEmail("test@example.com");
        testUserDTO.setRoles(new HashSet<>(Arrays.asList("ROLE_USER")));

        testUserUpdateDTO = new UserUpdateDTO();
        testUserUpdateDTO.setEmail("newemail@example.com");

        testPasswordUpdateDTO = new PasswordUpdateDTO();
        testPasswordUpdateDTO.setCurrentPassword("currentPassword");
        testPasswordUpdateDTO.setNewPassword("newPassword");
        testPasswordUpdateDTO.setConfirmPassword("newPassword");
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getAllUsers_ReturnsUsersList() throws Exception {
        List<UserDTO> users = Arrays.asList(testUserDTO);
        when(userService.getAllUsers()).thenReturn(users);

        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").value(testUserDTO.getId()))
                .andExpect(jsonPath("$[0].username").value(testUserDTO.getUsername()));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getUserById_WhenUserExists_ReturnsUser() throws Exception {
        when(userService.getUserById(1L)).thenReturn(testUserDTO);

        mockMvc.perform(get("/api/users/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(testUserDTO.getId()))
                .andExpect(jsonPath("$.username").value(testUserDTO.getUsername()));
    }

    @Test
    @WithMockUser(username = "testuser")
    void updateUser_WhenValidUpdate_ReturnsUpdatedUser() throws Exception {
        when(userService.updateUser(eq(1L), any(UserUpdateDTO.class))).thenReturn(testUserDTO);

        mockMvc.perform(put("/api/users/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testUserUpdateDTO)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(testUserDTO.getId()));
    }

    @Test
    @WithMockUser(username = "testuser")
    void updatePassword_WhenValidUpdate_ReturnsUpdatedUser() throws Exception {
        when(userService.updatePassword(eq(1L), any(PasswordUpdateDTO.class))).thenReturn(testUserDTO);

        mockMvc.perform(put("/api/users/1/password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testPasswordUpdateDTO)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(testUserDTO.getId()));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deleteUser_WhenUserExists_ReturnsNoContent() throws Exception {
        mockMvc.perform(delete("/api/users/1"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "testuser")
    void updateUser_WhenUnauthorized_ReturnsForbidden() throws Exception {
        mockMvc.perform(put("/api/users/2")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testUserUpdateDTO)))
                .andExpect(status().isForbidden());
    }
} 