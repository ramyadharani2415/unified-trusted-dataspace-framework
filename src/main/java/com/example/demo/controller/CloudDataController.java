package com.example.demo.controller;

import com.example.demo.entity.CloudData;
import com.example.demo.service.CloudDataService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/data")
@CrossOrigin("*")
public class CloudDataController {

    private final CloudDataService service;

    public CloudDataController(CloudDataService service) {
        this.service = service;
    }

    // 🔼 UPLOAD
    @PostMapping("/upload")
    public ResponseEntity<CloudData> upload(
            @RequestParam String dataCategory,
            @RequestParam String description,
            @RequestParam String accessLevel,
            @RequestParam String uploaderEmail,
            @RequestParam String location,
            @RequestParam MultipartFile file) {

        return ResponseEntity.ok(
                service.upload(
                        dataCategory,
                        description,
                        accessLevel,
                        uploaderEmail,
                        location,
                        file
                )
        );
    }

    // 📧 GET BY EMAIL
    @GetMapping("/by-email")
    public ResponseEntity<List<CloudData>> getByEmail(
            @RequestParam String uploaderEmail) {
        return ResponseEntity.ok(service.getDataByUploaderEmail(uploaderEmail));
    }

    // 📂 GET ALL
    @GetMapping("/all")
    public ResponseEntity<List<CloudData>> getAll() {
        return ResponseEntity.ok(service.getAllData());
    }

    // 🔑 GET ACCESS KEY
    @GetMapping("/access-key/{id}")
    public ResponseEntity<String> getAccessKey(@PathVariable Long id) {
        return ResponseEntity.ok(service.getAccessKeyById(id));
    }

    // 🔽 DOWNLOAD (FIXED)
    @GetMapping("/download/{accessKey}")
    public ResponseEntity<byte[]> download(@PathVariable String accessKey) {

        CloudData data = service.getByAccessKey(accessKey);
        byte[] fileBytes = service.downloadByAccessKey(accessKey);

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + data.getDataName() + "\""
                )
                .contentType(MediaType.parseMediaType(data.getDataFormat()))
                .contentLength(fileBytes.length)
                .body(fileBytes);
    }

    // ✅ VALIDATE KEY
    @GetMapping("/validate-key/{accessKey}")
    public ResponseEntity<Boolean> validateKey(@PathVariable String accessKey) {
        return ResponseEntity.ok(service.isAccessKeyValid(accessKey));
    }
}
