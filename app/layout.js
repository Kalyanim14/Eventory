import "./globals.css";

export const metadata = {
  title: "Eventory | Post a requirement",
  description: "Find the people who make your event happen.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
