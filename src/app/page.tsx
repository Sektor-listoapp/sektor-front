import Navbar from "@/components/ui/navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-blue-500 text-white">
      <Navbar />
      <main className="flex items-center justify-center">
        <h1 className="text-4xl sr-only">Hello, Sektor!</h1>
      </main>
    </div>
  );
}
