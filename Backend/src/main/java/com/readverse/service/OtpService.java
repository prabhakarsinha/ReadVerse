package com.readverse.service;

public interface OtpService {
	public String generateOtp(String email);

	public boolean verifyOtp(String email, String inputOtp);

}
