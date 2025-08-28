package com.readverse.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.readverse.entities.ReadingProgress;

public interface ReadingProgressRepository extends JpaRepository<ReadingProgress, Long> {

	Optional<ReadingProgress> findByUser_idAndBook_id(Long userId, Long bookId);

}
