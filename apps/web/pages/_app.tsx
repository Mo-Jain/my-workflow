import Header from "@/components/NavBar";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "@/components/ui/toaster"
import InitUser from "@/components/InitUser";
import { RecoilRoot } from "recoil";



export default function App({ Component, pageProps }: AppProps) {
  return<>
    <RecoilRoot>
      <Header />
      <InitUser/>
      <Component {...pageProps} />
      <Toaster />
    </RecoilRoot>
  </> ;
}
