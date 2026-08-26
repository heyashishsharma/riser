import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brand Kit Settings",
  description: "Configure your creator profile and preferences.",
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
