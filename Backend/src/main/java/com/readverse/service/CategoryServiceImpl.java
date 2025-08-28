package com.readverse.service;

import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.readverse.dto.CategoryResqDTO;
import com.readverse.repository.CategoryRepository;

import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class CategoryServiceImpl implements CategoryService {

	private final CategoryRepository categoryRepository;
	private final ModelMapper modelMaper;

	@Override
	public List<CategoryResqDTO> getAllCategory() {

	 return categoryRepository.findAll().stream().map((c) -> modelMaper.map(c, CategoryResqDTO.class))
				.collect(Collectors.toList());
	}

}
