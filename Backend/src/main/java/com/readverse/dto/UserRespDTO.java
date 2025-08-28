package com.readverse.dto;

import com.readverse.entities.UserRole;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@ToString(callSuper = true)
@NoArgsConstructor
public class UserRespDTO extends BaseDTO {

	private String firstName;

	private String lastName;

	private String email;

	private UserRole role;
	private String phoneNo;
	
	private boolean isEmailVerified;
	private boolean isPhoneVerified;

}
