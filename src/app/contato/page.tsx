import type { Metadata } from "next";
import { ContactPage } from "@/components/site/contact-page";

export const metadata: Metadata = { title: "Sturnus Flow" };

export default function Page() {
  return <ContactPage />;
}
