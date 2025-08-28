import React from "react";
import { Box, Flex, Image, Stack, Heading, Text, Button } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import BookLicense from "../services/BookLicense";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const Purchase: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const book = location.state?.book;
  const token = localStorage.getItem("Authorization");
  const t = token ? `Bearer ${token}` : "";

  // Decode JWT to get userId
  let userId: number | undefined = undefined;
  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      userId = decoded.id;
    } catch {
      userId = 11;
    }
  }

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBuyBook = async (id: number) => {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert("Razorpay SDK failed to load. Check your internet connection.");
      return;
    }

    // Use Authorization header in axios
    const { data } = await axios.post(
      "http://localhost:8080/api/payment/create-order",
      {
        amount: 500,
        bookId: id,
        userId: userId, // Use decoded userId
      },
      {
        headers: {
          Authorization: t,
        },
      }
    );

    const options = {
      key: "rzp_test_Qu5fJCc0JnSzIa",
      //Replace with your Razorpay key
      amount: data.amount,
      currency: data.currency,
      name: "My E-Book Store",
      description: "Book Purchase",
      order_id: data.id,
      handler: function (response: any) {
        toast.success("Payment Successful!");
        console.log(response);
        navigate("/library");
      },
      theme: {
        color: "#3399cc",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  if (!book) {
    return (
      <Flex align="center" justify="center" minH="100vh">
        <Text color="red.500" fontWeight="bold">
          No book data found.
        </Text>
      </Flex>
    );
  }

  return (
    <Flex align="center" justify="center" minH="100vh" bg="gray.50">
      <Box
        bg="white"
        borderRadius="lg"
        boxShadow="lg"
        p={8}
        maxW="2xl"
        w="100%"
      >
        <Flex direction={{ base: "column", md: "row" }} align="center" gap={8}>
          <Image
            src={book.imageUrl}
            alt={book.title}
            boxSize="200px"
            objectFit="cover"
            borderRadius="md"
            mb={{ base: 6, md: 0 }}
          />
          <Stack flex="1">
            <Heading size="md" color="gray.500">{book.title}</Heading>
            <Text color="black">
              <b>Author:</b> {book.authorName}
            </Text>
            <Text color="black">
              <b>Category:</b> {book.categoryName}
            </Text>
            <Text color="black">
              <b>Price:</b> ₹{book.price}
            </Text>
            <Button
            //  colorScheme="blue"
              size="lg"
              mt={4}
              variant="outline"
              border={"1px solid grey"}
              borderRadius={"md"}
             color="black"
              _hover={{ bg: "green" }}
              onClick={() => handleBuyBook(book.id)}
            >
              Pay Now
            </Button>
          </Stack>
        </Flex>
      </Box>
    </Flex>
  );
};

export default Purchase;
