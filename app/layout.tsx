import "../styles/globals.css";
import Providers from "../app/providers";

export const metadata = {
  title: "Movie App",
  description: "Sample movie app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
