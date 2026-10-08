import { Fira_Code, Inter, Poppins } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-poppins",
  display: "swap",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
  display: "swap",
});

export const metadata = {
  title: "Appwrite + Next.js",
  description: "Appwrite starter for Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} ${firaCode.variable}`}
    >
      <head>
        <link rel="icon" href="/appwrite.svg" />
        <link rel="icon" type="image/svg+xml" href="/appwrite.svg" />
      </head>
      <body
        className={"bg-[#FAFAFB] text-sm font-(--font-inter) text-[#56565C]"}
      >
        {children}
      </body>
    </html>
  );
}
