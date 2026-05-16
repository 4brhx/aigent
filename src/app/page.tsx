import dynamic from "next/dynamic";

// Force dynamic rendering - skip static generation entirely
export const revalidate = 0;
export const dynamic_route = "force-dynamic";

const AppShell = dynamic(() => import("@/components/layout/AppShell"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-black/20 border-t-black rounded-full animate-spin" />
    </div>
  ),
});

export default function Home() {
  return <AppShell />;
}
