import "@/styles/globals.css";
import type { AppProps } from "next/app";
import ConfigProvider from "antd/lib/config-provider";
import es from "antd/locale/es_ES";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;
import { ApolloProvider } from "@apollo/client";
import createSektorApiClient from "@/lib/sektor-api/conflg/client";
import { Flip, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const sektorApiClient = createSektorApiClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={sektorApiClient}>
      <ConfigProvider locale={es}>
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={true}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Flip}
        />
        <Component {...pageProps} />
      </ConfigProvider>
    </ApolloProvider>
  );
}
