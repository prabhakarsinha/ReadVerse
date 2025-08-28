import { useEffect, useState } from "react";
import BookService from "../services/BookService";
import type { Book } from "../services/BookService";
import BookDigitalCard from "./BookDigitalCard";
import { Box, SimpleGrid, Spinner, Text } from "@chakra-ui/react";
// import booksData from '../ebook_store_books.json';

const BookCatalogPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
// setBooks(booksData);
// setLoading(false);
    BookService.getAll<Book>("/view")
      .then((res) => {
        setBooks(Array.isArray(res.data) ? res.data : []);
      }).catch((error) => {
        window.alert("Error fetching books. Please try again later.");
        console.error("Error fetching books:", error);})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="100vh">
        <Spinner size="xl" color="blue.500" />
      </Box>
    );
  }

  if (!books.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="100vh">
        <Text>No books found.</Text>
      </Box>
    );
  }

  return (
    <Box   p={8} bg="gray.50" minH="100vh">
      <SimpleGrid columns={{ base: 2, md: 4, lg: 5 }} gap={8}>
        {books.map((book) => (
          <BookDigitalCard key={book.id} book={book} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default BookCatalogPage;