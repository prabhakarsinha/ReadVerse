package com.readverse.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookLicenseReqDTO {
	
	@NotNull(message = "Book ID is required")
    @Positive(message = "Book ID must be a positive number")
	private Long bookId;
	

}
