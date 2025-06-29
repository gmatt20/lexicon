import Landing from "@/components/landing/landing";
import Navbar from "@/components/navbar";

export default async function Home() {
  // await new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve("delay");
  //   }, 5000);
  // });
  return (
    <>
      <Navbar />
      <main className="mt-30">
        <Landing />
      </main>
    </>
  );
}
