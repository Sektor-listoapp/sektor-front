import PrelineScript from "@/components/scripts/preline";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="es">
      <Head />
      <PrelineScript />
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
