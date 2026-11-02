package com.example.demo.controller;

import com.example.demo.entity.DataProvider;
import com.example.demo.service.DataProviderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dataprovider")
@CrossOrigin("*")
public class DataProviderController {

    private final DataProviderService service;

    public DataProviderController(DataProviderService service) {
        this.service = service;
    }

    // REGISTER
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody DataProvider provider) {
        service.register(provider);
        return ResponseEntity.ok("Registration successful");
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {

        DataProvider provider = service.login(
                request.get("email"),
                request.get("password")
        );

        return ResponseEntity.ok(provider);
    }
    
    // ✅ VIEW ALL DATA PROVIDERS
    @GetMapping("/all")
    public ResponseEntity<List<DataProvider>> getAllDataProviders() {
        return ResponseEntity.ok(service.getAllDataProviders());
    }
}
