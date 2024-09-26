import React from "react";
import { Box, Input, Button, FormControl } from "@chakra-ui/react";

export default function UrlInputArea({ url, setUrl, handleFetch, isLoading }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    handleFetch();
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      display="flex"
      flexDirection="row"
      justifyContent="center"
      p={4}
      gap={3}
      alignItems="center"
    >
      <FormControl width="50rem" isRequired>
        <Input
          type="text"
          value={url}
          bg={"white"}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter Notion page URL"
          borderColor="gray.300"
          borderRadius="md"
          _focus={{ borderColor: "blue.500" }}
          boxShadow="sm"
        />
      </FormControl>
      <Button
        type="submit"
        colorScheme="blue"
        width="10rem"
        isLoading={isLoading}
        borderRadius="md"
        _hover={{ bg: "blue.400" }}
        boxShadow="md"
      >
        Get Data
      </Button>
    </Box>
  );
}
