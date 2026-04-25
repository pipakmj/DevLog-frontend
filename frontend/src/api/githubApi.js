export const getRepoCommits = async (owner, repo, page = 1) => {
    try {
        const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?page=${page}&per_page=10`);
        if (!res.ok) throw new Error("GIT HUB 데이터를 불러오지 못했습니다.");
        const data = await res.json();
        return data;
    } catch (error) {
        console.log("GIT Fetch Error:", error);
        return [];
    }
}

export const parseGithubUrl = (url) => {
    if (!url) return null;
    try {
        const parts = url.replace("https://github.com/", "").split("/");
        return {
            owner: parts[0],
            repo: parts[1]
        };
    } catch (e) {
        console.error("URL 파싱 오류:", e);
        return null;
    }
};