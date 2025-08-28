import { useEffect, useState } from "react";
import BookService from "../services/BookService";
import type { Book } from "../services/BookService";
import { Box, Center, Heading, SimpleGrid, Spinner, Text, Button } from "@chakra-ui/react";
import AuthorBookCard from "./authorBookCard";
import { useNavigate } from "react-router-dom";


const AuthorDashBoard = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
  // setBooks(booksData);
  // setLoading(false);
      BookService.getAll<Book>("/byauthor")
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
    return ( <>
    <Box width={"100vw"}>
    <Center >
        <Heading justifyContent={"center"} width={"10rem"}  margin={"1rem"} > ALL BOOKS</Heading>
    </Center>
    <Center>
          <Button
            size="lg"
            colorScheme="teal"
            fontSize="2xl"
            px={12}
            py={6}
            mb={4}
            onClick={() => navigate("/add-book")}
          >
            Add Book
          </Button>
        </Center>
    </Box>

     <Box   p={8} bg="gray.50" minH="100vh">
      <SimpleGrid columns={{ base: 2, md: 4, lg: 5 }} gap={8}>
        {books.map((book) => (
          <AuthorBookCard key={book.id} book={book} />
        ))}
      </SimpleGrid>
    </Box>
    author </> );
}
 
export default AuthorDashBoard;