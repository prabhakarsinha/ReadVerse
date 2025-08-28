package com.readverse.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.readverse.service.CategoryService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/categories")
@AllArgsConstructor
public class CategoryController {
	
	private final  CategoryService categoryService;

	@GetMapping("/")
	public ResponseEntity<?> getAllBook() {
		return ResponseEntity.ok(categoryService.getAllCategory());

	}


}
