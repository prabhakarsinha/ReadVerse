package com.readverse.service;

import com.readverse.dto.ApiResponse;
import com.readverse.dto.ReadingProgressRespDTO;

public interface ReadingProgressService {

	ReadingProgressRespDTO getReadingProgressById(Long id);

	ApiResponse updateReadingProgress(Long id, Integer currentPage);

	ReadingProgressRespDTO getReadingProgressByUserIdAndBookId(Long bookId, Long userId);

}
