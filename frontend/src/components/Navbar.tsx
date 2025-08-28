import React, { useEffect, useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Navbar: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("Authorization");
    setToken(storedToken);
    if (storedToken) {
      try {
        const decoded: any = jwtDecode(storedToken);
        // Adjust this if your JWT structure is different
        setRole(decoded.authorities[0] || null);
      } catch {
        setRole(null);
      }
    } else {
      setRole(null);
    }
  }, []);

  return (
    <Box bg="black" px={4} py={2} boxShadow="sm">
      <Flex align="center" justify="space-between">
        <Text fontWeight="bold" fontSize="xl" color="white">
          READ VERSE
        </Text>
        <Flex gap={4}>
          {token ? (
            <>
              {role === "ROLE_READER" && (
                <Link
                  to="/library"
                  style={{
                    color: "#3182ce",
                    border: "1px solid #3182ce",
                    padding: "6px 18px",
                    borderRadius: "6px",
                    textDecoration: "none",
                    fontWeight: 500,
                  }}
                >
                  Library
                </Link>
              )}
              <Link
                to="#"
                style={{
                  color: "#E53E3E",
                  border: "1px solid #E53E3E",
                  padding: "6px 18px",
                  borderRadius: "6px",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
                onClick={() => {
                  localStorage.removeItem("Authorization");
                  window.location.replace("/");
                }}
              >
                Sign Out
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                style={{
                  color: "#319795",
                  border: "1px solid #319795",
                  padding: "6px 18px",
                  borderRadius: "6px",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                style={{
                  color: "#319795",
                  border: "1px solid #319795",
                  padding: "6px 18px",
                  borderRadius: "6px",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                sign up
              </Link>
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;