import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";

export const metadata = {
  title: "NotionDrop",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <ColorModeScript />
      </head>
      <body>
        <ChakraProvider>{children}</ChakraProvider>
      </body>
    </html>
  );
}
