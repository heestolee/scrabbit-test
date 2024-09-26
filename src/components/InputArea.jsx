import React from "react";
import { Box, Input, Button } from "@chakra-ui/react";

export default function InputArea({ url, setUrl, handleFetch, isLoading }) {
  return (
    <Box display="flex" flexDirection="row" justifyContent="center" p={4}>
      <Input
        type="text"
        value={url}
        width={"50rem"}
        bg={"white"}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter Notion page URL"
      />
      <Button
        onClick={handleFetch}
        colorScheme="blue"
        width="10rem"
        isLoading={isLoading}
      >
        Get Notion Data
      </Button>
    </Box>
  );
}
