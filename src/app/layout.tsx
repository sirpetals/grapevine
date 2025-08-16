import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Grapevine",
  description: "All your uni events in one place",
};

export default function RootLayout({ children }: { children : React.ReactNode }) {
  return (
    <html lang="en">
      <body className="h-screen w-screen flex flex-col justify-between">
        <div className="m-4">
          {children}
        </div>
        <div className="sticky bottom-0 bg-(--background)">
          <ul className="flex flex-row justify-around p-4 border-t-2 border-purple-700">
            <li><Link href={"/"}>Events</Link></li>
            <li><Link href={"/search"}>Search</Link></li>
            <li><Link href={"/profile"}>Profile</Link></li>
          </ul>
        </div>
      </body>
    </html>
  );
}
