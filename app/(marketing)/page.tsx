
import Heading from "./_components/heading";
import Hero from "./_components/hero";
import Footer from "./_components/footer";


export default function MarketingPage() {
  return (
    <div className="min-h-full flex flex-col">
      <div className="flex flex-col items-center gap-y-8 flex-1
      justify-center md:justify-start text-center px-6 pb-10 ">
        <Heading />
        <Hero />
        <Footer />

      </div>

    </div>
  );
}
