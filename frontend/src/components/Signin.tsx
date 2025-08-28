import React, { useEffect, useState } from "react";
import {
  Button,
  Center,
  Heading,
  Text,
  Input,
  Stack,
  Flex,
  Box,
  Spacer,
  Container,
  chakra,
} from "@chakra-ui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import UserService from "../services/UserService";
import { jwtDecode } from "jwt-decode";

// Auth interface for signin
interface Auth {
  email: string;
  password: string;
}

// Zod schema for Auth
const schema = z.object({
  email: z
    .string()
    .min(3, { message: "Email must be at least 3 characters long" })
    .max(255, { message: "Email must be at most 255 characters long" })
    .email({ message: "Email must be a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(255, { message: "Password must be at most 255 characters long" }),
});

type FormData = z.infer<typeof schema>;

const Signin = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitSuccessful },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    const auth: Auth = {
      email: data.email,
      password: data.password,
    };

    UserService.create(auth, "signin")
      .then((res) => {
        if (res?.data?.jwt) {
          localStorage.setItem("Authorization", res.data.jwt);
          
          try {
            const decoded: any = jwtDecode(res.data.jwt);
            const authorities = decoded.authorities || [];
            if (authorities.includes("ROLE_AUTHOR")) {
              navigate("/author-dashboard", { replace: true });
            } else if (authorities.includes("ROLE_READER")) {
              navigate("/", { replace: true });
            } else {
              navigate("/", { replace: true });
            }
          } catch (err) {
            // fallback if decode fails
            navigate("/", { replace: true });
          }
        } else {
          toast.error("Invalid response from server");
        }
      })
      .catch((ex) => {
        const errMsg =
          ex?.response?.data?.message || "Invalid credentials!";
        toast.error(errMsg);
      });
  };

  useEffect(() => {
    if (isSubmitSuccessful) reset();
  }, [isSubmitSuccessful]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <chakra.form onSubmit={handleSubmit(onSubmit)}>
        <Box backgroundSize="cover" backgroundColor={"teal"} height="100vh">
          <Flex>
            <Center>
              <Box color="white" ml="20rem">
                <Heading>READVERSE</Heading>
              </Box>
            </Center>
            <Spacer />
            <Container pt="5rem" mr="10rem" width="50rem">
              <Box p="1.5rem" color="black" bg="white" borderRadius="1rem">
                <Box p={10}>
                  <Heading>Sign In</Heading>
                </Box>
                <Box pl={10}>
                  <Text>Don't have an Account?</Text>
                  <Text color="teal.500">
                    <NavLink to="/signup">Sign Up</NavLink>
                  </Text>
                </Box>
                <Box p={10}>
                  <Stack>
                    <Input
                      mb={4}
                      type="email"
                      variant="flushed"
                      placeholder="Email"
                      borderBottom="1px solid #CBD5E0"
                      {...register("email")}
                    />
                    {errors.email && (
                      <Text color="red">{errors.email.message}</Text>
                    )}
                    <Input
                      mb={4}
                      type={show ? "text" : "password"}
                      variant="flushed"
                      placeholder="Password"
                      borderBottom="1px solid #CBD5E0"
                      {...register("password")}
                    />
                    <Button
                      h="1.75rem"
                      size="sm"
                      onClick={() => setShow(!show)}
                    >
                      {show ? "Hide" : "Show"}
                    </Button>
                    {errors.password && (
                      <Text color="red">{errors.password.message}</Text>
                    )}
                  </Stack>
                  <Box ml="20rem" mt="1.5rem" display="flex" gap="1rem">
                    <Button
                      type="submit"
                      bg="#4285F4"
                      color="white"
                      borderRadius="2rem"
                      w="8rem"
                      disabled={!isValid}
                    >
                      Sign In
                    </Button>
                    {/* <NavLink to="/signup">
                      <Button
                        bg="teal"
                        color="white"
                        borderRadius="2rem"
                        w="8rem"
                        variant="ghost"
                        type="button"
                        border="none"
                        _hover={{ bg: "teal.100" }}
                        _active={{ bg: "teal.200" }}
                      >
                        Sign Up
                      </Button>
                    </NavLink> */}
                  </Box>
                </Box>
              </Box>
            </Container>
          </Flex>
        </Box>
      </chakra.form>
    </>
  );
};

export default Signin;