package com.readverse.service;

import com.readverse.dto.ApiResponse;
import com.readverse.dto.AuthRequest;
import com.readverse.dto.UserReqDTO;
import com.readverse.dto.UserRespDTO;

public interface UserService {

	ApiResponse signUp(UserReqDTO dto);

	//UserRespDTO authenticate(AuthRequest dto);

	ApiResponse setEmailVerification(Boolean isvalid, String email);

}
