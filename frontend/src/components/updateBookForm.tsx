import React, { useState, useEffect } from "react";
import {
  Button,
  Field,
  Fieldset,
  Input,
  Stack,
  Heading,
  Box,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import BookService from "../services/BookService";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import "react-toastify/dist/ReactToastify.css";



// Zod schema for step 1
const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  categoryName: z.string().min(1, "Category Name is required"),
  price: z.string().min(1, "Price is required"),
  description: z.string().min(10, "Description is required and have at least 10 characters"),
});

type BookFormValues = z.infer<typeof bookSchema>;

const UpdateBookForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [bookId, setBookId] = useState<Number | null>(null);
  


 

  const token = localStorage.getItem("Authorization");
  const t = token ? `Bearer ${token}` : "";
 

  // Extract initial values from location.state
  const initialBook = location.state?.book || {};

  // react-hook-form for step 1
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: initialBook.title || "",
      categoryName: initialBook.categoryName || "",
      price: initialBook.price ? String(initialBook.price) : "",
      description: initialBook.description || "",
    },
  });

  useEffect(() => {
    // Set bookId if present in initialBook
    if (initialBook.id) {
      setBookId(initialBook.id);
    }
    // Optionally, reset form if location.state changes
    reset({
      title: initialBook.title || "",
      categoryName: initialBook.categoryName || "",
      price: initialBook.price ? String(initialBook.price) : "",
      description: initialBook.description || "",
    });
    // eslint-disable-next-line
  }, [location.state]);

  // Step 1: Create book
  const onSubmitStep1 = async (data: BookFormValues) => {
    console.log("Updating book with data:", data);
    try {
      const bookData = {
        title: data.title,
        categoryName: data.categoryName,
        price: Number(data.price),
        description: data.description,
      };
      console.log("Sending bookData to backend:", bookData, "bookId:", bookId);
      const res = await BookService.update(bookData, `${bookId}`);
      console.log("Book updated response:", res.data);
      toast.success("Book updated!");
      // Optionally navigate or reset here
    } catch (err: any) {
      console.error("Update book error:", err);
      const msg = err?.response?.data?.mesg || "Failed to update book";
      toast.error(msg);
    }
  };

  // Step 2: Upload image
  const handleImageUpload = async (e: React.FormEvent) => {
    console.log("Uploading image...");
    console.log("bookId before upload:", bookId);
    e.preventDefault();
    if (!imageFile || !bookId) {
      return toast.error("Please select an image");
    }
    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      // Await the axios.post call
      const res = await axios.post(
        `http://localhost:8080/api/books/upload-image/${bookId}`,
        formData,
        {
          headers: {
            Authorization: t,
            // Do NOT set Content-Type manually for FormData; let the browser set it (with boundary)
          },
        }
      );
      console.log("Image upload response:", res);

      toast.success("Image uploaded! Now upload the PDF.");
    
    } catch (err) {
      console.error("Image upload error:", err);
      toast.error("Failed to upload image");
    }
  };

  // Step 3: Upload PDF
  const handlePdfUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfFile || !bookId) {
      return toast.error("Please select a PDF file");
    }
    try {
      const formData = new FormData();
      formData.append("file", pdfFile);

      await axios.post(
        `http://localhost:8080/api/books/upload-file/${bookId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: t,
          },
        }
      );

      toast.success("PDF uploaded successfully! 🎉");

      reset();
      setImageFile(null);
      setPdfFile(null);
      setBookId(null);
      navigate("/author-dashboard");
    } catch (err) {
      toast.error("Failed to upload PDF");
    }
  };

  return (
    <>
      <ToastContainer />
      <Box maxW="5xl" mx="auto" mt={8}>
        <Box mb={4}>
          <NavLink to="/author-dashboard">
            <Button colorScheme="teal" variant="outline">
              &larr; Back to Author Dashboard
            </Button>
          </NavLink>
        </Box>
        <Grid templateColumns="repeat(3, 1fr)" gap={8}>
          {/* Book Details Form */}
          <GridItem colSpan={1}>
            <Box>
              <Stack maxW="md" mx="auto">
                <Heading style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                  Book Details
                </Heading>
                <form onSubmit={handleSubmit(onSubmitStep1)}>
                  <Fieldset.Root size="lg">
                    <Stack>
                      <Fieldset.Legend>Book Details</Fieldset.Legend>
                      <Fieldset.HelperText>
                        Fill out the details to update your book entry.
                      </Fieldset.HelperText>
                    </Stack>
                    <Fieldset.Content>
                      <Field.Root>
                        <Field.Label>Title</Field.Label>
                        <Input {...register("title")} required />
                        {errors.title && (
                          <span style={{ color: "red" }}>{errors.title.message}</span>
                        )}
                      </Field.Root>
                      <Field.Root>
                        <Field.Label>Category</Field.Label>
                        <Input
                          {...register("categoryName")}
                          readOnly
                          bg="gray.100"
                          color="gray.700"
                          cursor="not-allowed"
                        />
                      </Field.Root>
                      <Field.Root>
                        <Field.Label>Price</Field.Label>
                        <Input
                          type="number"
                          {...register("price")}
                          required
                        />
                        {errors.price && (
                          <span style={{ color: "red" }}>{errors.price.message}</span>
                        )}
                      </Field.Root>
                      <Field.Root>
                        <Field.Label>Description</Field.Label>
                        <Input {...register("description")} required />
                        {errors.description && (
                          <span style={{ color: "red" }}>{errors.description.message}</span>
                        )}
                      </Field.Root>
                    </Fieldset.Content>
                    <Button type="submit" alignSelf="flex-start" mt={4} 
                    loading={isSubmitting}
                    >
                      Update Book
                    </Button>
                  </Fieldset.Root>
                </form>
              </Stack>
            </Box>
          </GridItem>
          {/* Image Upload */}
          <GridItem colSpan={1}>
            <Box>
              <Stack maxW="md" mx="auto">
                <Heading size="md" mb={4}>Upload Image</Heading>
                <form onSubmit={handleImageUpload}>
                  <Fieldset.Root size="lg">
                    <Stack>
                      <Fieldset.Legend>Upload Image</Fieldset.Legend>
                      <Fieldset.HelperText>
                        Choose a cover image for your book.
                      </Fieldset.HelperText>
                    </Stack>
                    <Fieldset.Content>
                      <Field.Root>
                        <Field.Label>Book Image</Field.Label>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            setImageFile(e.target.files && e.target.files.length > 0 ? e.target.files[0] : null)
                          }
                          required
                        />
                      </Field.Root>
                    </Fieldset.Content>
                    <Button
                      type="submit"
                      alignSelf="flex-start"
                      mt={4}
                      disabled={imageFile === null}
                    >
                      Upload Image
                    </Button>
                  </Fieldset.Root>
                </form>
              </Stack>
            </Box>
          </GridItem>
          {/* PDF Upload */}
          <GridItem colSpan={1}>
            <Box>
              <Stack maxW="md" mx="auto">
                <Heading size="md" mb={4}>Upload PDF</Heading>
                <form onSubmit={handlePdfUpload}>
                  <Fieldset.Root size="lg">
                    <Stack>
                      <Fieldset.Legend>Upload PDF</Fieldset.Legend>
                      <Fieldset.HelperText>
                        Choose the PDF file for your book.
                      </Fieldset.HelperText>
                    </Stack>
                    <Fieldset.Content>
                      <Field.Root>
                        <Field.Label>Book File</Field.Label>
                        <Input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) =>
                            setPdfFile(e.target.files ? e.target.files[0] : null)
                          }
                          required
                        />
                      </Field.Root>
                    </Fieldset.Content>
                    <Button type="submit" alignSelf="flex-start" mt={4}>
                      Upload PDF
                    </Button>
                  </Fieldset.Root>
                </form>
              </Stack>
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </>
  );
};

export default UpdateBookForm;
