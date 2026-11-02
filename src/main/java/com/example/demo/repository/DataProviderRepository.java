package com.example.demo.repository;

import com.example.demo.entity.DataProvider;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DataProviderRepository extends JpaRepository<DataProvider, Long> {

    Optional<DataProvider> findByEmail(String email);

    Optional<DataProvider> findByProviderId(String providerId);
}
