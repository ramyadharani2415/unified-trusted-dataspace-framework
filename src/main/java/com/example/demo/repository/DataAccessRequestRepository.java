package com.example.demo.repository;

import com.example.demo.entity.DataAccessRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DataAccessRequestRepository extends JpaRepository<DataAccessRequest, Long> {

    List<DataAccessRequest> findByProviderEmail(String providerEmail);

    List<DataAccessRequest> findByUserEmail(String userEmail);

    List<DataAccessRequest> findByStatus(String status);
}
