package com.example.demo.service;

import com.example.demo.entity.DataProvider;
import com.example.demo.repository.DataProviderRepository;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class DataProviderService {

    private final DataProviderRepository repository;

    public DataProviderService(DataProviderRepository repository) {
        this.repository = repository;
    }

    // REGISTER
    public DataProvider register(DataProvider provider) {

        // ✅ providerId must be present
        if (provider.getProviderId() == null || provider.getProviderId().isBlank()) {
            throw new RuntimeException("Provider ID is required");
        }

        // ✅ check duplicate providerId
        if (repository.findByProviderId(provider.getProviderId()).isPresent()) {
            throw new RuntimeException("Provider ID already exists");
        }

        // ✅ check duplicate email
        if (repository.findByEmail(provider.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        return repository.save(provider);
    }

    // LOGIN
    public DataProvider login(String email, String password) {

        DataProvider provider = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email"));

        if (!provider.getPassword().equals(password)) {
            throw new RuntimeException("Invalid password");
        }

        return provider;
    }
    

    // ✅ VIEW ALL DATA
    public List<DataProvider> getAllDataProviders() {
        return repository.findAll();
    }
}
