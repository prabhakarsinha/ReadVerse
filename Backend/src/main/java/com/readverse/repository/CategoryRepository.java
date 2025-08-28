package com.readverse.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.readverse.entities.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
	

}
