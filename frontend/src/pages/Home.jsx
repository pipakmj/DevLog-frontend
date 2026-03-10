import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import FeatureSection from "../components/FeatureSection";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";

export default function Home() {
    return (
        <>
            <Navbar />
            <HeroSection />
            <FeatureSection />
            <CTASection />
            <Footer />
        </>
    );
}