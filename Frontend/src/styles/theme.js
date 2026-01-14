import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    heading: "'D-DIN', 'Helvetica Neue', Arial, sans-serif",
    body: "'D-DIN', 'Helvetica Neue', Arial, sans-serif",
  },
  styles: {
    global: () => ({
      "@font-face": {
        fontFamily: "D-DIN",
        src: `url('https://fonts.cdnfonts.com/s/12237/D-DIN.woff') format('woff')`,
        fontWeight: "normal",
        fontStyle: "normal",
      },
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
