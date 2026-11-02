package com.example.demo.repository;

import com.example.demo.entity.CloudData;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CloudDataRepository extends JpaRepository<CloudData, Long> {

    Optional<CloudData> findByAccessKey(String accessKey);

    List<CloudData> findByUploaderEmail(String uploaderEmail);
    
  

}
