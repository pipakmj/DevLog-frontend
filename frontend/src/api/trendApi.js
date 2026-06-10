/**
 * Tech Trends API - 기술 트렌드 크롤링 모듈
 * 
 * 3개의 공개 API에서 실시간 기술 트렌드를 수집합니다.
 * - 에러 발생 시 빈 배열 대신 명시적인 Error를 throw하여 UI에서 대응할 수 있게 합니다.
 */

// ─── GitHub Trending ───────────────────────────────────
// GitHub 트렌딩 대신 Search API를 사용하여 인기 저장소 가져오기
export const fetchGitHubTrending = async (language = '', since = 'week') => {
    try {
        // 날짜 계산 (기본 일주일 전)
        const date = new Date();
        if (since === 'day') date.setDate(date.getDate() - 1);
        else if (since === 'month') date.setMonth(date.getMonth() - 1);
        else date.setDate(date.getDate() - 7); // week

        const dateStr = date.toISOString().split('T')[0];

        // 검색 쿼리 구성: 특정 날짜 이후 생성된 저장소 중 별점 높은 순
        let query = `created:>${dateStr}`;
        if (language) query += `+language:${language}`;

        const url = `https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc&per_page=20`;

        const res = await fetch(url, {
            headers: { 'Accept': 'application/vnd.github.v3+json' }
        });

        if (!res.ok) {
            if (res.status === 403) throw new Error("GitHub API 사용 제한에 도달했습니다. 잠시 후 다시 시도해 주세요.");
            throw new Error(`GitHub 데이터를 로드할 수 없습니다 (상태: ${res.status})`);
        }

        const data = await res.json();

        return data.items.map(repo => ({
            id: String(repo.id),
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
            }
        }));
    } catch (error) {
        console.error("GitHub Fetch Error:", error);
        throw error;
    }
};

// ─── Hacker News ───────────────────────────────────────
const fetchHNIds = async (category = 'top') => {
    const endpoint = category === 'day' ? 'top' : category; // 매핑 보정
    const res = await fetch(`https://hacker-news.firebaseio.com/v0/${endpoint}stories.json`);
    if (!res.ok) throw new Error("Hacker News ID 목록을 가져오는 데 실패했습니다.");
    return await res.json();
};

const fetchHNItem = async (id) => {
    const res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
    if (!res.ok) throw new Error(`HN 아이템(${id}) 정보를 가져오는 데 실패했습니다.`);
    return await res.json();
};

export const fetchHackerNews = async (category = 'top') => {
    try {
        const ids = await fetchHNIds(category);
        const topIds = ids.slice(0, 20);

        const stories = await Promise.all(
            topIds.map(async (id) => {
                const item = await fetchHNItem(id);
                if (!item) return null;
                return {
                    id: item.id,
                    type: 'hackernews',
                    title: item.title,
                    url: item.url || `https://news.ycombinator.com/item?id=${item.id}`,
                    score: item.score,
                    author: item.by,
                    commentCount: item.descendants || 0,
                    time: new Date(item.time * 1000).toISOString(),
                    hnUrl: `https://news.ycombinator.com/item?id=${item.id}`
                };
            })
        );
        return stories.filter(s => s !== null);
    } catch (error) {
        console.error("HN Fetch Error:", error);
        throw new Error("Hacker News 데이터를 구성하는 중 오류가 발생했습니다.");
    }
};

// ─── Dev.to Articles ───────────────────────────────────
export const fetchDevToArticles = async (tag = '') => {
    try {
        const query = tag ? `tag=${tag}` : 'top=7';
        const res = await fetch(`https://dev.to/api/articles?${query}`);

        if (!res.ok) {
            if (res.status === 429) {
                throw new Error("Dev.to API 요청 횟수가 초과되었습니다. 잠시 후 다시 시도해 주세요.");
            }
            throw new Error(`Dev.to 데이터를 로드할 수 없습니다 (상태 코드: ${res.status})`);
        }

        const data = await res.json();
        return data.map(item => ({
            id: item.id,
            type: 'devto',
            title: item.title,
            description: item.description,
            url: item.url,
            coverImage: item.cover_image,
            author: {
                name: item.user.name,
                avatar: item.user.profile_image_90
            },
            tags: item.tag_list,
            reactions: item.public_reactions_count,
            comments: item.comments_count,
            readingTime: item.reading_time_minutes,
            publishedAt: item.published_at
        }));
    } catch (error) {
        console.error("Dev.to Fetch Error:", error);
        throw error;
    }
};
