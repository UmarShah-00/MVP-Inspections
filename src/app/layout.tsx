import "../styles/globals.css";
import LayoutWrapper from "./LayoutWrapper";

export const metadata = {
  title: "MVP Inspection",
  description: "Manage categories and questions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
