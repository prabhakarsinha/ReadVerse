package com.readverse.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.readverse.custom_exception.ResourceNotFoundException;
import com.readverse.dto.ApiResponse;
import com.readverse.dto.BookLicenseReqDTO;
import com.readverse.dto.BookLicenseResqDTO;
import com.readverse.entities.Book;
import com.readverse.entities.BookLicense;
import com.readverse.entities.ReadingProgress;
import com.readverse.entities.User;
import com.readverse.repository.BookLicenseRepository;
import com.readverse.repository.BookRepository;
import com.readverse.repository.ReadingProgressRepository;
import com.readverse.repository.UserRepository;

import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class BookLicenseServiceImpl implements BookLicenseService {
	private final BookLicenseRepository bookLicenseRepository;
	private final BookRepository bookRepository;
	private final UserRepository userRepository;
	private final ReadingProgressRepository readingProgressRepository;

	@Override
	public List<BookLicenseResqDTO> getAllBooksLicensedToUser(Long userId) {
		// TODO Auto-generated method stub
		if (!userRepository.existsById(userId))
			throw new ResourceNotFoundException("user with given id not found");

		return bookLicenseRepository.findBooksLicensedToUser(userId);
	}

	@Override
	public ApiResponse createLicenseForPurchase(BookLicenseReqDTO dto, Long userId) {
		// TODO Auto-generated method stub
		Book book = bookRepository.findById(dto.getBookId())
				.orElseThrow(() -> new ResourceNotFoundException("Book not found with id " + dto.getBookId()));

		User user = userRepository.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException("user not found with id " + userId));
		BookLicense bl = new BookLicense();
		bl.setBook(book);
		bl.setUser(user);
		bl.setPrice(book.getPrice());
		bookLicenseRepository.save(bl);
		ReadingProgress rp = new ReadingProgress(user, book, 1);
		readingProgressRepository.save(rp);

		return new ApiResponse("license is register successfully for the user for book");
	}

	@Override
	public boolean isBookOwnedByUser(Long userId, Long bookId) {
		// TODO Auto-generated method stub
		return bookLicenseRepository.existsByUser_IdAndBook_Id(userId, bookId);
	}

}
