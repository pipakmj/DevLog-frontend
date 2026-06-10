import axiosInstance from "./axiosInstance";

/**
 * 북마크 API 모듈
 */

// [공통 로직] 서버 응답 데이터를 프론트엔드 렌더링 규격에 맞게 정규화
const processBookmarkItem = (rawItem) => {
    if (!rawItem) return null;

    // 서버 응답 구조 (BookmarkEntity -> ItemEntity) 대응
    const trendItem = rawItem.item || rawItem.trendItem || rawItem.trenditem || rawItem;

    if (trendItem && trendItem.metadata) {
        try {
            // metadata(JSON 문자열) 파싱
            const parsed = typeof trendItem.metadata === 'string'
                ? JSON.parse(trendItem.metadata)
                : trendItem.metadata;

            return {
                ...parsed,
                _dbId: rawItem.id, // 삭제 시 사용할 서버 측 북마크 PK
                type: trendItem.type || parsed.type, // 플랫폼 타입 보장
                createdAt: rawItem.createdAt // 생성일자 정보 유지
            };
        } catch (e) {
            console.error("Metadata parsing error:", e);
            return { ...trendItem, _dbId: rawItem.id };
        }
    }
    return { ...rawItem, _dbId: rawItem.id };
};

// 모든 북마크 조회
export const getBookmarks = async () => {
    try {
        const res = await axiosInstance.get("/api/bookmarks");
        const list = res.data.data || [];
        return list.map(processBookmarkItem).filter(item => item !== null);
    } catch (error) {
        console.error("북마크 로드 실패:", error);
        return [];
    }
};

// 북마크 추가
export const addBookmark = async (item) => {
    try {
        // 백엔드의 BookmarkRequestDto 구조에 맞춰 매핑 (camelCase)
        const bookmarkData = {
            originId: String(item.id),
            type: item.type,
            title: item.name || item.title,
            url: item.url,
            thumbnailUrl: item.owner?.avatar || item.coverImage || "",
            metadata: JSON.stringify(item),
            viewCount: 0,
            bookmarkCount: 1
        };

        const res = await axiosInstance.post("/api/bookmarks", bookmarkData);
        // 서버 응답 직후 정규화 처리하여 반환 (상태 동기화용)
        return processBookmarkItem(res.data.data);
    } catch (error) {
        console.error("북마크 추가 실패:", error);
        throw error;
    }
};

// 북마크 삭제 (DB 고유 PK 기반)
export const removeBookmark = async (dbId) => {
    try {
        const res = await axiosInstance.delete(`/api/bookmarks/${dbId}`);
        return res.data.data;
    } catch (error) {
        console.error("북마크 삭제 실패:", error);
        throw error;
    }
};
