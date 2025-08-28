package com.readverse.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.readverse.entities.User;

public interface UserRepository extends JpaRepository<User, Long> {
	boolean existsByEmail(String email);

	boolean existsByPhoneNo(String phoneNo);

	Optional<User> findByEmailAndPassword(String email, String password);

	Optional<User> findByEmail(String email);
	
}
