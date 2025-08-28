package com.readverse.entities;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "Categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

@ToString(callSuper = true)
@EqualsAndHashCode(of = "name", callSuper = false)
public class Category extends BaseEntity {

	@Column(length = 50, unique = true)
	private String name;
//		public Category(String name) {
//			super();
//			this.name = name;
//		}

//		@OneToMany(mappedBy = "category", cascade = CascadeType.ALL, orphanRemoval = true)
//	    private List<Book> books = new ArrayList<>();

//		public void addBook(Book book) {
//			this.books.add(book);
//			book.setCategory(this);
//		}
//		public void removeBook(Book book) {
//			this.books.remove(book);
//			book.setCategory(null);
//		}

}
