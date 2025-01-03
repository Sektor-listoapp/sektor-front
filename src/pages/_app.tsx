import "@/styles/globals.css";
import type { AppProps } from "next/app";
import ConfigProvider from "antd/lib/config-provider";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;
import { ApolloProvider } from "@apollo/client";
import createSektorApiClient from "@/lib/sektor-api/conflg/client";
import { Flip, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import "dayjs/locale/es-us";
import dayjs from "dayjs";
import es from "antd/lib/locale/es_ES";
import advancedFormat from "dayjs/plugin/advancedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localeData from "dayjs/plugin/localeData";
import weekday from "dayjs/plugin/weekday";
import weekOfYear from "dayjs/plugin/weekOfYear";
import weekYear from "dayjs/plugin/weekYear";

dayjs.locale("es");
dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);

const sektorApiClient = createSektorApiClient();

export default function App({ Component, pageProps, router }: AppProps) {
  return (
    <ApolloProvider client={sektorApiClient}>
      <ConfigProvider locale={es}>
        <ToastContainer
          position="bottom-center"
          autoClose={6000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={true}
          rtl={false}
          pauseOnHover
          theme="light"
          transition={Flip}
          toastStyle={{
            width: "80%",
            fontFamily: "Century Gothic",
            fontSize: "0.9rem",
            paddingTop: "2rem",
            paddingBottom: "2rem",
          }}
        />
        <motion.div
          key={router.route}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.7 }}
          variants={{
            initial: {
              opacity: 0,
            },
            animate: {
              opacity: 1,
            },
          }}
        >
          <Component {...pageProps} />
        </motion.div>
      </ConfigProvider>
    </ApolloProvider>
  );
}
