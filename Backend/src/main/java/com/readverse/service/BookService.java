package com.readverse.service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;

import com.readverse.dto.ApiResponse;
import com.readverse.dto.BookReqDTO;
import com.readverse.dto.BookRespDTO;
import com.readverse.dto.BookUpdateReqDTO;

import jakarta.validation.Valid;

public interface BookService {

	// to add a book by author
	ApiResponse addBook(BookReqDTO dto, Long authorId);

	// to update book details
	BookRespDTO updateBook(@Valid BookUpdateReqDTO dto, Long id);

	List<BookRespDTO> getAllBooksByAuthorId(Long authoId);

	// public api for getting all books
	List<BookRespDTO> getAllBooks();

	// method for uplaod cover image and reterive t
	byte[] getImage(Long id);

	ApiResponse uploadCoverImage(Long id, MultipartFile file) throws IOException;

	// method to uplaod and download the file of book

	byte[] getBookFile(Long id);

	ApiResponse upLoaddBookFile(Long id, MultipartFile file) throws IOException;
	// update the pdf file of book

}
