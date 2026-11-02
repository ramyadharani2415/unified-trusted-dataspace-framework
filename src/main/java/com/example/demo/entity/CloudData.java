package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "cloud_data")
public class CloudData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // original filename WITH extension (hospital.pdf)
    @Column(nullable = false)
    private String dataName;

    @Column(nullable = false)
    private String dataCategory;

    @Column(length = 1000)
    private String description;

    // MIME type (application/pdf, image/png, etc.)
    @Column(nullable = false)
    private String dataFormat;

    @Column(nullable = false)
    private String accessLevel;

    @Column(nullable = false)
    private String uploaderEmail;

    @Column(nullable = false)
    private String location;

    // generated ONCE at upload
    @Column(nullable = false, unique = true)
    private String accessKey;

    // S3 object key
    @Column(nullable = false)
    private String s3Key;

    // public / internal URL
    @Column(nullable = false)
    private String fileUrl;

    private Long fileSize;

    // ===== Getters & Setters =====

    public Long getId() {
        return id;
    }

    public String getDataName() {
        return dataName;
    }
    public void setDataName(String dataName) {
        this.dataName = dataName;
    }

    public String getDataCategory() {
        return dataCategory;
    }
    public void setDataCategory(String dataCategory) {
        this.dataCategory = dataCategory;
    }

    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

    public String getDataFormat() {
        return dataFormat;
    }
    public void setDataFormat(String dataFormat) {
        this.dataFormat = dataFormat;
    }

    public String getAccessLevel() {
        return accessLevel;
    }
    public void setAccessLevel(String accessLevel) {
        this.accessLevel = accessLevel;
    }

    public String getUploaderEmail() {
        return uploaderEmail;
    }
    public void setUploaderEmail(String uploaderEmail) {
        this.uploaderEmail = uploaderEmail;
    }

    public String getLocation() {
        return location;
    }
    public void setLocation(String location) {
        this.location = location;
    }

    public String getAccessKey() {
        return accessKey;
    }
    public void setAccessKey(String accessKey) {
        this.accessKey = accessKey;
    }

    public String getS3Key() {
        return s3Key;
    }
    public void setS3Key(String s3Key) {
        this.s3Key = s3Key;
    }

    public String getFileUrl() {
        return fileUrl;
    }
    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }

    public Long getFileSize() {
        return fileSize;
    }
    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }
}
