import HeroSection from "../components/HeroSection";
import FeatureSection from "../components/FeatureSection";
import CTASection from "../components/CTASection";
import { useScrollReveal } from "../hooks/useScrollReveal";

export default function Home() {
    useScrollReveal();
    return (
        <>
            <HeroSection />
            <FeatureSection />
            <CTASection />
        </>
    );
}