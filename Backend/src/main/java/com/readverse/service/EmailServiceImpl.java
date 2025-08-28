package com.readverse.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class EmailServiceImpl implements EmailService {
	@Autowired
	private JavaMailSender mailSender;

	@Override
	public void sendOtpEmail(String toEmail, String otp) {
		
		SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Your OTP for Verification");
        message.setText("Your One-Time Password (OTP) is: " + otp + "\nThis OTP is valid for 10 minutes.");
        message.setFrom("enoughdesign22@gmail.com");

        mailSender.send(message);

	}

}
