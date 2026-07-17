import AIFeatures from "@/components/AIFeatures";
import CareerBlogs from "@/components/CareerBlogs";
import FAQ from "@/components/FAQ";
import FeaturedJobs from "@/components/FeaturedJobs";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import Newsletter from "@/components/Newsletter";
import SuccessStats from "@/components/SuccessStats";
import Testimonials from "@/components/Testimonials";
import TopCompanies from "@/components/TopCompanies";


export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedJobs />
      <AIFeatures></AIFeatures>
      <HowItWorks />
      <TopCompanies />
      <SuccessStats />
      <Testimonials />
      <CareerBlogs/>
      <FAQ />
      <Newsletter />
    </>
  )
}