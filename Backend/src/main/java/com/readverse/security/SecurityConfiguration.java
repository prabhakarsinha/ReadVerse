package com.readverse.security;

import java.util.Arrays;
import java.util.Collections;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import lombok.AllArgsConstructor;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@AllArgsConstructor
public class SecurityConfiguration {
//	private final PasswordEncoder passwordEncoder;
	private final CustomJwtFilter jwtFilter;

	// configure bean to customize spring security filter chain
	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

		http.cors(Customizer.withDefaults())
		.csrf(csrf -> csrf.disable()) // disable CSRF token generation
				.authorizeHttpRequests(request -> request
						.requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
						// all preflight request permission
						.requestMatchers(HttpMethod.OPTIONS).permitAll()
						// public method for sign in and sign up and otp verfication
						.requestMatchers(HttpMethod.POST, "/api/users/**").permitAll()
						.requestMatchers(HttpMethod.POST, "/api/verify/**").permitAll()
						// to get all category and books and cover images
						.requestMatchers(HttpMethod.GET, "/api/category/").permitAll()
						.requestMatchers(HttpMethod.GET, "/api/books/view", "/api/books/image/**", "/api/categories/").permitAll()
						

						 .requestMatchers(HttpMethod.GET, "/api/books/file/**").hasAnyRole("READER",
						 "AUTHOR")
						// 🔒 AUTHOR only: Add/update/upload book details/uplaod 
						.requestMatchers(HttpMethod.GET, "/api/books/byauthor").hasRole("AUTHOR")
						.requestMatchers(HttpMethod.POST, "/api/books/**").hasRole("AUTHOR")
						.requestMatchers(HttpMethod.PUT, "/api/books/**").hasRole("AUTHOR")
						
						// reading prgoess for reader
						.requestMatchers(HttpMethod.GET, "/api/reading_progress/**").hasRole("READER")
						.requestMatchers(HttpMethod.PUT, "/api/reading_progress/**").hasRole("READER")
						// license books 
						.requestMatchers(HttpMethod.GET, "/api/book-licenses/**").hasRole("READER")
						.requestMatchers(HttpMethod.POST, "/api/book-licenses/**").hasRole("READER")
						.requestMatchers(HttpMethod.POST,"/api/payment/create-order" ).hasRole("READER")
						.requestMatchers("/api/payment/webhook").permitAll()


						.anyRequest().authenticated())
				.httpBasic(Customizer.withDefaults())
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}

	// -AuthenticationConfiguration
	@Bean
	AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
		return config.getAuthenticationManager();
	}
	//cors bean
	

}
