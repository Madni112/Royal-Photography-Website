import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ANTIGRAVITY // Luxury Creative Studio & Digital Art Atelier",
  description: "An immersive, ultra-premium portfolio showcasing high-end cinematography, haute horology brand architecture, and interactive antigravity visual design.",
  keywords: ["Cinematography", "Haute Couture", "Luxury Branding", "Antigravity", "Digital Art Atelier", "ARRI Alexa 35", "Framer Motion"],
  openGraph: {
    title: "ANTIGRAVITY // Luxury Creative Studio",
    description: "Immersive digital art gallery and cinematography portfolio with interactive physics.",
    type: "website",
    url: "https://antigravity.studio",
  },
  twitter: {
    card: "summary_large_image",
    title: "ANTIGRAVITY // Luxury Creative Studio",
    description: "Immersive digital art gallery and cinematography portfolio with interactive physics.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Inter:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#050505] text-[#EDEDED] antialiased selection:bg-[#FF0033] selection:text-white">
        {children}
      </body>
    </html>
  );
}
