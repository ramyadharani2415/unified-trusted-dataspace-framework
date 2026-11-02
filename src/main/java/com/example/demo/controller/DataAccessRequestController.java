package com.example.demo.controller;

import com.example.demo.entity.DataAccessRequest;
import com.example.demo.service.DataAccessRequestService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/request")
@CrossOrigin("*")
public class DataAccessRequestController {

    private final DataAccessRequestService service;

    public DataAccessRequestController(DataAccessRequestService service) {
        this.service = service;
    }

    // 1️⃣ USER SEND REQUEST
    @PostMapping("/create")
    public DataAccessRequest create(@RequestBody DataAccessRequest request) {
        return service.createRequest(request);
    }

    // 2️⃣ DATA PROVIDER APPROVES
    @PutMapping("/provider-approve/{id}")
    public DataAccessRequest providerApprove(@PathVariable Long id) {
        return service.providerApprove(id);
    }

    // 3️⃣ KEY AUTHORITY APPROVES
    @PutMapping("/key-authority-approve/{id}")
    public DataAccessRequest keyApprove(@PathVariable Long id) {
        return service.keyAuthorityApprove(id);
    }

    // 🏢 DATA PROVIDER → VIEW REQUESTS
    @GetMapping("/provider/{email}")
    public List<DataAccessRequest> getProviderRequests(@PathVariable String email) {
        return service.getRequestsForProvider(email);
    }

    // 🏛️ KEY AUTHORITY → VIEW ALL REQUESTS
    @GetMapping("/key-authority/all")
    public List<DataAccessRequest> getAllRequests() {
        return service.getAllRequests();
    }

    // 👤 USER → VIEW REQUESTS
    @GetMapping("/user/{email}")
    public List<DataAccessRequest> getUserRequests(@PathVariable String email) {
        return service.getRequestsForUser(email);
    }
    
    @GetMapping("/all")
    public List<DataAccessRequest> viewAllRequests() {
        return service.getAllRequests();
    }


}
