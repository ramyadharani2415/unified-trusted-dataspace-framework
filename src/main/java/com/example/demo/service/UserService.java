package com.example.demo.service;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    // REGISTER
    public User register(User user) {

        if (user.getUserId() == null || user.getUserId().isBlank()) {
            throw new RuntimeException("User ID is required");
        }

        if (repository.findByUserId(user.getUserId()).isPresent()) {
            throw new RuntimeException("User ID already exists");
        }

        if (repository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        if (!user.getPassword().equals(user.getConfirmPassword())) {
            throw new RuntimeException("Password and Confirm Password do not match");
        }

        return repository.save(user);
    }

    // LOGIN
    public User login(String email, String password) {

        User user = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email"));

        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid password");
        }

        return user;
    }
    // ✅ GET ALL USERS
    public List<User> getAllUsers() {
        return repository.findAll();
    }
    
    
}
