export const getProjects = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                data: {
                    data: [
                        {
                            id: 1,
                            title: "DevLog - 개발자 전문 로그 서비스",
                            description: "개발자의 성장을 돕는 마크다운 기반 개발 일지 플랫폼입니다.",
                            demo_url: "https://your-demo-site.com",
                            github_url: "https://github.com/pipakmj/DevLog-frontend",
                            tech_stack: "React,SpringBoot,MySQL",
                            created_at: "2024-03-30",
                            thumbnail: "https://via.placeholder.com/400x250/121212/3b82f6?text=DevLog"
                        },
                        {
                            id: 2,
                            title: "DevLog - 개발자 전문 로그 서비스",
                            description: "개발자의 성장을 돕는 마크다운 기반 개발 일지 플랫폼입니다.",
                            demo_url: "https://your-demo-site.com",
                            github_url: "https://github.com/pipakmj/DevLog-backend",
                            tech_stack: "React,SpringBoot,MySQL",
                            created_at: "2024-03-30",
                            thumbnail: "https://via.placeholder.com/400x250/121212/3b82f6?text=DevLog"
                        },
                        {
                            id: 3,
                            title: "DevLog - 개발자 전문 로그 서비스",
                            description: "개발자의 성장을 돕는 마크다운 기반 개발 일지 플랫폼입니다.",
                            demo_url: "",
                            github_url: "https://github.com/yourname/devlog",
                            tech_stack: "React,SpringBoot,MySQL",
                            created_at: "2024-03-30",
                            thumbnail: "https://via.placeholder.com/400x250/121212/3b82f6?text=DevLog"
                        },
                    ]
                }
            });
        }, 500);
    });
};