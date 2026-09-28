import type { Metadata } from "next";
import { PrivacyPolicyPage } from "@/components/site/privacy-policy-page";

export const metadata: Metadata = { title: "Sturnus Flow" };

export default function Page() {
  return <PrivacyPolicyPage />;
}
