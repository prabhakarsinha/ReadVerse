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
  StackSeparator,
  chakra,
  Popover,
  Portal,
} from "@chakra-ui/react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import UserService from "../services/UserService";
import apiClient from "../services/api-client"; // <-- import api-client

// 👇 Interface as provided
export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  phoneNo: string;
}

// 👇 Schema based on the User interface (adjusted to match form)
const schema = z.object({
 firstName: z
    .string()
    .min(3, { message: "First name must be at least 3 characters long" })
    .max(225, { message: "First name must be at most 225 characters long" }),

  lastName: z
    .string()
    .min(3, { message: "Last name must be at least 3 characters long" })
    .max(225, { message: "Last name must be at most 225 characters long" }),

  email: z
    .string()
    .min(3, { message: "Email must be at least 3 characters long" })
    .max(255, { message: "Email must be at most 255 characters long" })
    .email({ message: "Email must be a valid email address" }),

  phoneNo: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" })
    .max(15, { message: "Phone number must be at most 15 digits" }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(255, { message: "Password must be at most 255 characters long" }),
  role: z.enum(["ROLE_READER", "ROLE_AUTHOR"]),
});

type FormData = z.infer<typeof schema>;

export default function SignUp() {
  // const toast = useToast();
  const [show, setShow] = useState(false);
  const [showOtpPopover, setShowOtpPopover] = useState(false);
  const [otpStep, setOtpStep] = useState<"email" | "otp">("email");
  const [emailForOtp, setEmailForOtp] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors,  isSubmitSuccessful },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FieldValues) => {
    // Convert form fields to match User interface
    const user: User = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      role: data.role,
      phoneNo: data.phoneNo,
    };

    UserService.create(user)
      .then((res) => {
        res.data;
        setEmailForOtp(data.email);
        setShowOtpPopover(true);
        setOtpStep("email");
      })
      .catch((ex) => {
        // const d = ex?.response?.data || "Something went wrong";
         const errMsg =
        ex?.response?.data?.mesg || "Something went wrong during signup!";
        console.log(ex?.response?.data)
      toast.error(errMsg);
        console.error(
          "Error during signup:",
          ex?.response?.data || "Something went wrong"
        );
      });
  };

  // Send OTP handler
  const handleSendOtp = () => {
    if (!emailForOtp) {
      toast.error("Please enter your email.");
      return;
    }
    // Always send the raw email string, not encoded, in the POST body
    apiClient
      .post(`/verify/send-otp`, { email: emailForOtp })
      .then((res) => {
        res.data;
        toast.success("OTP sent to your email.");
        setOtpStep("otp");
      })
      .catch((ex) => {
        const errMsg =
          ex?.response?.data?.error || "Failed to send OTP. Invalid email format.";
        toast.error(errMsg);
      });
  };

  // Verify OTP handler
  const handleVerifyOtp = () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }
    apiClient
      .post(`/verify/verify-otp`, { email: emailForOtp, otp })
      .then((res) => {
        res.data;
        toast.success("OTP verified successfully!");
        setShowOtpPopover(false); // Only close popover on successful verify
        navigate("/signin", { replace: true });
      })
      .catch((ex) => {
        const errMsg =
          ex?.response?.data?.error || "Invalid OTP. Please try again.";
        toast.error(errMsg);
        // Do NOT close the popover on error
      });
  };

  useEffect(() => {
    if (isSubmitSuccessful) reset();
  }, [isSubmitSuccessful]);

  return (
    <>
      {/* <Toaster /> */}
      <ToastContainer position="top-right" autoClose={3000} />
      <chakra.form onSubmit={handleSubmit(onSubmit)}>
        <Box
          // backgroundImage="url('https://images.unsplash.com/photo-1604866830893-c13cafa515d5?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"
          backgroundSize="cover"
          backgroundColor={"teal"}
          height="100vh"
        >
          <Flex>
            <Center>
              <Box color="white" ml="20rem">
                <Heading>READ_VERSE</Heading>
              </Box>
            </Center>
            <Spacer />

            <Container pt="5rem" mr="10rem" width="50rem">
              <Box p="1.5rem" color="black" bg="white" borderRadius="1rem">
                <Box p={10}>
                  <Heading>Sign Up</Heading>
                </Box>
                <Box pl={10}>
                  <Text>Already have an Account?</Text>
                  <Text color="teal.500">
                    <NavLink to="/signin">Sign In</NavLink>
                  </Text>
                </Box>
                <Box p={10}>
                  <Stack separator={<StackSeparator />}>
                    <Input
                      mb={4}
                      type="text"
                      variant="flushed"
                      placeholder="first name"
                      borderBottom="1px solid #CBD5E0"
                      {...register("firstName")}
                    />
                    {errors.firstName && (
                      <Text color="red">{errors.firstName.message}</Text>
                    )}
                    <Input
                      mb={4}
                      type="text"
                      variant="flushed"
                      placeholder="last name"
                      borderBottom="1px solid #CBD5E0"
                      {...register("lastName")}
                    />
                    {errors.lastName && (
                      <Text color="red">{errors.lastName.message}</Text>
                    )}

                     <Text fontWeight="bold" mb={1} color={"red"}>
                      Role must be either ROLE_READER or ROLE_AUTHOR
                    </Text>
                    <Input
                      mb={4}
                      variant="flushed"
                      borderBottom="1px solid #CBD5E0"
                      placeholder="Enter Role (e.g., ROLE_READER)"
                      {...register("role")}
                    />
                    {errors.role && (
                      <Text color="red">{errors.role.message}</Text>
                    )}
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
                      type="text"
                      variant="flushed"
                      placeholder="Phone no."
                      borderBottom="1px solid #CBD5E0"
                      {...register("phoneNo")}
                    />
                    {errors.phoneNo && (
                      <Text color="red">{errors.phoneNo.message}</Text>
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
                    //  disabled={!isValid}
                    >
                      Sign Up
                    </Button>
                    {/* <NavLink to="/signin">
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
                        Sign In
                      </Button>
                    </NavLink> */}
                  </Box>
                </Box>
              </Box>
            </Container>
          </Flex>
        </Box>
      </chakra.form>

      {/* Modern Chakra Popover for OTP */}
      <Popover.Root
        open={showOtpPopover}
        onOpenChange={details => setShowOtpPopover(details.open)}
      >
        <Popover.Trigger asChild>
          <Box display="none" />
        </Popover.Trigger>
        <Portal>
          <Popover.Positioner>
            <Popover.Content>
              <Popover.Arrow />
              <Popover.Body>
                <Text fontWeight="medium" mb={2}>
                  {otpStep === "email" ? "Verify your Email" : "Enter OTP"}
                </Text>
                {otpStep === "email" ? (
                  <>
                    <Text mb={2}>Enter your email to receive an OTP:</Text>
                    <Input
                      value={emailForOtp}
                      onChange={e => setEmailForOtp(e.target.value)}
                      placeholder="Enter your email"
                      mb={2}
                    />
                    <Button colorScheme="teal" onClick={handleSendOtp} w="100%">
                      Send OTP
                    </Button>
                  </>
                ) : (
                  <>
                    <Text mb={2}>Enter the 6-digit OTP sent to your email:</Text>
                    <Input
                      value={otp}
                      onChange={e => setOtp(e.target.value)}
                      placeholder="Enter OTP"
                      maxLength={6}
                      mb={2}
                    />
                    <Button colorScheme="teal" onClick={handleVerifyOtp} w="100%">
                      Verify OTP
                    </Button>
                    <Button
                     // variant="link"
                      size="sm"
                      mt={2}
                      onClick={handleSendOtp}
                    >
                      Resend OTP
                    </Button>
                  </>
                )}
              </Popover.Body>
            </Popover.Content>
          </Popover.Positioner>
        </Portal>
      </Popover.Root>
    </>
  );
}
