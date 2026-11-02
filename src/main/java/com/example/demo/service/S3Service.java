package com.example.demo.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;

@Service
public class S3Service {

    private static final Logger logger = LoggerFactory.getLogger(S3Service.class);

    private final AmazonS3 s3Client;
    private final String bucketName = "databuckets12";

    public S3Service(AmazonS3 s3Client) {
        this.s3Client = s3Client;
    }

    public String uploadFile(String s3Key, byte[] encryptedBytes, String contentType) {
        try {
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(encryptedBytes.length);
            metadata.setContentType(contentType);

            ByteArrayInputStream inputStream =
                    new ByteArrayInputStream(encryptedBytes);

            s3Client.putObject(bucketName, s3Key, inputStream, metadata);

            return s3Client.getUrl(bucketName, s3Key).toString();

        } catch (Exception e) {
            logger.error("S3 upload failed", e);
            throw new RuntimeException("S3 upload failed");
        }
    }

    public byte[] downloadFile(String s3Key) {
        try {
            S3ObjectInputStream s3InputStream =
                    s3Client.getObject(bucketName, s3Key).getObjectContent();

            byte[] encryptedBytes = s3InputStream.readAllBytes();
            s3InputStream.close();

            return encryptedBytes;

        } catch (Exception e) {
            logger.error("S3 download failed", e);
            throw new RuntimeException("S3 download failed");
        }
    }

    public void deleteFile(String s3Key) {
        try {
            s3Client.deleteObject(bucketName, s3Key);
        } catch (Exception e) {
            logger.error("S3 delete failed", e);
            throw new RuntimeException("S3 delete failed");
        }
    }
}
