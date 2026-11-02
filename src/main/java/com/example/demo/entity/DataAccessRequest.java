package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "data_access_request")
public class DataAccessRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔥 IMPORTANT: link to CloudData / Dataset
    @Column(nullable = false)
    private Long dataId;

    private String userEmail;
    private String datasetName;
    private String providerEmail;

    private String status;
    // USER_REQUESTED
    // PROVIDER_APPROVED
    // KEY_AUTH_APPROVED

    private String accessKey;

    // getters & setters
    public Long getId() {
        return id;
    }

    public Long getDataId() {
        return dataId;
    }

    public void setDataId(Long dataId) {
        this.dataId = dataId;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getDatasetName() {
        return datasetName;
    }

    public void setDatasetName(String datasetName) {
        this.datasetName = datasetName;
    }

    public String getProviderEmail() {
        return providerEmail;
    }

    public void setProviderEmail(String providerEmail) {
        this.providerEmail = providerEmail;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getAccessKey() {
        return accessKey;
    }

    public void setAccessKey(String accessKey) {
        this.accessKey = accessKey;
    }
}
