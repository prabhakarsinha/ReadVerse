package com.readverse.entities;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "Books")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

@ToString(exclude = { "category", "author", "bookFile" }, callSuper = true)
public class Book extends BaseEntity {

	@Column(length = 60, nullable = false)
	private String title;

//	@ManyToOne
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "author_id", nullable = false)
	private User author;

	private Integer price;

	@Enumerated(EnumType.STRING)
	private PublishStatus publishStatus = PublishStatus.DRAFT;

	@Lob
	private String description;

	@Lob
	@Column(columnDefinition = "LONGBLOB")
	private byte[] image;

//	@ManyToOne
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "category_id")
	private Category category;

	@OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JoinColumn(name = "book_file_id")
	private BookFile bookFile;

}
