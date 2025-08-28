package com.readverse.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AuthRequest {
	@Email(message = "Invalid email format")
	 @NotBlank(message = "Email is required") 
	private String email;
	 
	 @NotBlank(message = "Password is required")
	 @Size(min = 6, message = "Password must be at least 6 characters")
	private String password;
	
}