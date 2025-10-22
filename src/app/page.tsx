import Hero from "@/components/Hero";
import Highlights from "@/components/Highlights";
import SignupForm from "@/components/SignupForm";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-10rem] h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-pink-500/30 via-fuchsia-400/25 to-purple-500/25 blur-[160px]" />
        <div className="absolute left-1/4 top-[40rem] h-[22rem] w-[22rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-emerald-400/30 via-sky-400/20 to-transparent blur-[140px]" />
        <div className="absolute right-0 top-1/3 h-[26rem] w-[26rem] translate-x-1/3 rounded-full bg-gradient-to-br from-purple-500/30 via-fuchsia-400/20 to-transparent blur-[160px]" />
        <div className="absolute inset-x-0 bottom-0 h-[40rem] bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-transparent" />
      </div>

      <Hero />
      <Highlights />
      <SignupForm />
      <Footer />
    </main>
  );
}
