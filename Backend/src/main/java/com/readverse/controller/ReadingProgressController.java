package com.readverse.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.readverse.security.JwtUtils;
import com.readverse.service.ReadingProgressService;

import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/reading-progress")
@AllArgsConstructor
@Validated
public class ReadingProgressController {

	private final ReadingProgressService readingProgressService;
	private final JwtUtils jwtUtils;

	@GetMapping("/user/book/{bookId}")
	public ResponseEntity<?> getProgressById(@RequestHeader("Authorization") String authHeader,
			@PathVariable @Positive(message = "Book ID must be positive") Long bookId) {
		Long userId = jwtUtils.extractUserIdFromToken(authHeader);

		return ResponseEntity.ok(readingProgressService.getReadingProgressByUserIdAndBookId(bookId, userId));
	}

	@GetMapping("/{id}")
	public ResponseEntity<?> getProgressById(@PathVariable Long id) {

		return ResponseEntity.ok(readingProgressService.getReadingProgressById(id));
	}

	@PutMapping("/{id}")
	public ResponseEntity<?> updateCurrentPage(@PathVariable @Positive(message = "reading ID must be positive") Long id,
			@RequestParam("currentPage") @Positive(message = "Current page value must be positive") Integer currentPage) {
		return ResponseEntity.ok(readingProgressService.updateReadingProgress(id, currentPage));

	}

}
