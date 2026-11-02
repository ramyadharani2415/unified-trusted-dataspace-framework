package com.example.demo.service;

import com.example.demo.entity.CloudData;
import com.example.demo.repository.CloudDataRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Service
public class CloudDataService {

    private final CloudDataRepository repository;
    private final S3Service s3Service;

    public CloudDataService(CloudDataRepository repository, S3Service s3Service) {
        this.repository = repository;
        this.s3Service = s3Service;
    }

    // 🔼 UPLOAD DATA
    public CloudData upload(
            String dataCategory,
            String description,
            String accessLevel,
            String uploaderEmail,
            String location,
            MultipartFile file) {

        try {
            String s3Key = "data/" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
            String fileUrl = s3Service.uploadFile(
                    s3Key,
                    file.getBytes(),
                    file.getContentType()
            );

            CloudData data = new CloudData();
            data.setDataName(file.getOriginalFilename());          // ✅ hospital.pdf
            data.setDataCategory(dataCategory);
            data.setDescription(description);
            data.setDataFormat(file.getContentType());            // ✅ application/pdf
            data.setAccessLevel(accessLevel);
            data.setUploaderEmail(uploaderEmail);
            data.setLocation(location);
            data.setAccessKey("KEY-" + UUID.randomUUID());
            data.setS3Key(s3Key);
            data.setFileUrl(fileUrl);
            data.setFileSize(file.getSize());

            return repository.save(data);

        } catch (Exception e) {
            throw new RuntimeException("Upload failed: " + e.getMessage());
        }
    }

    // 🔽 DOWNLOAD BY ACCESS KEY (BYTES ONLY)
    public byte[] downloadByAccessKey(String accessKey) {
        CloudData data = getByAccessKey(accessKey);
        return s3Service.downloadFile(data.getS3Key());
    }

    // 🔍 GET METADATA BY ACCESS KEY
    public CloudData getByAccessKey(String accessKey) {
        return repository.findByAccessKey(accessKey)
                .orElseThrow(() -> new RuntimeException("Invalid access key"));
    }

    public String getAccessKeyById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Data not found"))
                .getAccessKey();
    }

    public List<CloudData> getAllData() {
        return repository.findAll();
    }

    public List<CloudData> getDataByUploaderEmail(String uploaderEmail) {
        return repository.findByUploaderEmail(uploaderEmail);
    }

    public boolean isAccessKeyValid(String accessKey) {
        return repository.findByAccessKey(accessKey).isPresent();
    }
}
