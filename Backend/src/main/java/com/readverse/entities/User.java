package com.readverse.entities;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "secure_users")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString(exclude = { "password" }, callSuper = true)
@EqualsAndHashCode(of = "email", callSuper = false)
public class User extends BaseEntity implements UserDetails {

	@Column(length = 20)
	private String firstName;
	@Column(length = 30)
	private String lastName;

//	@Size(min = 10, max = 10, message = "Value must be exactly 10 characters")
	@Column(length = 10, unique = true)
	private String phoneNo;
	@Column(length = 30, unique = true)
	private String email;
	@Column(length = 300, nullable = false)
	private String password;

	@Enumerated(EnumType.STRING)
	private UserRole role;

	@Column(nullable = false)
	private boolean isEmailVerified = false;

	@Column(nullable = false)
	private boolean isPhoneVerified = false;

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		// TODO Auto-generated method stub
		return List.of(new SimpleGrantedAuthority(role.name()));
	}// rets immutable List of roles - single role

	@Override
	public String getUsername() {
		// TODO Auto-generated method stub
		return this.email;
	}

}
