import { Text, Stack, Button, Image, Heading, Box } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import type { Book } from "../services/BookService";

interface BookDigitalCardProps {
  book: Book;
}

const AuthorBookCard = ( { book }: BookDigitalCardProps) => {
    const navigate = useNavigate();
    return ( 
         <Box maxW="sm" boxShadow="md" borderRadius="lg" overflow="hidden" bg="white" display="flex" alignItems="center" p={4}>
      <Image src={book.imageUrl} alt={book.title} objectFit="cover" w="120px" h="180px" borderRadius="md" mr={6} />
      <Stack gap={3} flex={1}>
        <Heading size="md" color={"black"}>{book.title}</Heading>
        <Text color="gray.500" fontSize="sm">{book.authorName}</Text>
        <Text color="teal.500" fontSize="sm">{book.categoryName}</Text>
        <Text color="green.600" fontWeight="bold" fontSize="lg">₹{book.price}</Text>
        
          <Button
            bg="gray.600"
            color="white"
            size="md"
            w="fit-content"
            _hover={{ bg: "gray.700" }}
            onClick={() =>  navigate("/update-book", { state: { book } })}
          >
            update book
          </Button>
           
      </Stack>
    </Box>
     );
}
 
export default AuthorBookCard;