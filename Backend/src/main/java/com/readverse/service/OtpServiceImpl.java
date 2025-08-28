package com.readverse.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import org.springframework.stereotype.Service;

@Service
public class OtpServiceImpl implements OtpService {

	private Map<String, OtpData> otpStorage = new HashMap<>();

	@Override
	public String generateOtp(String email) {

		String otp = String.valueOf(100000 + new Random().nextInt(900000));
		otpStorage.put(email, new OtpData(otp, LocalDateTime.now().plusMinutes(10)));
		return otp;

	}

	@Override
	public boolean verifyOtp(String email, String inputOtp) {
		OtpData data = otpStorage.get(email);
		if (data == null || data.expiry.isBefore(LocalDateTime.now()))
			return false;
		return data.otp.equals(inputOtp);
	}

	private static class OtpData {
		String otp;
		LocalDateTime expiry;

		OtpData(String otp, LocalDateTime expiry) {
			this.otp = otp;
			this.expiry = expiry;
		}
	}

}
