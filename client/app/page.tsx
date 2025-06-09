import Landing from "@/components/landing";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="mt-30">
        <Landing />
      </main>
    </>
  );
}
