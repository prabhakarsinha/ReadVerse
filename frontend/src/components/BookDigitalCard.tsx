import { Text, Stack, Button, Image, Heading, Box } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import type { Book } from "../services/BookService";
import BookLicense from "../services/BookLicense";



interface BookDigitalCardProps {
  book: Book;
}

const BookDigitalCard = ({ book }: BookDigitalCardProps) => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("Authorization");

  const handleBuyBook = async (id: number) => {
    try {
      // BookLicense.get returns a boolean if the user already owns the book
      const hasLicense = await BookLicense.get(id.toString(), "books");
      if (hasLicense.data) {
        navigate("/library");
      } else {
        navigate("book/purchase/", { state: { book } });
      }
    } catch (error) {
      // fallback: go to purchase if error
      navigate("book/purchase/", { state: { book } });
    }
  };
  
  return (
    <Box maxW="sm" boxShadow="md" borderRadius="lg" overflow="hidden" bg="white" display="flex" alignItems="center" p={4}>
      <Image src={book.imageUrl} alt={book.title} objectFit="cover" w="120px" h="180px" borderRadius="md" mr={6} />
      <Stack gap={3} flex={1}>
        <Heading size="md" color={"black"}>{book.title}</Heading>
        <Text color="gray.500" fontSize="sm">{book.authorName}</Text>

        <Text color="green.600" fontWeight="bold" fontSize="lg">₹{book.price}</Text>
     
        {isLoggedIn ? (
          <Button
            bg="gray.600"
            color="white"
            size="md"
            w="fit-content"
            _hover={{ bg: "gray.700" }}
            onClick={() => handleBuyBook(book.id)}
          >
            Buy Now
          </Button>
        ) : (
          <Button
            bg="teal.500"
            color="white"
            size="md"
            w="fit-content"
            _hover={{ bg: "teal.600" }}
            onClick={() => navigate("/signin")}
          >
            Get book
          </Button>
        )}
      </Stack>
    </Box>
  );
};

export default BookDigitalCard;