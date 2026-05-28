import { createFileRoute } from "@tanstack/react-router";
import { HousizyAdminApp } from "@/components/housizy/HousizyAdminApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HOUSIZY Admin — Mission Control" },
      {
        name: "description",
        content:
          "Mobile mission control for the HOUSIZY B2B construction-materials platform — live ops, incident triage, orders, and vendor KYC.",
      },
      { property: "og:title", content: "HOUSIZY Admin — Mission Control" },
      {
        property: "og:description",
        content: "Dark-ops mobile console for operations leads.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center p-6">
      <div className="iphone-frame">
        <HousizyAdminApp />
      </div>
    </div>
  );
}
