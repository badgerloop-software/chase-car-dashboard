import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: () => ({
      "::-webkit-scrollbar": {
        height: "5px",
        width: "5px",
      },

      "::-webkit-scrollbar-track": {
        borderRadius: "0px",
      },

      "::-webkit-scrollbar-thumb": {
        backgroundColor: "#CCC",
        borderRadius: "80px",
      },
    }),
  },
});

export default theme;
