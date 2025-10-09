package com.quizserver.entities;

import com.quizserver.enums.UserRole;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;

    @ToString.Exclude
    private String password;

    private String name;

    private UserRole role;
}
