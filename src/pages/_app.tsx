import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import es from "antd/locale/es_ES";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AntdRegistry>
      <ConfigProvider locale={es}>
        <Component {...pageProps} />
      </ConfigProvider>
    </AntdRegistry>
  );
}
