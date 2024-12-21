import Header from "@/components/auth/common/header";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-svh secondary-gradient w-full border-4 border-red-500 flex flex-col justify-between items-center gap-8">
      <Header />

      {children}
    </div>
  );
}
