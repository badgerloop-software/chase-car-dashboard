import { mode } from '@chakra-ui/theme-tools';
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  components: {
    VStack: {
      baseStyle: {
          backgroundColor: mode("#fff000", "#00ff00"),
      }
    }
  },
  styles: {
    global: (props) => ({
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
  config: {
    initialColorMode: 'system',
    useSystemColorMode: false,
  },
});

export default theme;
