package com.batuhanyalcin.springreactapp.controller;

import com.batuhanyalcin.springreactapp.dto.UserDTO;
import com.batuhanyalcin.springreactapp.dto.UserUpdateDTO;
import com.batuhanyalcin.springreactapp.service.UserService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600, allowCredentials = "true")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        try {
            List<UserDTO> users = userService.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            logger.error("Kullanıcılar listelenirken hata oluştu: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Kullanıcılar listelenirken beklenmeyen bir hata oluştu");
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isCurrentUser(#id)")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(userService.getUserById(id));
        } catch (EntityNotFoundException e) {
            logger.error("Kullanıcı bulunamadı: {}", e.getMessage());
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Kullanıcı bulunamadı: ID = " + id);
        } catch (Exception e) {
            logger.error("Beklenmeyen bir hata oluştu: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Beklenmeyen bir hata oluştu");
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isCurrentUser(#id)")
    public ResponseEntity<UserDTO> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserUpdateDTO userUpdateDTO) {
        try {
            logger.info("Kullanıcı güncelleme isteği: ID = {}, Data = {}", id, userUpdateDTO);
            UserDTO updatedUser = userService.updateUser(id, userUpdateDTO);
            logger.info("Kullanıcı başarıyla güncellendi: {}", updatedUser);
            return ResponseEntity.ok(updatedUser);
        } catch (EntityNotFoundException e) {
            logger.error("Kullanıcı bulunamadı: {}", e.getMessage());
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Kullanıcı bulunamadı: ID = " + id);
        } catch (Exception e) {
            logger.error("Kullanıcı güncellenirken hata oluştu: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Kullanıcı güncellenirken beklenmeyen bir hata oluştu");
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok().body(Map.of("message", "Kullanıcı başarıyla silindi"));
        } catch (EntityNotFoundException e) {
            logger.error("Kullanıcı bulunamadı: {}", e.getMessage());
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Kullanıcı bulunamadı: ID = " + id);
        } catch (Exception e) {
            logger.error("Kullanıcı silinirken hata oluştu: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Kullanıcı silinirken beklenmeyen bir hata oluştu");
        }
    }
} 