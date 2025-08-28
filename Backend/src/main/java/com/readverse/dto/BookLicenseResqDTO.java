package com.readverse.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class BookLicenseResqDTO {

	private Long id;
	private String title;
	private String authorName;
	private String categoryName;
	private String imageUrl;
	private String fileUrl;

	public  BookLicenseResqDTO(Long id, String title, String authorName, String categoryName) {
		this.id = id;
		this.title = title;
		this.authorName = authorName;
		this.categoryName = categoryName;
		this.imageUrl = "http://localhost:8080/api/books"  + "/image/"+ id;
		this.fileUrl  = "http://localhost:8080/api/books" + "/file/" + id;
	}

}
