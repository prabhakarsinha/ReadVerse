import React, { useEffect, useState } from "react";
import { Box, Spinner, Center } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import axios from "axios";

const PDFViewerIframe: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pdfUrl, setPdfUrl] = useState<string>("");

  // Read token from localStorage
  const token = localStorage.getItem("Authorization");
  const t = token ? `Bearer ${token}` : "";

  useEffect(() => {
    if (!id) return;

    const fetchPdf = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/books/file/${id}`, {
          responseType: "blob",
          headers: {
            Authorization: t,
          },
        });
        const url = URL.createObjectURL(response.data);
        setPdfUrl(url);
      } catch (error) {
        console.error("Error fetching PDF", error);
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

  if (!pdfUrl) {
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box height="100vh" width="100vw">
      <iframe
        title="PDF Viewer"
        src={pdfUrl}
        width="100%"
        height="100%"
        style={{ border: "none" }}
      />
    </Box>
  );
};

export default PDFViewerIframe;