package com.readverse.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class BookRespDTO {
	private Long id;
	private String title;
	private String authorName;
	private String categoryName;
	private String imageUrl;
	private Integer price;
	private String description;

	public BookRespDTO(Long id, String title, String authorName, String categoryName, Integer price,
			String description) {
		this.id = id;
		this.title = title;
		this.authorName = authorName;
		this.categoryName = categoryName;
		this.price = price;
		this.description = description;

		this.imageUrl = "http://localhost:8080/api/books"  + "/image/"+ id;
	}

}
