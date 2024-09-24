import React from "react";
import { Box, Radio, RadioGroup, Stack } from "@chakra-ui/react";

export default function DeployModeSelector({ deployMode, setDeployMode }) {
  return (
    <Box mb={6}>
      <RadioGroup onChange={setDeployMode} value={deployMode}>
        <Stack direction="row" spacing={4} justify="center">
          <Radio value="url">Deploy by URL</Radio>
          <Radio value="partial">Partial Deploy</Radio>
        </Stack>
      </RadioGroup>
    </Box>
  );
}
