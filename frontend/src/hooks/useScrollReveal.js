import { useEffect } from "react";

export function useScrollReveal() {
    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: "0px",
            threshold: 0.1,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("reveal");
                    // 한 번 나타나면 관찰 중지 (선택 사항)
                    // observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const elements = document.querySelectorAll(".feature-card, .cta");
        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);
}
