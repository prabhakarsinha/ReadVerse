package com.readverse.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.readverse.custom_exception.ApiException;
import com.readverse.custom_exception.ResourceNotFoundException;
import com.readverse.dto.ApiResponse;
import com.readverse.dto.BookReqDTO;
import com.readverse.dto.BookRespDTO;
import com.readverse.dto.BookUpdateReqDTO;
import com.readverse.entities.Book;
import com.readverse.entities.BookFile;
import com.readverse.entities.Category;
import com.readverse.entities.PublishStatus;
import com.readverse.entities.User;
import com.readverse.repository.BookRepository;
import com.readverse.repository.CategoryRepository;
import com.readverse.repository.UserRepository;

import lombok.AllArgsConstructor;

@Transactional
@Service
@AllArgsConstructor
public class BookServiceImpl implements BookService {

	private final UserRepository userRepository;

	private final CategoryRepository categoryRepository;

	private final BookRepository bookRepository;

	private final ModelMapper modelMapper;

	// add book
	@Override
	public ApiResponse addBook(BookReqDTO dto, Long authorId) {

		// check category choose exits or not
		Category category = categoryRepository.findById(dto.getCategoryId())
				.orElseThrow(() -> new ResourceNotFoundException("category for this book not found"));

		User author = userRepository.findById(authorId)
				.orElseThrow(() -> new ResourceNotFoundException("author for this book not found"));
		if (bookRepository.existsByAuthor_idAndTitle(authorId, dto.getTitle())) {
			throw new ApiException("This author already has a book with the same name.");
		}
		// maping bookdto to book
		Book entity = modelMapper.map(dto, Book.class);
//		category.addBook(entity);
//		author.addBook(entity);
		entity.setPublishStatus(PublishStatus.DRAFT);
		entity.setAuthor(author);
		entity.setCategory(category);
		

		return new ApiResponse(bookRepository.save(entity).getId().toString());
	}

// uploading cover image 
	@Override
	public ApiResponse uploadCoverImage(Long id, MultipartFile file) throws IOException {

		Book book = bookRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Book not found with id " + id));
		book.setImage(file.getBytes());

		bookRepository.save(book);
		return new ApiResponse("book cover image added  suceesfully");
	}

	// getALl books with image
	@Override
	public List<BookRespDTO> getAllBooks() {
		// TODO Auto-generated method stub
		return bookRepository.fetchAllBooksWithAuthorAndCategory();

	}

	// to the single image by id
	@Override
	public byte[] getImage(Long id) {
		// TODO Auto-generated method stub
		Book book = bookRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Book not found with id " + id));
		if (book.getImage() != null) {
			return book.getImage();

		}

		return null;
	}

	@Override
	public List<BookRespDTO> getAllBooksByAuthorId(Long authoId) {
		// TODO Auto-generated method stub

		return bookRepository.findBooksByAuthorId(authoId);
	}

	// uplaoding book file
	@Override
	public ApiResponse upLoaddBookFile(Long id, MultipartFile file) throws IOException {
		Book book = bookRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("book with id not found"));

		BookFile bookFile = book.getBookFile();
		if (bookFile == null) {
			bookFile = new BookFile(); // First-time upload
		}
		bookFile.setName(file.getOriginalFilename());
		bookFile.setFileType(file.getContentType());
		bookFile.setFileSize(file.getSize());
		bookFile.setFile(file.getBytes());

		/// saving book file
		book.setBookFile(bookFile);
		book.setPublishStatus(PublishStatus.PUBLISHED);
		bookRepository.save(book);

		return new ApiResponse("file uploaded succesfully");
	}

	// Retrieving pdf of book
	@Override
	public byte[] getBookFile(Long id) {
		// TODO Auto-generated method stub
		Book book = bookRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Book not found with id " + id));
		if (book.getBookFile() != null) {
			return book.getBookFile().getFile();

		}
		return null;
	}

	@Override
	public BookRespDTO updateBook(BookUpdateReqDTO dto, Long id) {
		// TODO Auto-generated method stub
		Book book = bookRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Book not found with id " + id));

		book.setTitle(dto.getTitle());
		book.setPrice(dto.getPrice());
		book.setDescription(dto.getDescription());
		book.setLastUpdatedOn(LocalDateTime.now());
		return modelMapper.map(bookRepository.save(book), BookRespDTO.class);
	}

}
