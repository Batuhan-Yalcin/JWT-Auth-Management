package com.batuhanyalcin.springreactapp.service;

import com.batuhanyalcin.springreactapp.dto.RoleDTO;
import com.batuhanyalcin.springreactapp.model.ERole;
import com.batuhanyalcin.springreactapp.model.Role;
import com.batuhanyalcin.springreactapp.repository.RoleRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class RoleService {
    
    @Autowired
    private RoleRepository roleRepository;

    public List<RoleDTO> getAllRoles() {
        return roleRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public RoleDTO getRoleById(Long id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Rol bulunamadı. ID: " + id));
        return convertToDTO(role);
    }

    public RoleDTO getRoleByName(ERole name) {
        Role role = roleRepository.findByName(name)
                .orElseThrow(() -> new EntityNotFoundException("Rol bulunamadı: " + name));
        return convertToDTO(role);
    }

    public RoleDTO createRole(RoleDTO roleDTO) {
        Role role = convertToEntity(roleDTO);
        Role savedRole = roleRepository.save(role);
        return convertToDTO(savedRole);
    }

    public RoleDTO updateRole(Long id, RoleDTO roleDTO) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Rol bulunamadı. ID: " + id));
        
        role.setName(roleDTO.getName());
        Role updatedRole = roleRepository.save(role);
        return convertToDTO(updatedRole);
    }

    public void deleteRole(Long id) {
        if (!roleRepository.existsById(id)) {
            throw new EntityNotFoundException("Rol bulunamadı. ID: " + id);
        }
        roleRepository.deleteById(id);
    }

    public void initializeRoles() {
        for (ERole roleEnum : ERole.values()) {
            if (!roleRepository.findByName(roleEnum).isPresent()) {
                Role role = new Role();
                role.setName(roleEnum);
                roleRepository.save(role);
            }
        }
    }

    private RoleDTO convertToDTO(Role role) {
        return new RoleDTO(role.getId(), role.getName());
    }

    private Role convertToEntity(RoleDTO roleDTO) {
        Role role = new Role();
        role.setId(roleDTO.getId());
        role.setName(roleDTO.getName());
        return role;
    }
} 