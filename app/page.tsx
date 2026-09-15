import Academics from "@/components/Academics";
import Admissions from "@/components/Admissions";
import Footer from "@/components/Footer";
import Gallery from "@/components/Gallery";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import WhyUs from "@/components/WhyUs";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <Hero />
      <WhyUs />
      <Academics />
      <Admissions />
      <Gallery />
      <Footer />
      <main className="flex-1" />
    </div>
  );
}
