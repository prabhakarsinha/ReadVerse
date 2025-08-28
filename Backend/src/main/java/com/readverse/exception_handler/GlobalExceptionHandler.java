package com.readverse.exception_handler;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.readverse.custom_exception.ApiException;
import com.readverse.custom_exception.AuthenticationException;
import com.readverse.custom_exception.ResourceNotFoundException;
import com.readverse.dto.ApiResponse;

import jakarta.validation.ConstraintViolationException;

@RestControllerAdvice
public class GlobalExceptionHandler {
	
	 @ExceptionHandler(ConstraintViolationException.class)
	    public ResponseEntity<?> handleConstraintViolation(ConstraintViolationException ex) {
	        Map<String, String> errorMap = new HashMap<>();

	        ex.getConstraintViolations().forEach(violation -> {
	            String field = violation.getPropertyPath().toString(); // includes method name
	            String message = violation.getMessage(); // like "Invalid email format"
	            errorMap.put("error", message);
	        });

	        return new ResponseEntity<>(errorMap, HttpStatus.BAD_REQUEST);
	    }
	
	// for 
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<?> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
		System.out.println("in method arg invalid " + e);
		List<FieldError> fieldErrors = e.getFieldErrors();
		Map<String, String> map = fieldErrors.stream()
				.collect(Collectors.toMap
						(FieldError::getField, FieldError::getDefaultMessage));
		return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body(map);
	}
	
	

	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<?> handleResourceNotFoundException(ResourceNotFoundException e) {
		System.out.println("in handle res not found exc");
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse(e.getMessage()));
	}

	@ExceptionHandler(ApiException.class)
	public ResponseEntity<?> handleApiException(ApiException e) {
		System.out.println("in handle api exc");
		return ResponseEntity.status(HttpStatus.CONFLICT).body(new ApiResponse(e.getMessage()));
	}

	@ExceptionHandler(AuthenticationException.class)
	public ResponseEntity<?> handleAuthenticationException(AuthenticationException e) {
		System.out.println("in handle api exc");
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse(e.getMessage()));
	}

	@ExceptionHandler(IOException.class)
	public ResponseEntity<?> handleIOException(IOException e) {
		System.out.println("in handle api exc");
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(new ApiResponse("File processing error" + e.getMessage()));

	}

	// all exceptions
	@ExceptionHandler(Exception.class)
	public ResponseEntity<?> handleException(Exception e) {
		System.out.println("in catch all exc " + e);
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage()));
	}

}
