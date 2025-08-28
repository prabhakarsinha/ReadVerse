package com.readverse.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.readverse.custom_exception.ResourceNotFoundException;
import com.readverse.dto.ApiResponse;
import com.readverse.dto.ReadingProgressRespDTO;
import com.readverse.entities.ReadingProgress;
import com.readverse.repository.ReadingProgressRepository;

import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class ReadingProgressServiceImpl implements ReadingProgressService {
	private final ReadingProgressRepository readingProgressRepository;

	@Override
	public ReadingProgressRespDTO getReadingProgressById(Long id) {
		// TODO Auto-generated method stub
		ReadingProgress progress = readingProgressRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Reading progress not found"));

		return new ReadingProgressRespDTO(progress.getId(), progress.getCurrentPage());
	}

	@Override
	public ApiResponse updateReadingProgress(Long id, Integer currentPage) {
		ReadingProgress progress = readingProgressRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Reading progress not found"));
		progress.setCurrentPage(currentPage);
		readingProgressRepository.save(progress);
		// TODO Auto-generated method stub
		return new ApiResponse("update current page to " + currentPage);
	}

	@Override
	public ReadingProgressRespDTO getReadingProgressByUserIdAndBookId(Long bookId, Long userId) {
		// TODO Auto-generated method stub
		ReadingProgress progress = readingProgressRepository.findByUser_idAndBook_id(userId, bookId)
				.orElseThrow(() -> new ResourceNotFoundException("Reading progress not found"));

		return new ReadingProgressRespDTO(progress.getId(), progress.getCurrentPage());

	}

}
