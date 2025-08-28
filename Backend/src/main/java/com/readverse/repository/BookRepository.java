package com.readverse.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.readverse.dto.BookRespDTO;
import com.readverse.entities.Book;
import com.readverse.entities.BookFile;

public interface BookRepository extends JpaRepository<Book, Long> {

	@Query("SELECT b.bookFile FROM Book b WHERE b.id = :id")
	BookFile findBookFileByBookId( @Param("id")  Long id);

	@Query("""
			SELECT new com.readverse.dto.BookRespDTO(
			    b.id,
			    b.title,
			    a.firstName,
			    c.name,
			    b.price,
			    b.description

			)
			FROM Book b
			JOIN b.author a
			JOIN b.category c
			WHERE b.publishStatus = 'PUBLISHED'
			""")
	List<BookRespDTO> fetchAllBooksWithAuthorAndCategory();

	@Query("""
			    SELECT new com.readverse.dto.BookRespDTO(
			        b.id,
			        b.title,
			        a.firstName,
			        c.name,
			        b.price,
			        b.description
			    )
			    FROM Book b
			    JOIN b.author a
			    JOIN b.category c
			    WHERE a.id = :authorId
			""")
	List<BookRespDTO> findBooksByAuthorId(Long authorId);

	boolean existsByAuthor_idAndTitle(Long authorId, String title);

}
