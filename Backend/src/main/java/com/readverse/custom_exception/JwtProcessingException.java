package com.readverse.custom_exception;

public class JwtProcessingException extends RuntimeException {
	public JwtProcessingException(String mesg) {
		super(mesg);
	}
}