package com.batuhanyalcin.springreactapp.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserUpdateDTO {
    @Size(max = 50)
    @Email
    private String email;
    
    // Profil güncellemesi için diğer alanlar buraya eklenebilir
    private String firstName;
    private String lastName;
    private String phoneNumber;
} 