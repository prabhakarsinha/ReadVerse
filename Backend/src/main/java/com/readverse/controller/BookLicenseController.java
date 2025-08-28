package com.readverse.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.readverse.dto.BookLicenseReqDTO;
import com.readverse.dto.BookLicenseResqDTO;
import com.readverse.security.JwtUtils;
import com.readverse.service.BookLicenseService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;

@RestController
//@RequestMapping("/api/bookLicense")
@RequestMapping("/api/book-licenses")
@AllArgsConstructor
@Validated
public class BookLicenseController {

	private final BookLicenseService bookLicenseService;
	private final JwtUtils jwtUtils;

	@GetMapping("/")
	public ResponseEntity<?> getAllLicensesByUser(@RequestHeader("Authorization") String authHeader) {
		Long userId = jwtUtils.extractUserIdFromToken(authHeader);
		List<BookLicenseResqDTO> licenses = bookLicenseService.getAllBooksLicensedToUser(userId);
		return ResponseEntity.ok(licenses);
	}

	@PostMapping("/")
	public ResponseEntity<?> createLicenseForPurchase(@RequestHeader("Authorization") String authHeader,
			 @Valid @RequestBody BookLicenseReqDTO dto) {

		Long userId = jwtUtils.extractUserIdFromToken(authHeader);
		return ResponseEntity.status(HttpStatus.CREATED).body(bookLicenseService.createLicenseForPurchase(dto, userId));

	}

	// check whether user has already purchased or not
	@GetMapping("/books/{bookId}")
	public ResponseEntity<?> isBookOwnedByUser(@RequestHeader("Authorization") String authHeader,
			@PathVariable @Positive(message = "Book ID must be positive") Long bookId) {
		Long userId = jwtUtils.extractUserIdFromToken(authHeader);

		boolean owned = bookLicenseService.isBookOwnedByUser(userId, bookId);
		return ResponseEntity.ok(owned);
	}

}
