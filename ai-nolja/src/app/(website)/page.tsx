import Image from "next/image";
import { HeroSection } from "../../components/home/hero-section";
import { UtilitySection } from "../../components/home/utility-section";
import { sanityFetch } from "../../sanity/lib/fetch";
import { HERO_QUERY } from "../../sanity/lib/queries";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const heroData = await sanityFetch({ query: HERO_QUERY });

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection data={heroData} />
      <UtilitySection />
      {/* Placeholder for Recent Content */}
      <section className="py-24">
        <div className="container px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Latest Insights</h2>
          <p className="text-muted-foreground">콘텐츠 준비 중입니다.</p>
        </div>
      </section>
    </div>
  );
}
