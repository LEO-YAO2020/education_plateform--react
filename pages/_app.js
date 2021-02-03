import { makeServer } from "../mirage/mirage";
import "../styles/globals.less";
import { MessageProvider } from "../components/provider";

if (process.env.NODE_ENV === "development") {
  makeServer({ environment: "development" });
}

function MyApp({ Component, pageProps }) {
  return (
    <MessageProvider>
      <Component {...pageProps} />
    </MessageProvider>
  );
}

export default MyApp;
