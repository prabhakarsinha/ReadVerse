package com.readverse.dto;

import com.readverse.entities.UserRole;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString()
@AllArgsConstructor
@NoArgsConstructor
public class UserReqDTO {
	
	 @NotBlank(message = "First name is required")
	private String firstName;
	 @NotBlank(message = "Last name is required")
	private String lastName;

	 @Email(message = "Invalid email format")
	 @NotBlank(message = "Email is required") 
	private String email;
	 
	 @NotBlank(message = "Password is required")
	 @Size(min = 6, message = "Password must be at least 6 characters")
	private String password;
	
	@NotNull(message = "Role is required")
	private UserRole role;
	
	@NotBlank(message = "Phone number is required")
    @Pattern(regexp = "\\d{10}", message = "Phone number must be 10 digits")
	private String phoneNo;

}
  