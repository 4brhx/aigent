import NextDynamic from "next/dynamic";

export const dynamic = "force-dynamic";

const AppShell = NextDynamic(() => import("@/components/layout/AppShell"), {
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
