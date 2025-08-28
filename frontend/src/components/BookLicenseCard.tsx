import { Box, Image, Stack, Heading, Text, Button } from "@chakra-ui/react";
import type { BookLicense } from "../services/BookLicense";
import { useNavigate } from "react-router-dom";
interface BookLicenseCardProps {
  license: BookLicense;
}

const BookLicenseCard = ({ license }: BookLicenseCardProps) => {
  const navigate = useNavigate();

  const handleReadClick = (bookId: number) => {
    navigate(`/read/${bookId}`, {
      state: { bookId },  // pass bookId as state
    });
  };

  return (
    <Box
      maxW="xs"
      borderRadius="2xl"
      overflow="hidden"
      bg="white"
      boxShadow="2xl"
      p={0}
      textAlign="center"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Image
        src={license.imageUrl}
        alt={license.title}
        objectFit="cover"
        w="100%"
        h="320px"
        borderTopRadius="2xl"
      />
      <Stack  w="100%" align="center" p={4} flex={1}>
        <Text
          color="gray.600"
          fontWeight="medium"
          fontSize="md"
          letterSpacing="wide"
        >
          {license.authorName}
        </Text>
        <Heading
          color="black"
          fontSize="xl"
          fontWeight="bold"
          letterSpacing="wide"
          mb={2}
          w="100%"
          textAlign="center"
        >
          {license.title}
        </Heading>
        <Box flex="1" />
        <Button
          colorScheme="teal"
          size="sm"
          borderRadius="xl"
          fontWeight="bold"
          px={10}
          py={3}
          mt={2}
          mb={1}
          border="2px solid #319795"
          transition="all 0.2s"
          _hover={{
            bg: "teal.600",
            color: "white",
            borderColor: "teal.700",
            transform: "scale(1.04)",
          }}
          onClick={() => handleReadClick(license.id)}
        >
          Read
        </Button>
      </Stack>
    </Box>
  );
};

export default BookLicenseCard;
