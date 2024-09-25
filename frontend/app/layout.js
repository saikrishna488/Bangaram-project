import localFont from "next/font/local";
import "./globals.css";
import { GlobalProvider } from "@/contextapi/GlobalContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Bangaram BGRM",
  description: "Banagram The digital Gold",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          async
          src="https://telegram.org/js/telegram-web-app.js"
        ></script>
        <GlobalProvider>

          {children}
          <ToastContainer />
        </GlobalProvider>
      </body>
    </html>
  );
}
