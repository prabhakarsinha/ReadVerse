import { useEffect, useState } from "react";
import { Box, SimpleGrid, Button } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import BookLicense from "../services/BookLicense";
import type { BookLicense as BookLicenseType } from "../services/BookLicense";
import BookLicenseCard from "./BookLicenseCard";

const Library = () => {
  const [licenses, setLicenses] = useState<BookLicenseType[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    BookLicense.getAll<BookLicenseType>()
      .then((res) => {
        setLicenses(res.data);
        setError(res.data.length === 0 ? "No books found." : null);
      })
      .catch(() => setError("Failed to load your library."));
  }, []);

  return (
    <Box p={8} bg="gray.50" minH="100vh">
      <Box mb={4}>
        <NavLink to="/">
          <Button colorScheme="teal" variant="outline">
            &larr; Back to Home
          </Button>
        </NavLink>
      </Box>
      {error ? (
        <Box
          color="red.500"
          fontWeight="bold"
          fontSize="xl"
          textAlign="center"
          py={12}
        >
          {error}
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 2, md: 4, lg: 6 }} gap={8}>
          {licenses.map((license) => (
            <BookLicenseCard key={license.id} license={license} />
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default Library;