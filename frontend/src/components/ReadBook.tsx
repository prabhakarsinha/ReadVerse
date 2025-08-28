import React, { useEffect, useState } from "react";
import { Box, Center, Text, Button } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const ReadBook: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const id = location.state?.bookId;
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Read token from localStorage
  const token = localStorage.getItem("Authorization");
  const t = token ? `Bearer ${token}` : "";

  useEffect(() => {
    if (!id) {
      setError("No book ID provided in location state.");
      setPdfUrl("");
      return;
    }

    const fetchPdf = async () => {
      try {
        setError(""); // reset error before fetching
        const response = await axios.get(`http://localhost:8080/api/books/file/${id}`, {
          responseType: "blob",
          headers: {
            Authorization: t,
          },
        });
        const url = URL.createObjectURL(response.data);
        setPdfUrl(url);
      } catch (err: any) {
        console.error("Error fetching PDF", err);
        setError("Failed to load PDF. Please try again.");
      }
    };

    fetchPdf();

    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
        setPdfUrl("");
      }
    };
  }, [id, t]);

  if (error) {
    return (
      <Center height="100vh" px={4}>
        <Button mb={4} colorScheme="teal" variant="outline" onClick={() => navigate("/library")}>
          &larr; Back to Library
        </Button>
        <Text color="red.500" fontSize="lg" textAlign="center">
          {error}
        </Text>
      </Center>
    );
  }

  if (!pdfUrl) {
    return null;
  }

  return (
    <Box height="100vh" width="100vw">
      <Button mb={4} colorScheme="teal" variant="outline" onClick={() => navigate("/library")}>
        &larr; Back to Library
      </Button>
      <iframe
        title="PDF Viewer"
        src={`${pdfUrl}#toolbar=0`}
        width="100%"
        height="100%"
        style={{ border: "none" }}
      />
      {/* You can use pageNumber in your logic, but no visible controls */}
    </Box>
  );
};

export default ReadBook;