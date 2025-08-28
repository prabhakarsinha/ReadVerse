package com.readverse.controller;

import java.io.IOException;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.readverse.dto.BookReqDTO;
import com.readverse.dto.BookUpdateReqDTO;
import com.readverse.security.JwtUtils;
import com.readverse.service.BookService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/books")
@AllArgsConstructor
public class BookController {

	private final BookService bookService;
	private final JwtUtils jwtUtils;

	// get all book with author and cateogyr name and image
	@GetMapping("/view")
	public ResponseEntity<?> getAllBook() {
		return ResponseEntity.ok(bookService.getAllBooks());

	}

	
	@GetMapping("/byauthor")
//	public ResponseEntity<?> getAllBook(@PathVariable Long author_id) {
	public ResponseEntity<?> getAllBook(@RequestHeader("Authorization") String authHeader) {
//		String token = authHeader.replace("Bearer ", "").trim();
		Long authorId = jwtUtils.extractUserIdFromToken(authHeader);
		return ResponseEntity.ok(bookService.getAllBooksByAuthorId(authorId));

	}

	// author add new book
	@PostMapping("/")
	public ResponseEntity<?> addBook(@RequestHeader("Authorization") String authHeader, @Valid @RequestBody BookReqDTO dto) {
		Long authorId = jwtUtils.extractUserIdFromToken(authHeader);
		return ResponseEntity.status(HttpStatus.CREATED).body(bookService.addBook(dto,authorId));

	}

	@PutMapping("/{id}")
	public ResponseEntity<?> updateBook(@Valid @RequestBody BookUpdateReqDTO dto, @PathVariable Long id) {
		
		return ResponseEntity.status(HttpStatus.OK).body(bookService.updateBook(dto, id));

	}

	// link to downlaod cover image of books
	@GetMapping("/image/{id}")
	public ResponseEntity<?> getBookImage(@PathVariable Long id) {

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.IMAGE_JPEG);

		return new ResponseEntity<>(bookService.getImage(id), headers, HttpStatus.OK);
	}

	// for uplaoding book cover image
	@PostMapping(value = "/upload-image/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<?> addBookCoverImage(@PathVariable Long id, @RequestParam("image") MultipartFile file)
			throws IOException {

		bookService.uploadCoverImage(id, file);

		return ResponseEntity.status(HttpStatus.CREATED).body("image uplaoded");
	}

	@PostMapping(value = "/upload-file/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<?> addBookFile(@PathVariable Long id, @RequestParam("file") MultipartFile file)
			throws IOException {

		bookService.upLoaddBookFile(id, file);

		// TODO Auto-generated catch block
		// return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error
		// reading file");

		return ResponseEntity.status(HttpStatus.CREATED).body("pdf  uplaoded");
	}

	@GetMapping("/file/{id}")
	public ResponseEntity<?> getBookFile(@PathVariable Long id) {
 System.out.print("in file");
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_PDF);

		return new ResponseEntity<>(bookService.getBookFile(id), headers, HttpStatus.OK);
	}

}
