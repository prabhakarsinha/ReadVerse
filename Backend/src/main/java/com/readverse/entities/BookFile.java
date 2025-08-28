package com.readverse.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "BookFiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookFile extends BaseEntity {

	private String name;
	@Lob
	@Column(columnDefinition = "LONGBLOB")
	private byte[] file;

	// private String fileUrl;
	private String fileType;
	private Long fileSize;

}
