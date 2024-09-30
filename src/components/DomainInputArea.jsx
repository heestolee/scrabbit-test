import React from "react";
import { Box, Input, Button, FormControl } from "@chakra-ui/react";

export default function DomainInputArea({
  subdomain,
  setSubdomain,
  handleDeploy,
}) {
  const handleSubmit = (event) => {
    event.preventDefault();
    handleDeploy();
  };

  return (
    <Box display="flex" flexDirection="row" alignItems="center" p={4} w="100%">
      <form
        onSubmit={handleSubmit}
        style={{ width: "100%", display: "flex", alignItems: "center" }}
      >
        <Box display="flex" w="full" alignItems="baseline" paddingRight={4}>
          <FormControl>
            <Input
              id="subdomain"
              height={"2.5rem"}
              type="text"
              value={subdomain}
              onChange={(e) => setSubdomain(e.target.value)}
              placeholder="custom domain"
              bg={"white"}
              size="l"
              mr={2}
              pl={2}
              borderRadius={"xl"}
            />
          </FormControl>
          <span>.notiondrop.site</span>
        </Box>
        <Button type="submit" colorScheme="green" width="15rem">
          배포
        </Button>
      </form>
    </Box>
  );
}
