package com.example.demo.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendApprovalEmail(String toEmail, String accessKey) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Data Access Approved");
        message.setText(
                "Hello,\n\n" +
                "Your data access request has been APPROVED by the Key Authority, go and check user dashboard.\n\n" +
                "Your Access Key: " + accessKey + "\n\n" +
                "Please keep this key secure.\n\n" +
                "Regards,\nKey Authority System and Admin"
        );

        mailSender.send(message);
    }
}
