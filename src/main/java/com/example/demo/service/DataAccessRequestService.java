package com.example.demo.service;

import com.example.demo.entity.CloudData;
import com.example.demo.entity.DataAccessRequest;
import com.example.demo.repository.CloudDataRepository;
import com.example.demo.repository.DataAccessRequestRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DataAccessRequestService {

    private final DataAccessRequestRepository repository;
    private final CloudDataRepository cloudDataRepository; // ✅ ADD THIS
    private final EmailService emailService;

    // ✅ UPDATE CONSTRUCTOR
    public DataAccessRequestService(
            DataAccessRequestRepository repository,
            CloudDataRepository cloudDataRepository,
            EmailService emailService
    ) {
        this.repository = repository;
        this.cloudDataRepository = cloudDataRepository;
        this.emailService = emailService;
    }

    // 👤 USER REQUEST
    public DataAccessRequest createRequest(DataAccessRequest request) {

        if (request.getDataId() == null) {
            throw new RuntimeException("Data ID is required");
        }

        request.setStatus("USER_REQUESTED");
        return repository.save(request);
    }

    // 🏢 DATA PROVIDER APPROVAL
    public DataAccessRequest providerApprove(Long id) {

        DataAccessRequest req = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        req.setStatus("PROVIDER_APPROVED");
        return repository.save(req);
    }

    // 🏛️ KEY AUTHORITY APPROVAL (NO KEY GENERATION)
    public DataAccessRequest keyAuthorityApprove(Long id) {

        DataAccessRequest req = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        CloudData data = cloudDataRepository.findById(req.getDataId())
                .orElseThrow(() -> new RuntimeException("Cloud data not found"));

        String accessKey = data.getAccessKey();

        if (accessKey == null) {
            throw new RuntimeException("Access key missing in CloudData");
        }

        req.setStatus("KEY_AUTH_APPROVED");

        // ✅ STORE KEY IN REQUEST TABLE
        req.setAccessKey(accessKey);

        DataAccessRequest saved = repository.save(req);

        emailService.sendApprovalEmail(
                saved.getUserEmail(),
                accessKey
        );

        return saved;
    }


    public List<DataAccessRequest> getRequestsForProvider(String providerEmail) {
        return repository.findByProviderEmail(providerEmail);
    }

    public List<DataAccessRequest> getRequestsForUser(String userEmail) {
        return repository.findByUserEmail(userEmail);
    }

    public List<DataAccessRequest> getAllRequests() {
        return repository.findAll();
    }
}
