export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col w-full min-h-screen overflow-x-hidden overflow-y-auto">
      <main className="w-full flex flex-col min-h-screen grow bg-[#eee]">
        {children}
      </main>
    </div>
  );
}
