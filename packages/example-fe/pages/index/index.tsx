import React from "react";
import { Box } from "../components/xstyle";

function Index() {
  return (
    <div>
      Hello
      <Box
        color="pink"
        textAlign="center"
        fontSize="36px"
        p="20px"
        display="flex"
        justifyContent="center"
        alignItems="center"
        borderColor="pink"
        borderWidth="2px"
        borderStyle="solid"
        borderRadius="20px"
      >
        World
      </Box>
    </div>
  );
}

export default Index;
