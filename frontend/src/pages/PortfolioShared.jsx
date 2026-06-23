import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSharedPortfolio } from '../api/portfolioApi';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/PortfolioShared.css';

const PortfolioShared = () => {
    const { shareToken } = useParams();
    const [portfolio, setPortfolio] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSharedData = async () => {
            try {
                const response = await getSharedPortfolio(shareToken);
                const data = response?.data?.data ?? response?.data;
                setPortfolio(data);
            } catch (err) {
                setError(err.response?.data?.message || '포트폴리오를 불러오지 못했거나 공유가 중단되었습니다.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchSharedData();
    }, [shareToken]);

    

    if (isLoading) return <div className="shared-loading-container"><LoadingSpinner /></div>;

    if (error) return (
        <div className="shared-error-container">
            <div className="error-card glass-panel">
                <span className="error-icon">⚠️</span>
                <h2>Shared Portfolio Not Found</h2>
                <p>{error}</p>
                <Link to="/" className="btn-home">홈으로 돌아가기</Link>
            </div>
        </div>
    );

    if (!portfolio) return null;

    const {
        projectName, overview, roles, techStack, projectPeriod, teamSize, primaryRole,
        features = [], troubleshoots = [], metrics, images = {}
    } = portfolio;

    const displayProjectName = projectName || '제목 없는 프로젝트';
    const displayOverview = overview || '본 프로젝트는 실무 전문성을 바탕으로 체계적으로 설계되었습니다.';

    return (
        <div className="portfolio-shared-page">
            <div className="shared-header-bg"></div>

            <div className="shared-container">
                <header className="shared-main-header">
                    <div className="project-badge">PORTFOLIO CASE STUDY</div>
                    <h1 className="shared-title">{displayProjectName}</h1>
                    <div className="shared-meta-grid">
                        <div className="meta-card">
                            <span className="meta-label">PERIOD</span>
                            <span className="meta-value">{projectPeriod || '기간 정보 없음'}</span>
                        </div>
                        <div className="meta-card">
                            <span className="meta-label">TEAM</span>
                            <span className="meta-value">{teamSize || '1인 개발 (Solo)'}</span>
                        </div>
                        <div className="meta-card">
                            <span className="meta-label">ROLE</span>
                            <span className="meta-value">{primaryRole || '핵심 개발자'}</span>
                        </div>
                    </div>
                </header>

                <div className="shared-content-layout">
                    {/* Left: Main Content */}
                    <div className="shared-main-content">
                        {/* Metrics Highlight - Moved higher for impact */}
                        {metrics && (
                            <section className="shared-section-block highlight-section">
                                <h2 className="section-title">Key Outcomes & Impact</h2>
                                <div className="content-box glass-panel metrics-box">
                                    <div className="impact-quote-icon">📊</div>
                                    <p className="section-text impact-text">{metrics}</p>
                                </div>
                            </section>
                        )}

                        <section className="shared-section-block">
                            <h2 className="section-title">Overview</h2>
                            <div className="content-box glass-panel">
                                <p className="section-text">{displayOverview}</p>
                            </div>
                        </section>

                        {roles && (
                            <section className="shared-section-block">
                                <h2 className="section-title">Responsibilities</h2>
                                <div className="content-box glass-panel">
                                    <pre className="section-text pre-wrap">{roles}</pre>
                                </div>
                            </section>
                        )}

                        {features.length > 0 && (
                            <section className="shared-section-block">
                                <h2 className="section-title">Key Features</h2>
                                <div className="features-grid">
                                    {features.map((f, i) => (
                                        <div key={i} className="feature-item-card glass-panel">
                                            <h3 className="item-subtitle">{f.title}</h3>
                                            <p className="item-text">{f.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {(images.architecture?.imageUrl || images.erd?.imageUrl) && (
                            <section className="shared-section-block">
                                <h2 className="section-title">Technical Design</h2>
                                <div className="visuals-container">
                                    {images.architecture?.imageUrl && (
                                        <div className="visual-block glass-panel">
                                            <div className="visual-header">System Architecture</div>
                                            <div className="visual-img">
                                                <img src={images.architecture.imageUrl} alt="System Architecture" />
                                            </div>
                                            {images.architecture.description && (
                                                <p className="visual-desc">{images.architecture.description}</p>
                                            )}
                                        </div>
                                    )}
                                    {images.erd?.imageUrl && (
                                        <div className="visual-block glass-panel">
                                            <div className="visual-header">Database ERD</div>
                                            <div className="visual-img">
                                                <img src={images.erd.imageUrl} alt="Database ERD" />
                                            </div>
                                            {images.erd.description && (
                                                <p className="visual-desc">{images.erd.description}</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        {images.ui?.length > 0 && (
                            <section className="shared-section-block">
                                <h2 className="section-title">User Interface</h2>
                                <div className="ui-showcase">
                                    {images.ui.map((img, idx) => (
                                        <div key={idx} className="ui-screen-card glass-panel">
                                            <div className="ui-screen-img">
                                                <img src={img.imageUrl} alt={`UI Screen ${idx + 1}`} />
                                            </div>
                                            {img.description && (
                                                <p className="ui-screen-desc">{img.description}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {troubleshoots.length > 0 && (
                            <section className="shared-section-block">
                                <h2 className="section-title">Troubleshooting</h2>
                                <div className="ts-list">
                                    {troubleshoots.map((t, i) => (
                                        <div key={i} className="ts-item glass-panel">
                                            <div className="ts-issue">
                                                <span className="ts-label">ISSUE</span>
                                                <p className="section-text">{t.issue}</p>
                                            </div>
                                            <div className="ts-divider"></div>
                                            <div className="ts-resolution">
                                                <span className="ts-label res">RESOLUTION</span>
                                                <p className="section-text">{t.resolution}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right: Sidebar Sticky Details */}
                    <aside className="shared-sidebar">
                        <div className="sidebar-sticky-panel glass-panel">
                            <h3 className="sidebar-heading">Tech Stack</h3>
                            <div className="tech-pills">
                                {Array.isArray(techStack) ? (
                                    techStack.map(t => <span key={t} className="tech-pill">{t}</span>)
                                ) : (
                                    Object.entries(techStack || {})
                                        .filter(([_, active]) => active)
                                        .map(([t]) => <span key={t} className="tech-pill">{t}</span>)
                                )}
                            </div>

                            <div className="sidebar-footer-info">
                                <p>Powered by <strong>DevLog</strong></p>
                                <p className="last-updated">
                                    Last updated: {portfolio.updatedAt ? new Date(portfolio.updatedAt).toLocaleDateString() : new Date().toLocaleDateString()}
                                </p>
                                <Link to="/" className="btn-create-my">포트폴리오 생성하기</Link>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            <footer className="shared-page-footer">
                <p>&copy; 2026 DevLog Portfolio. Documentation generated with AI analysis.</p>
            </footer>
        </div>
    );
};

export default PortfolioShared;
