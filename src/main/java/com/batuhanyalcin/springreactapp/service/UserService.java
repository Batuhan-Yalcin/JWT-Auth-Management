package com.batuhanyalcin.springreactapp.service;

import com.batuhanyalcin.springreactapp.dto.PasswordUpdateDTO;
import com.batuhanyalcin.springreactapp.dto.UserDTO;
import com.batuhanyalcin.springreactapp.dto.UserUpdateDTO;
import com.batuhanyalcin.springreactapp.exception.BadRequestException;
import com.batuhanyalcin.springreactapp.model.Role;
import com.batuhanyalcin.springreactapp.model.User;
import com.batuhanyalcin.springreactapp.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {
    
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public UserDTO getUserById(Long id) {
        logger.debug("Kullanıcı aranıyor: ID = {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Kullanıcı bulunamadı: ID = {}", id);
                    return new EntityNotFoundException("Kullanıcı bulunamadı: ID = " + id);
                });
        logger.debug("Kullanıcı bulundu: {}", user);
        return convertToDTO(user);
    }

    public UserDTO getUserByUsername(String username) {
        logger.debug("Kullanıcı aranıyor: username = {}", username);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    logger.error("Kullanıcı bulunamadı: username = {}", username);
                    return new UsernameNotFoundException("Kullanıcı bulunamadı: " + username);
                });
        logger.debug("Kullanıcı bulundu: {}", user);
        return convertToDTO(user);
    }

    public UserDTO updateUser(Long id, UserUpdateDTO userUpdateDTO) {
        logger.debug("Kullanıcı güncelleme isteği: ID = {}, Data = {}", id, userUpdateDTO);
        
        User user = userRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Kullanıcı bulunamadı: ID = {}", id);
                    return new EntityNotFoundException("Kullanıcı bulunamadı: ID = " + id);
                });

        try {
            if (userUpdateDTO.getEmail() != null) {
                logger.debug("Email güncelleniyor: {} -> {}", user.getEmail(), userUpdateDTO.getEmail());
                user.setEmail(userUpdateDTO.getEmail());
            }

            User savedUser = userRepository.save(user);
            logger.info("Kullanıcı başarıyla güncellendi: {}", savedUser);
            return convertToDTO(savedUser);
        } catch (Exception e) {
            logger.error("Kullanıcı güncellenirken hata oluştu: {}", e.getMessage(), e);
            throw new RuntimeException("Kullanıcı güncellenirken beklenmeyen bir hata oluştu", e);
        }
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new EntityNotFoundException("Kullanıcı bulunamadı");
        }
        userRepository.deleteById(id);
    }

    public UserDTO updatePassword(Long id, PasswordUpdateDTO passwordUpdateDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Kullanıcı bulunamadı"));

        if (!passwordUpdateDTO.getNewPassword().equals(passwordUpdateDTO.getConfirmPassword())) {
            throw new BadRequestException("Yeni şifre ve onay şifresi eşleşmiyor");
        }

        if (!passwordEncoder.matches(passwordUpdateDTO.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Mevcut şifre yanlış");
        }

        user.setPassword(passwordEncoder.encode(passwordUpdateDTO.getNewPassword()));
        return convertToDTO(userRepository.save(user));
    }

    private UserDTO convertToDTO(User user) {
        Set<String> roles = user.getRoles().stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toSet());

        return new UserDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                roles
        );
    }

    private User convertToEntity(UserDTO userDTO) {
        User user = new User();
        user.setId(userDTO.getId());
        user.setUsername(userDTO.getUsername());
        user.setEmail(userDTO.getEmail());
        return user;
    }
} 