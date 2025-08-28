package com.readverse.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.readverse.dto.ApiResponse;
import com.readverse.dto.AuthRequest;
import com.readverse.dto.AuthResponse;
import com.readverse.dto.UserReqDTO;
import com.readverse.security.JwtUtils;
import com.readverse.service.UserService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/users")
@AllArgsConstructor

public class UserController {
	private final UserService userService;
	private final AuthenticationManager authenticationManager;
	private final JwtUtils jwtUtils;

	@PostMapping("/")
	public ResponseEntity<?> signUp( @Valid @RequestBody UserReqDTO dto) {
		return ResponseEntity.status(HttpStatus.CREATED).body(userService.signUp(dto));
	}

	@PostMapping("/signin")
	public ResponseEntity<?> authenticate(@Valid @RequestBody AuthRequest dto) {

		System.out.println("in signin " + dto);
		// 1.create auth token

		UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(dto.getEmail(),
				dto.getPassword());
		try {
			// 2. invoke AuthMgr's authenticate
			Authentication retAuth = authenticationManager.authenticate(authToken);
			System.out.println(retAuth.isAuthenticated());// true
			System.out.println(retAuth.getPrincipal());
			System.out.println(retAuth.getPrincipal().getClass());
			System.out.println(retAuth.getAuthorities()); // ROLE ADMIN | CUSTOMER
			// success
			return ResponseEntity.status(HttpStatus.CREATED) // JWT - created
					.body(new AuthResponse("Auth successful!!!", jwtUtils.generateJwtToken(retAuth)));
		} catch (Exception e) {
			System.out.println(e);
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse(e.getMessage()));
		}
	}

}
