import MainHeader from "@/components/main-header";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col w-full min-h-screen overflow-x-hidden overflow-y-auto">
      <MainHeader />
      <main className="w-full flex flex-col min-h-[calc(100vh-80px)] mt-20">
        {children}
      </main>
    </div>
  );
}
