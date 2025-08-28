package com.readverse.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.readverse.dto.BookLicenseResqDTO;
import com.readverse.entities.BookLicense;

public interface BookLicenseRepository extends JpaRepository<BookLicense, Long> {
	@Query("""
			    SELECT new com.readverse.dto.BookLicenseResqDTO(
			        b.id,
			        b.title,
			        a.firstName,
			        c.name
			    )
			    FROM BookLicense l
			    JOIN l.book b
			    JOIN b.author a
			    JOIN b.category c
			    WHERE l.user.id = :userId
			""")
	List<BookLicenseResqDTO> findBooksLicensedToUser(@Param("userId") Long userId);
	Boolean existsByUser_IdAndBook_Id(Long userId , Long BookId);
}
