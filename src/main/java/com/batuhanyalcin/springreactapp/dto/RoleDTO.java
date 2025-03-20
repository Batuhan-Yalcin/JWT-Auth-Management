package com.batuhanyalcin.springreactapp.dto;

import com.batuhanyalcin.springreactapp.model.ERole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoleDTO {
    private Long id;
    private ERole name;
} 