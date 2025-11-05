import MainHeader from "@/components/main-header";
import NavBar from "@/components/navigation/nav-bar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col w-full min-h-screen overflow-x-hidden overflow-y-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
      <MainHeader />
      <NavBar />
      <main className="w-full flex flex-col grow py-8">
        {children}
      </main>
    </div>
  );
}
