package com.readverse.service;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import com.readverse.custom_exception.ApiException;
import com.readverse.custom_exception.AuthenticationException;
import com.readverse.dto.ApiResponse;
import com.readverse.dto.AuthRequest;
import com.readverse.dto.UserReqDTO;
import com.readverse.dto.UserRespDTO;
import com.readverse.entities.User;
import com.readverse.repository.UserRepository;

import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class UserServiceImpl implements UserService {

	private final ModelMapper modelMapper;
	private final UserRepository userRepository;
	private final PasswordEncoder encoder;

	@Override
	public ApiResponse signUp(UserReqDTO dto) {

		if (userRepository.existsByEmail(dto.getEmail()))
			throw new ApiException("Dup Email detected - User  already exists!!!!");

		if (userRepository.existsByPhoneNo(dto.getPhoneNo()))
			throw new ApiException("phone number is already registered !!!!");

		User entity = modelMapper.map(dto, User.class);
		entity.setPassword(encoder.encode(entity.getPassword()));
		User persistenEntity = userRepository.save(entity);

		return new ApiResponse("User registered with ID " + persistenEntity.getId());
	}

	

	@Override
	public ApiResponse setEmailVerification(Boolean isvalid, String email) {
		if (!isvalid)	return new ApiResponse("otp is not valid");
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new AuthenticationException("email is invalid !!!!! yes"));
		user.setEmailVerified(true);
		return new ApiResponse("email verificed succedfully");

	}

}
