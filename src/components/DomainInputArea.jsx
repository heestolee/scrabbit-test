import React from "react";
import { Box, Input, Button } from "@chakra-ui/react";

export default function DomainInputArea({ subdomain, setSubdomain, handleDeploy }) {
  return (
    <Box display="flex" flexDirection="row" alignItems="center" p={4} w="100%">
      <Box display="flex" w="full" alignItems="end" paddingRight={4}>
        <Input
          height={"2.5rem"}
          type="text"
          value={subdomain}
          onChange={(e) => setSubdomain(e.target.value)}
          placeholder="custom domain"
          bg={"white"}
          size="l"
          mr={2}
          borderRadius={"ms"}
        />
        <span>.notiondrop.site</span>
      </Box>
      <Button onClick={handleDeploy} colorScheme="green" width="15rem">
        Deploy
      </Button>
    </Box>
  );
};
