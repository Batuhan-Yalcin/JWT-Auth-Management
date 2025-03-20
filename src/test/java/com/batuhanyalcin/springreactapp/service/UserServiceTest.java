package com.batuhanyalcin.springreactapp.service;

import com.batuhanyalcin.springreactapp.dto.PasswordUpdateDTO;
import com.batuhanyalcin.springreactapp.dto.UserDTO;
import com.batuhanyalcin.springreactapp.dto.UserUpdateDTO;
import com.batuhanyalcin.springreactapp.exception.BadRequestException;
import com.batuhanyalcin.springreactapp.model.ERole;
import com.batuhanyalcin.springreactapp.model.Role;
import com.batuhanyalcin.springreactapp.model.User;
import com.batuhanyalcin.springreactapp.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User testUser;
    private UserDTO testUserDTO;
    private UserUpdateDTO testUserUpdateDTO;
    private PasswordUpdateDTO testPasswordUpdateDTO;

    @BeforeEach
    void setUp() {
        // Test kullanıcısı oluştur
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setPassword("hashedPassword");

        Set<Role> roles = new HashSet<>();
        Role userRole = new Role();
        userRole.setId(1L);
        userRole.setName(ERole.ROLE_USER);
        roles.add(userRole);
        testUser.setRoles(roles);

        // Test DTO'ları oluştur
        testUserUpdateDTO = new UserUpdateDTO();
        testUserUpdateDTO.setEmail("newemail@example.com");

        testPasswordUpdateDTO = new PasswordUpdateDTO();
        testPasswordUpdateDTO.setCurrentPassword("currentPassword");
        testPasswordUpdateDTO.setNewPassword("newPassword");
        testPasswordUpdateDTO.setConfirmPassword("newPassword");
    }

    @Test
    void getAllUsers_ShouldReturnListOfUsers() {
        List<User> users = Arrays.asList(testUser);
        when(userRepository.findAll()).thenReturn(users);

        List<UserDTO> result = userService.getAllUsers();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testUser.getUsername(), result.get(0).getUsername());
    }

    @Test
    void getUserById_WhenUserExists_ShouldReturnUser() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        UserDTO result = userService.getUserById(1L);

        assertNotNull(result);
        assertEquals(testUser.getId(), result.getId());
        assertEquals(testUser.getUsername(), result.getUsername());
    }

    @Test
    void getUserById_WhenUserDoesNotExist_ShouldThrowException() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> userService.getUserById(1L));
    }

    @Test
    void updateUser_WhenValidUpdate_ShouldReturnUpdatedUser() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        UserDTO result = userService.updateUser(1L, testUserUpdateDTO);

        assertNotNull(result);
        assertEquals(testUserUpdateDTO.getEmail(), result.getEmail());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void updatePassword_WhenValidUpdate_ShouldUpdatePassword() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(testPasswordUpdateDTO.getCurrentPassword(), testUser.getPassword())).thenReturn(true);
        when(passwordEncoder.encode(testPasswordUpdateDTO.getNewPassword())).thenReturn("newHashedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        UserDTO result = userService.updatePassword(1L, testPasswordUpdateDTO);

        assertNotNull(result);
        verify(userRepository).save(any(User.class));
        verify(passwordEncoder).encode(testPasswordUpdateDTO.getNewPassword());
    }

    @Test
    void updatePassword_WhenCurrentPasswordIncorrect_ShouldThrowException() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(testPasswordUpdateDTO.getCurrentPassword(), testUser.getPassword())).thenReturn(false);

        assertThrows(BadRequestException.class, () -> userService.updatePassword(1L, testPasswordUpdateDTO));
    }

    @Test
    void updatePassword_WhenPasswordsDoNotMatch_ShouldThrowException() {
        testPasswordUpdateDTO.setConfirmPassword("differentPassword");

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        assertThrows(BadRequestException.class, () -> userService.updatePassword(1L, testPasswordUpdateDTO));
    }

    @Test
    void deleteUser_WhenUserExists_ShouldDeleteUser() {
        when(userRepository.existsById(1L)).thenReturn(true);

        userService.deleteUser(1L);

        verify(userRepository).deleteById(1L);
    }

    @Test
    void deleteUser_WhenUserDoesNotExist_ShouldThrowException() {
        when(userRepository.existsById(1L)).thenReturn(false);

        assertThrows(EntityNotFoundException.class, () -> userService.deleteUser(1L));
    }
} 