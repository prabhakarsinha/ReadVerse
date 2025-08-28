package com.readverse.service;

import java.util.List;

import com.readverse.dto.ApiResponse;
import com.readverse.dto.BookLicenseReqDTO;
import com.readverse.dto.BookLicenseResqDTO;

public interface BookLicenseService {
	// to get list of all books purchased by specfic user
	List<BookLicenseResqDTO> getAllBooksLicensedToUser(Long userId);

	ApiResponse createLicenseForPurchase(BookLicenseReqDTO dto, Long userId);

	boolean isBookOwnedByUser(Long userId, Long bookId);

}
