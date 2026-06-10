import { useEffect, useState, useContext } from 'react';
import { fetchGitHubTrending, fetchHackerNews, fetchDevToArticles } from '../api/trendApi';
import { getBookmarks, addBookmark, removeBookmark } from '../api/bookmarkApi';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/TechTrends.css';

const TABS = [
    { id: 'github', label: 'GitHub Trending', icon: '🔥' },
    { id: 'hackernews', label: 'Hacker News', icon: '📰' },
    { id: 'devto', label: 'Dev.to', icon: '✍️' },
    { id: 'bookmarks', label: 'My Bookmarks', icon: '⭐' }
];

const LANGUAGES = [
    { value: '', label: 'All Languages' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'c++', label: 'C++' }
];

const PERIODS = [
    { value: 'day', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' }
];

const HN_CATEGORIES = [
    { value: 'top', label: 'Top' },
    { value: 'new', label: 'New' },
    { value: 'best', label: 'Best' },
    { value: 'ask', label: 'Ask' },
    { value: 'show', label: 'Show' }
];

const DEVTO_TAGS = [
    { value: '', label: 'Weekly Top' },
    { value: 'react', label: 'React' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'webdev', label: 'WebDev' },
    { value: 'beginners', label: 'Beginners' },
    { value: 'python', label: 'Python' },
    { value: 'node', label: 'Node.js' }
];

// 숫자를 축약 형태로 표시 (1200 → 1.2k)
const formatNumber = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num;
};

// 시간 경과 표시 (2시간 전, 3일 전 등)
const timeAgo = (dateStr) => {
    const now = new Date();
    const past = new Date(dateStr);
    const diffMs = now - past;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffDay > 0) return `${diffDay}일 전`;
    if (diffHour > 0) return `${diffHour}시간 전`;
    if (diffMin > 0) return `${diffMin}분 전`;
    return '방금 전';
};

// 언어별 색상 맵핑 (GitHub 스타일)
const langColor = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Python: '#3572A5',
    Java: '#b07219',
    Go: '#00ADD8',
    Rust: '#dea584',
    'C++': '#f34b7d',
    Swift: '#F05138',
    Kotlin: '#A97BFF',
    Unknown: '#8b949e'
};

