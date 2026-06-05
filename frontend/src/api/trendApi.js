/**
 * Tech Trends API - 기술 트렌드 크롤링 모듈
 * 
 * 3개의 공개 API에서 실시간 기술 트렌드를 수집합니다.
 * - GitHub: Search API (이번 주 인기 레포지토리)
 * - Hacker News: Firebase API (실시간 인기 기술 뉴스)
 * - Dev.to: Public API (주간 인기 개발 블로그)
 */

// ─── GitHub Trending ───────────────────────────────────
export const fetchGitHubTrending = async (language = "", period = "week", perPage = 20) => {
    const date = new Date();
    if (period === "day") date.setDate(date.getDate() - 1);
    else if (period === "month") date.setMonth(date.getMonth() - 1);
    else date.setDate(date.getDate() - 7); // week is default

    const dateStr = date.toISOString().split("T")[0];

    let query = `created:>${dateStr}`;
    if (language) {
        query += `+language:${encodeURIComponent(language)}`;
    }

    const url = `https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc&per_page=${perPage}`;

    try {
        const res = await fetch(url, {
            headers: { "Accept": "application/vnd.github.v3+json" }
        });
        if (!res.ok) throw new Error(`GitHub API Error: ${res.status}`);
        const data = await res.json();
        return data.items.map(repo => ({
            id: repo.id,
            type: 'github',
            name: repo.full_name,
            description: repo.description || "설명 없음",
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            language: repo.language || "Unknown",
            url: repo.html_url,
            owner: {
                name: repo.owner.login,
                avatar: repo.owner.avatar_url
            },
            createdAt: repo.created_at
        }));
    } catch (error) {
        console.error("GitHub 트렌드 크롤링 실패:", error);
        return [];
    }
};

// ─── Hacker News ───────────────────────────────────────
export const fetchHackerNews = async (category = "top", count = 20) => {
    try {
        const endpointMap = {
            top: "topstories",
            new: "newstories",
            best: "beststories",
            ask: "askstories",
            show: "showstories"
        };
        const endpoint = endpointMap[category] || "topstories";

        const idsRes = await fetch(`https://hacker-news.firebaseio.com/v0/${endpoint}.json`);
        if (!idsRes.ok) throw new Error("HN IDs fetch failed");
        const allIds = await idsRes.json();

        const topIds = allIds.slice(0, count);
        const storyPromises = topIds.map(id =>
            fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
                .then(res => res.json())
        );

        const stories = await Promise.all(storyPromises);

        return stories
            .filter(story => story && story.type === "story" && story.url)
            .map(story => ({
                id: story.id,
                type: 'hackernews',
                title: story.title,
                url: story.url,
                score: story.score,
                author: story.by,
                commentCount: story.descendants || 0,
                time: new Date(story.time * 1000).toISOString(),
                hnUrl: `https://news.ycombinator.com/item?id=${story.id}`
            }));
    } catch (error) {
        console.error("Hacker News 크롤링 실패:", error);
        return [];
    }
};

// ─── Dev.to Articles ───────────────────────────────────
export const fetchDevToArticles = async (tag = "", perPage = 20) => {
    try {
        let url = `https://dev.to/api/articles?per_page=${perPage}`;
        if (tag) {
            url += `&tag=${encodeURIComponent(tag)}`;
        } else {
            url += `&top=7`; // 주간 인기
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Dev.to API Error: ${res.status}`);

        const articles = await res.json();

        return articles.map(article => ({
            id: article.id,
            type: 'devto',
            title: article.title,
            description: article.description || "",
            url: article.url,
            coverImage: article.cover_image || article.social_image,
            author: {
                name: article.user.name,
                avatar: article.user.profile_image_90
            },
            tags: article.tag_list,
            reactions: article.positive_reactions_count,
            comments: article.comments_count,
            readingTime: article.reading_time_minutes,
            publishedAt: article.published_at
        }));
    } catch (error) {
        console.error("Dev.to 크롤링 실패:", error);
        return [];
    }
};
