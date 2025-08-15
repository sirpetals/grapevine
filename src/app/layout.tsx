import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Grapevine",
  description: "All your uni events in one place",
};

export default function RootLayout({ children }: { children : React.ReactNode }) {
  return (
    <html lang="en">
      <body className="max-h-screen flex flex-col justify-between">
        <div className="m-4">
          {children}
        </div>
        <div className="sticky bottom-0 bg-(--background)">
          <ul className="flex flex-row justify-around p-4 border-t-2 border-purple-500">
            <li>Events</li>
            <li>Search</li>
            <li>Profile</li>
          </ul>
        </div>
      </body>
    </html>
  );
}