export default function TechTrends() {
    const { isLoggedIn } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('github');
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [toast, setToast] = useState({ show: false, message: '', type: 'add' });
    const [error, setError] = useState(null);

    // 필터 상태
    const [language, setLanguage] = useState('');
    const [period, setPeriod] = useState('week');
    const [hnCategory, setHnCategory] = useState('top');
    const [devtoTag, setDevtoTag] = useState('');

    // 데이터 캐싱
    const [githubData, setGithubData] = useState(null);
    const [hnData, setHnData] = useState(null);
    const [devtoData, setDevtoData] = useState(null);
    const [bookmarks, setBookmarks] = useState([]);

    // 북마크 초기 로드 및 로그인 상태 변경 시 데이터 동기화
    useEffect(() => {
        if (isLoggedIn) {
            fetchData('bookmarks');
        } else {
            setBookmarks([]);
        }
    }, [isLoggedIn]);

    const showToast = (message, type = 'add') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 2000);
    };

    const fetchData = async (tab) => {
        setIsLoading(true);
        setError(null);

        try {
            if (tab === 'bookmarks') {
                if (!isLoggedIn) {
                    setIsLoading(false);
                    return;
                }
                const data = await getBookmarks();
                setBookmarks(data || []);
                setIsLoading(false);
                return;
            }

            switch (tab) {
                case 'github': {
                    const repos = await fetchGitHubTrending(language, period);
                    setGithubData(repos);
                    break;
                }
                case 'hackernews': {
                    const stories = await fetchHackerNews(hnCategory);
                    setHnData(stories);
                    break;
                }
                case 'devto': {
                    const articles = await fetchDevToArticles(devtoTag);
                    setDevtoData(articles);
                    break;
                }
            }
            setLastUpdated(new Date());
        } catch (err) {
            console.error('데이터 로딩 실패:', err);
            setError(err.message || '데이터를 불러오는 중 오류가 발생했습니다.');
            showToast(err.message || '로딩 실패', 'remove');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData(activeTab);
    }, [activeTab, language, period, hnCategory, devtoTag]);

    const handleRefresh = () => {
        fetchData(activeTab);
        showToast('최신 데이터를 불러왔습니다!', 'info');
    };

    const findBookmark = (type, originId) => {
        return (bookmarks || []).find(b => {
            const target = b.item || b;
            const targetId = String(target.originId || target.id);
            return target.type === type && targetId === String(originId);
        });
    };

    const isBookmarked = (type, originId) => !!findBookmark(type, originId);

    const toggleBookmark = async (e, item) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isLoggedIn) {
            showToast('로그인이 필요한 서비스입니다.', 'info');
            return;
        }

        const existingBookmark = findBookmark(item.type, String(item.id));

        try {
            if (existingBookmark) {
                // 서버 PK(_dbId) 사용, 없으면 데이터 구조에 따라 id 사용
                const deleteId = existingBookmark._dbId || existingBookmark.id;
                await removeBookmark(deleteId);
                setBookmarks(prev => prev.filter(b => (b._dbId || b.id) !== deleteId));
                showToast('북마크에서 삭제되었습니다.', 'remove');
            } else {
                const savedData = await addBookmark(item);
                setBookmarks(prev => [...prev, savedData]);
                showToast('북마크에 추가되었습니다!', 'add');
            }
        } catch (err) {
            console.error('Bookmark error:', err);
            showToast('처리 중 오류가 발생했습니다.', 'remove');
        }
    };

    const getFilteredData = () => {
        let sourceData = [];
        if (activeTab === 'github') sourceData = githubData || [];
        else if (activeTab === 'hackernews') sourceData = hnData || [];
        else if (activeTab === 'devto') sourceData = devtoData || [];
        else if (activeTab === 'bookmarks') sourceData = bookmarks;

        if (!searchTerm) return sourceData;

        const term = searchTerm.toLowerCase();
        return sourceData.filter(item => {
            const title = item.name || item.title || "";
            const desc = item.description || "";
            return title.toLowerCase().includes(term) || desc.toLowerCase().includes(term);
        });
    };

    const currentData = getFilteredData();

    // ─── Unified Render Helpers ───────────────────────────

    const renderCardActionOverlay = (item) => (
        <div className="card-overlay">
            <div className="overlay-content">
                <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="overlay-btn visit"
                    title="원본 사이트 방문"
                    onClick={(e) => e.stopPropagation()}
                >
                    🔗
                </a>
                <button
                    className={`overlay-btn bookmark ${isBookmarked(item.type, String(item.id)) ? 'active' : ''}`}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleBookmark(e, item);
                    }}
                    title="북마크 토글"
                >
                    ⭐
                </button>
            </div>
        </div>
    );

    const renderGithubCard = (repo, index) => (
        <div key={repo.id} className="trend-card github-card" style={{ animationDelay: `${index * 0.05}s` }}>
            <div className="card-image-wrap github-bg">
                <div className={`source-badge github`}>GitHub</div>
                {renderCardActionOverlay(repo)}
                <div className="card-rank">#{index + 1}</div>
                <img src={repo.owner.avatar} alt={repo.owner.name} className="github-avatar-large" />
            </div>

            <a href={repo.url} target="_blank" rel="noreferrer" className="card-body">
                <div className="repo-name">
                    <span className="owner-name">{repo.owner.name}</span>
                    <span className="slash">/</span>
                    <span className="name">{repo.name.split('/')[1] || repo.name}</span>
                </div>
                <p className="card-desc">{repo.description}</p>
                <div className="card-meta">
                    <span className="meta-item lang">
                        <span className="lang-dot" style={{ background: langColor[repo.language] || '#8b949e' }} />
                        {repo.language}
                    </span>
                    <span className="meta-item">⭐ {formatNumber(repo.stars)}</span>
                </div>
            </a>
        </div>
    );

    const renderHNCard = (story, index) => (
        <div key={story.id} className="trend-card hn-card" style={{ animationDelay: `${index * 0.03}s` }}>
            <div className="card-image-wrap hn-bg">
                <div className={`source-badge hackernews`}>HN</div>
                {renderCardActionOverlay(story)}
                <div className="hn-score-badge">+{story.score}</div>
                <div className="hn-logo-box-large">Y</div>
                <div className="hn-bg-pattern"></div>
            </div>

            <div className="card-body">
                <a href={story.url} target="_blank" rel="noreferrer" className="hn-title">{story.title}</a>
                <div className="hn-author-text">by <strong>{story.author}</strong></div>
                <div className="hn-meta">
                    <span>💬 {story.commentCount}</span>
                    <span>🕐 {timeAgo(story.time)}</span>
                </div>
                <a href={story.hnUrl} target="_blank" rel="noreferrer" className="hn-discuss-link">Join Discussion →</a>
            </div>
        </div>
    );

    const renderDevToCard = (article, index) => (
        <div key={article.id} className="trend-card devto-card" style={{ animationDelay: `${index * 0.05}s` }}>
            <div className="card-image-wrap">
                <div className={`source-badge devto`}>Dev.to</div>
                {renderCardActionOverlay(article)}
                {article.coverImage ? (
                    <img src={article.coverImage} alt={article.title} className="devto-cover-img" />
                ) : (
                    <div className="devto-placeholder-bg">
                        <span className="devto-icon-large">✍️</span>
                    </div>
                )}
            </div>

            <div className="card-body">
                <div className="devto-author">
                    <img src={article.author.avatar} alt={article.author.name} className="devto-avatar" />
                    <span>{article.author.name}</span>
                </div>
                <a href={article.url} target="_blank" rel="noreferrer" className="devto-title">{article.title}</a>
                <div className="devto-tags">
                    {article.tags.slice(0, 3).map(tag => <span key={tag} className="devto-tag">#{tag}</span>)}
                </div>
                <div className="devto-stats">
                    <span>❤️ {article.reactions}</span>
                    <span>💬 {article.comments}</span>
                </div>
            </div>
        </div>
    );

    const renderTrendContent = () => {
        const data = currentData;

        if (isLoading) {
            return (
                <div className="loading-container">
                    <LoadingSpinner />
                    <p>Trends를 불러오는 중...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="error-state">
                    <span className="error-icon">⚠️</span>
                    <h3>데이터 로드 실패</h3>
                    <p>{error}</p>
                    <button className="retry-btn" onClick={() => fetchData(activeTab)}>다시 시도</button>
                </div>
            );
        }

        if (data.length === 0) {
            return (
                <div className="empty-state">
                    <p>{searchTerm ? "검색 결과가 없습니다." : activeTab === 'bookmarks' ? "저장된 북마크가 없습니다." : "표시할 데이터가 없습니다."}</p>
                </div>
            );
        }

        return (
            <div className="trend-grid">
                {data.map((item, index) => {
                    if (item.type === 'github') return renderGithubCard(item, index);
                    if (item.type === 'hackernews') return renderHNCard(item, index);
                    if (item.type === 'devto') return renderDevToCard(item, index);
                    return (
                        <div key={index} className="trend-card unknown-card">
                            <h3>{item.title || 'Unknown Title'}</h3>
                            <p>Type: {item.type}</p>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="trends-container">
            <header className="trends-header">
                <div className="trends-badge">GLOBAL INSIGHT</div>
                <h1>Tech Trends</h1>
                <p>전 세계 개발 생태계의 실시간 흐름을 놓치지 마세요</p>
            </header>

            <div className="trends-tabs">
                <div className="tabs-inner">
                    {TABS.map(tab => (
                        <button key={tab.id} className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
                            <span className="tab-icon">{tab.icon}</span>
                            <span className="tab-label">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="trends-toolbar">
                <div className="toolbar-left">
                    <div className="search-bar">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="키워드 검색..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {activeTab === 'github' && (
                        <>
                            <select className="trend-select" value={language} onChange={(e) => setLanguage(e.target.value)}>
                                {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                            </select>
                            <select className="trend-select" value={period} onChange={(e) => setPeriod(e.target.value)}>
                                {PERIODS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                            </select>
                        </>
                    )}

                    {activeTab === 'hackernews' && (
                        <select className="trend-select" value={hnCategory} onChange={(e) => setHnCategory(e.target.value)}>
                            {HN_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label} News</option>)}
                        </select>
                    )}

                    {activeTab === 'devto' && (
                        <select className="trend-select" value={devtoTag} onChange={(e) => setDevtoTag(e.target.value)}>
                            {DEVTO_TAGS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                    )}
                </div>
                <div className="toolbar-right">
                    {lastUpdated && activeTab !== 'bookmarks' && (
                        <span className="last-updated">최근 업데이트: {lastUpdated.toLocaleTimeString()}</span>
                    )}
                    {activeTab !== 'bookmarks' && (
                        <button className="refresh-btn" onClick={handleRefresh} disabled={isLoading}>
                            <span className={`refresh-icon ${isLoading ? 'spinning' : ''}`}>↻</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="trends-content">
                {renderTrendContent()}
            </div>

            {/* Toast Notification */}
            <div className={`trends-toast ${toast.show ? 'show' : ''} ${toast.type}`}>
                <span className="toast-icon">
                    {toast.type === 'add' ? '✨' : toast.type === 'remove' ? '🗑️' : '🔔'}
                </span>
                <span className="toast-message">{toast.message}</span>
            </div>
        </div>
    );
}
