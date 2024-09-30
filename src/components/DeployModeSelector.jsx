import React from "react";
import { Box, FormControl, FormLabel, Switch } from "@chakra-ui/react";

export default function DeployModeSelector({ deployMode, setDeployMode }) {
  const handleSwitchChange = () => {
    setDeployMode(deployMode === "full" ? "partial" : "full");
  };

  return (
    <Box mb={6}>
      <FormControl display="flex" alignItems="center" justifyContent="center">
        <Switch
          id="deploy-mode-switch"
          isChecked={deployMode === "partial"}
          onChange={handleSwitchChange}
          colorScheme="blue"
        />
        <FormLabel htmlFor="deploy-mode-switch" mb="0">
          {deployMode === "full" ? "전체배포" : "부분배포"}
        </FormLabel>
      </FormControl>
    </Box>
  );
}
