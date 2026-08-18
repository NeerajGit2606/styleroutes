import type { Metadata } from "next";
import { AccountView } from "@/components/AccountView";

export const metadata: Metadata = {
  title: "My Account — StyleRoute",
};

export default function AccountPage() {
  return <AccountView />;
}
