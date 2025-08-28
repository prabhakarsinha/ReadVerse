package com.readverse.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.readverse.dto.EmailDTO;
import com.readverse.dto.OtpRequestDTO;
import com.readverse.service.EmailService;
import com.readverse.service.OtpService;
import com.readverse.service.UserService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/verify")
@AllArgsConstructor

public class VerificationController {

	private final EmailService emailService;
	private final UserService userService;

	private final OtpService otpService;

	
	@PostMapping("/send-otp")
	public ResponseEntity<?> sendOtp(@RequestBody @Valid EmailDTO request) {
	    String otp = otpService.generateOtp(request.getEmail());
	    emailService.sendOtpEmail(request.getEmail(), otp);
	    return ResponseEntity.ok("OTP sent successfully to " + request.getEmail());
	}

	@PostMapping("/verify-otp")
	public ResponseEntity<?> verifyOtp(@RequestBody @Valid OtpRequestDTO request) {
	    boolean isValid = otpService.verifyOtp(request.getEmail(), request.getOtp());
	    return ResponseEntity.ok(userService.setEmailVerification(isValid, request.getEmail()));
	}

}
