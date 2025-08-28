import React, { useState, useEffect } from "react";
import {
  Button,
  Field,
  Fieldset,
  Input,
  Stack,
  Heading,
  Table,
  Grid,
  Box,
} from "@chakra-ui/react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import BookService from "../services/BookService";
import CategoryService from "../services/CategoryService";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, NavLink } from "react-router-dom";
import type { Category } from "../services/CategoryService";

// Zod schema for step 1
const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  categoryId: z.string().min(1, "Category ID is required"),
  price: z.string().min(1, "Price is required"),
  description: z.string().min(10, "Description is required and have at least 10 characters"),
});

type BookFormValues = z.infer<typeof bookSchema>;

const AddBookForm = () => {
  const [step, setStep] = useState(1);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [bookId, setBookId] = useState<Number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const token = localStorage.getItem("Authorization");
  const t = token ? `Bearer ${token}` : "";
  const navigate = useNavigate();

  // react-hook-form for step 1
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
  });

  useEffect(() => {
    CategoryService.getAll<Category>().then((res) => {
      if (Array.isArray(res.data)) {
        setCategories(res.data);
      }
    });
  }, []);

  // Step 1: Create book
  const onSubmitStep1 = async (data: BookFormValues) => {
    try {
      const bookData = {
        title: data.title,
        categoryId: Number(data.categoryId),
        price: Number(data.price),
        description: data.description,
      };
      const res = await BookService.create(bookData,"/");
      const id = Number(res.data.mesg);
      setBookId(id);
      toast.success("Book created! Now upload the image.");
      setStep(2);
    } catch (err: any) {
      // Show backend error message if present
      const msg = err?.response?.data?.mesg || "Failed to create book";
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
      setStep(3);
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
      setStep(1);
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
        <Grid templateColumns={{ base: "1fr", md: "1fr 2fr" }} gap={8}>
          {/* Left: Category Table */}
          <Box maxH="400px" overflowY="auto">
            <Heading size="sm" mb={2}>Available Categories</Heading>
            <Table.Root size="sm">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Category ID</Table.ColumnHeader>
                  <Table.ColumnHeader>Category Name</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {categories.map((cat) => (
                  <Table.Row key={cat.id}>
                    <Table.Cell>{cat.id}</Table.Cell>
                    <Table.Cell>{cat.name}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
          {/* Right: Add Book Form */}
          <Box>
            <Stack maxW="md" mx="auto">
              <Heading style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                Step {step} of 3
              </Heading>
              {step === 1 && (
                <form onSubmit={handleSubmit(onSubmitStep1)}>
                  <Fieldset.Root size="lg">
                    <Stack>
                      <Fieldset.Legend>Book Details</Fieldset.Legend>
                      <Fieldset.HelperText>
                        Fill out the details to create your book entry.
                      </Fieldset.HelperText>
                    </Stack>

                    <Fieldset.Content>
                      <Field.Root>
                        <Field.Label>Title</Field.Label>
                        <Input
                          {...register("title")}
                          required
                        />
                        {errors.title && (
                          <span style={{ color: "red" }}>{errors.title.message}</span>
                        )}
                      </Field.Root>

                      <Field.Root>
                        <Field.Label>Category ID</Field.Label>
                        <Input
                          type="number"
                          {...register("categoryId")}
                          required
                        />
                        {errors.categoryId && (
                          <span style={{ color: "red" }}>{errors.categoryId.message}</span>
                        )}
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
                        <Input
                          {...register("description")}
                          required
                        />
                        {errors.description && (
                          <span style={{ color: "red" }}>{errors.description.message}</span>
                        )}
                      </Field.Root>
                    </Fieldset.Content>

                    <Button type="submit" alignSelf="flex-start" mt={4} loading={isSubmitting}>
                     Add book
                    </Button>
                  </Fieldset.Root>
                </form>
              )}

              {step === 2 && (
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
              )}

              {step === 3 && (
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
                      Finish
                    </Button>
                  </Fieldset.Root>
                </form>
              )}
            </Stack>
          </Box>
        </Grid>
      </Box>
    </>
  );
};

export default AddBookForm;
