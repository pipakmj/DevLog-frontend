import React, { useEffect, useState } from 'react';
import '../styles/PortfolioBuilder.css';

const MOCK_PROJECTS = [
    {
        id: 'devlog',
        name: 'DevLog',
        overview: 'DevLog는 개발자의 학습 기록과 프로젝트 관리를 돕는 플랫폼입니다.\n매일 배운 내용을 기록하고, 이를 바탕으로 포트폴리오를 작성할 수 있습니다.',
        roles: '기획 100%\n프론트엔드 100%\n백엔드 100%',
        techStack: { React: true, 'Spring Boot': true, MySQL: true, Docker: true, AWS: false, Redis: true },
        features: [
            { title: 'AI 피드백 로직 적용', description: '사용자가 작성한 포트폴리오를 분석해 완성도 점수와 개선점을 제공합니다.' },
            { title: 'PDF 미리보기', description: '작성한 내용을 PDF 형태의 문서 레이아웃으로 미리 확인할 수 있습니다.' }
        ],
        troubleshoots: [
            { issue: 'PDF 변환 시 이미지가 잘리는 현상 발생', resolution: '이미지 컨테이너의 크기와 object-fit 속성을 조정해 레이아웃 깨짐을 방지했습니다.' }
        ],
        metrics: '',
        images: {
            architecture: {
                src: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
                description: 'React 클라이언트, Spring Boot API 서버, MySQL 데이터베이스로 구성된 기본 3-tier 구조입니다.'
            },
            erd: {
                src: null,
                description: ''
            },
            ui: [
                {
                    src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
                    description: '대시보드에서 프로젝트별 학습 기록과 포트폴리오 작성 상태를 확인할 수 있습니다.'
                }
            ]
        },
        feedback: {
            suggestions: [
                '트러블슈팅 항목에 구체적인 성능 측정 지표를 넣으면 전문성이 더 잘 드러납니다.',
                '성과/지표 영역에 사용자 피드백이나 배운 점을 간략히 적어주세요.'
            ]
        }
    },
    {
        id: 'tech-trends',
        name: 'Tech Trends Dashboard',
        overview: '최신 IT 기술 동향을 한눈에 확인할 수 있는 대시보드입니다.',
        roles: '프론트엔드 100%\nUI/UX 디자인 100%',
        techStack: { React: true, 'Spring Boot': false, MySQL: false, Docker: false, AWS: false, 'Tailwind CSS': true },
        features: [
            { title: '트렌드 스크래핑 파이프라인', description: '주요 기술 커뮤니티의 RSS와 API를 주기적으로 수집합니다.' }
        ],
        troubleshoots: [],
        metrics: 'API 응답 속도 측정을 통해 병목 구간을 발견하고 캐싱을 적용해 응답 속도를 200ms 이하로 줄였습니다.',
        images: {
            architecture: { src: null, description: '' },
            erd: { src: null, description: '' },
            ui: []
        },
        feedback: {
            suggestions: [
                '필수 항목인 트러블슈팅이 작성되지 않았습니다. 구현 중 겪은 작은 문제라도 기록해보세요.',
                '아키텍처 이미지를 첨부하면 설계 역량을 더 쉽게 보여줄 수 있습니다.'
            ]
        }
    }
];

const REQUIRED_SECTIONS = [
    { key: 'overview', label: '프로젝트 개요' },
    { key: 'roles', label: '담당 역할' },
    { key: 'tech', label: '기술 스택' },
    { key: 'features', label: '주요 기능' },
    { key: 'troubleshoots', label: '트러블슈팅' },
    { key: 'metrics', label: '성과/지표' }
];

const createImageItem = (src = null, description = '') => ({ src, description });

const PortfolioBuilder = () => {
    const [selectedProjectId, setSelectedProjectId] = useState(MOCK_PROJECTS[0].id);
    const [projectName, setProjectName] = useState('');
    const [overview, setOverview] = useState('');
    const [roles, setRoles] = useState('');
    const [techStack, setTechStack] = useState({});
    const [metrics, setMetrics] = useState('');
    const [features, setFeatures] = useState([]);
    const [troubleshoots, setTroubleshoots] = useState([]);
    const [architectureImg, setArchitectureImg] = useState(createImageItem());
    const [erdImg, setErdImg] = useState(createImageItem());
    const [uiImgs, setUiImgs] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    useEffect(() => {
        const project = MOCK_PROJECTS.find((item) => item.id === selectedProjectId);
        if (!project) return;

        setProjectName(project.name);
        setOverview(project.overview);
        setRoles(project.roles);
        setTechStack(project.techStack);
        setMetrics(project.metrics || '');
        setFeatures(JSON.parse(JSON.stringify(project.features || [])));
        setTroubleshoots(JSON.parse(JSON.stringify(project.troubleshoots || [])));
        setArchitectureImg(createImageItem(project.images?.architecture?.src || null, project.images?.architecture?.description || ''));
        setErdImg(createImageItem(project.images?.erd?.src || null, project.images?.erd?.description || ''));
        setUiImgs((project.images?.ui || []).map((item) => createImageItem(item.src, item.description || '')));
        setSuggestions(project.feedback?.suggestions || []);
    }, [selectedProjectId]);

    const checkCompletion = () => {
        const missing = [];
        if (!overview.trim()) missing.push('overview');
        if (!roles.trim()) missing.push('roles');
        if (!Object.values(techStack).some(Boolean)) missing.push('tech');
        if (features.length === 0 || !features[0].title.trim()) missing.push('features');
        if (troubleshoots.length === 0 || !troubleshoots[0].issue.trim()) missing.push('troubleshoots');
        if (!metrics.trim()) missing.push('metrics');
        return missing;
    };

    const missingKeys = checkCompletion();
    const isReadyForPreview = missingKeys.length === 0;

    const toggleTech = (tech) => setTechStack((prev) => ({ ...prev, [tech]: !prev[tech] }));

    const handleAddFeature = () => setFeatures((prev) => [...prev, { title: '', description: '' }]);
    const handleRemoveFeature = (idx) => setFeatures((prev) => prev.filter((_, i) => i !== idx));
    const handleUpdateFeature = (idx, field, value) => {
        setFeatures((prev) => prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item)));
    };

    const handleAddTroubleshoot = () => setTroubleshoots((prev) => [...prev, { issue: '', resolution: '' }]);
    const handleRemoveTroubleshoot = (idx) => setTroubleshoots((prev) => prev.filter((_, i) => i !== idx));
    const handleUpdateTroubleshoot = (idx, field, value) => {
        setTroubleshoots((prev) => prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item)));
    };

    const handleSingleImageUpload = (setter) => (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setter((prev) => ({ ...prev, src: URL.createObjectURL(file) }));
        e.target.value = null;
    };

    const handleMultipleImageUpload = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            const fileItems = files.map((file) => createImageItem(URL.createObjectURL(file)));
            setUiImgs((prev) => [...prev, ...fileItems]);
        }
        e.target.value = null;
    };

    const handleUpdateUiImageDescription = (idx, description) => {
        setUiImgs((prev) => prev.map((item, i) => (i === idx ? { ...item, description } : item)));
    };

    const handleGenerateAIDraft = () => {
        setIsGenerating(true);
        setTimeout(() => {
            if (!metrics.trim()) {
                setMetrics('기능 개선 이후 렌더링 성능이 30% 향상되었고, 사용자 체감 속도를 개선했습니다.');
            }
            if (troubleshoots.length === 0) {
                setTroubleshoots([
                    {
                        issue: '배포 후 초기 로드 속도 저하 발생',
                        resolution: '코드 스플리팅을 적용해 번들 크기를 줄이고 초기 로딩 시간을 개선했습니다.'
                    }
                ]);
            }
            setSuggestions([
                '자동 보완 완료: 누락된 성과/지표와 트러블슈팅 예시를 채웠습니다.',
                '시각 자료에는 구조, 데이터 관계, 화면 목적이 드러나도록 설명을 함께 작성하면 좋습니다.'
            ]);
            setIsGenerating(false);
        }, 1500);
    };

    const handleActionItem = (action) => {
        alert(`${action} 처리되었습니다.`);
    };

    const handleGeneratePDF = () => {
        alert('PDF 다운로드 API 호출');
    };

    const handlePreviewRequest = () => {
        if (!isReadyForPreview) {
            const shouldContinue = window.confirm('필수 항목이 누락되어 있습니다. 그래도 미리보기를 진행하시겠습니까?');
            if (!shouldContinue) return;
        }
        setIsPreviewOpen(true);
    };

    const renderSingleImageUploadArea = (label, imageItem, setImageItem, descriptionPlaceholder) => (
        <div className="form-group image-upload-group">
            <label className="section-label">
                {label} <span className="optional-mark">(선택)</span>
            </label>
            <div className={`upload-area ${imageItem.src ? 'has-image' : ''}`}>
                {imageItem.src ? (
                    <div className="image-preview">
                        <img src={imageItem.src} alt={label} />
                        <button className="btn-remove-image" type="button" onClick={() => setImageItem((prev) => ({ ...prev, src: null }))}>
                            &times;
                        </button>
                    </div>
                ) : (
                    <label className="upload-placeholder">
                        <span className="upload-icon">+</span>
                        <span className="upload-text">클릭하여 업로드</span>
                        <input type="file" accept="image/*" onChange={handleSingleImageUpload(setImageItem)} style={{ display: 'none' }} />
                    </label>
                )}
            </div>
            <textarea
                className="form-textarea image-description-input"
                rows={3}
                value={imageItem.description}
                onChange={(e) => setImageItem((prev) => ({ ...prev, description: e.target.value }))}
                placeholder={descriptionPlaceholder}
            />
        </div>
    );

    return (
        <div className="portfolio-builder-wrapper">
            <div className="portfolio-builder-container">
                <main className="portfolio-main glass-panel">
                    <header className="portfolio-header">
                        <h2>
                            포트폴리오 빌더 <span className="badge-beta">Beta</span>
                        </h2>
                        <p className="header-subtitle">등록된 프로젝트 내용을 보완하고 AI 진단을 거쳐 완성형 PDF를 만들어보세요.</p>
                    </header>

                    <section className="portfolio-form">
                        <div className="form-group">
                            <label className="section-label">1. 프로젝트 선택</label>
                            <div className="select-wrapper">
                                <select value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)} className="project-select">
                                    {MOCK_PROJECTS.map((project) => (
                                        <option key={project.id} value={project.id}>
                                            {project.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-divider" />

                        <div className="form-group">
                            <label className="section-label">
                                프로젝트 개요 <span className="required-mark">*</span>
                            </label>
                            <textarea value={overview} onChange={(e) => setOverview(e.target.value)} rows={5} className="form-textarea" placeholder="프로젝트의 목적, 대상 사용자, 핵심 가치를 작성하세요." />
                        </div>

                        <div className="form-group">
                            <label className="section-label">
                                담당 역할 <span className="required-mark">*</span>
                            </label>
                            <textarea value={roles} onChange={(e) => setRoles(e.target.value)} rows={3} className="form-textarea" placeholder="예: 기획 100%, 프론트엔드 100%" />
                        </div>

                        <div className="form-group">
                            <label className="section-label">
                                기술 스택 <span className="required-mark">*</span>
                            </label>
                            <div className="tech-checkboxes">
                                {Object.entries(techStack).map(([tech, isChecked]) => (
                                    <label key={tech} className={`tech-label ${isChecked ? 'active' : ''}`}>
                                        <input type="checkbox" checked={isChecked} onChange={() => toggleTech(tech)} />
                                        <span className="tech-name">{tech}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="form-divider" />

                        <div className="form-group">
                            <label className="section-label">
                                주요 기능 <span className="required-mark">*</span>
                            </label>
                            <div className="dynamic-list-container">
                                {features.map((feature, idx) => (
                                    <div key={idx} className="dynamic-item-card">
                                        <button className="btn-remove-dynamic" type="button" onClick={() => handleRemoveFeature(idx)}>
                                            삭제
                                        </button>
                                        <input className="form-input-text" placeholder="기능명" value={feature.title} onChange={(e) => handleUpdateFeature(idx, 'title', e.target.value)} />
                                        <textarea className="form-textarea" rows={2} placeholder="상세 설명" value={feature.description} onChange={(e) => handleUpdateFeature(idx, 'description', e.target.value)} />
                                    </div>
                                ))}
                                <button className="btn-add-dynamic" type="button" onClick={handleAddFeature}>
                                    + 주요 기능 추가
                                </button>
                            </div>
                        </div>

                        <div className="form-group" style={{ marginTop: '32px' }}>
                            <label className="section-label">
                                트러블슈팅 / 문제 해결 <span className="required-mark">*</span>
                            </label>
                            <div className="dynamic-list-container">
                                {troubleshoots.map((item, idx) => (
                                    <div key={idx} className="dynamic-item-card troubleshoot-card">
                                        <button className="btn-remove-dynamic" type="button" onClick={() => handleRemoveTroubleshoot(idx)}>
                                            삭제
                                        </button>
                                        <textarea className="form-textarea issue-area" rows={2} placeholder="발생한 문제" value={item.issue} onChange={(e) => handleUpdateTroubleshoot(idx, 'issue', e.target.value)} />
                                        <textarea className="form-textarea resolution-area" rows={3} placeholder="해결 방법과 결과" value={item.resolution} onChange={(e) => handleUpdateTroubleshoot(idx, 'resolution', e.target.value)} />
                                    </div>
                                ))}
                                <button className="btn-add-dynamic" type="button" onClick={handleAddTroubleshoot}>
                                    + 트러블슈팅 추가
                                </button>
                            </div>
                        </div>

                        <div className="form-group" style={{ marginTop: '32px' }}>
                            <label className="section-label">
                                성과 및 지표 <span className="required-mark">*</span>
                            </label>
                            <textarea value={metrics} onChange={(e) => setMetrics(e.target.value)} rows={3} className="form-textarea" placeholder="성능 개선 수치, 사용자 피드백, 배운 점 등을 작성하세요." />
                        </div>

                        <div className="form-divider" />

                        <div className="visuals-section">
                            <h3 className="sub-heading">
                                시각 자료 첨부 <span className="optional-mark">(모두 선택 항목)</span>
                            </h3>
                            <div className="visuals-grid">
                                {renderSingleImageUploadArea('시스템 아키텍처', architectureImg, setArchitectureImg, '시스템 구성, 서버/클라이언트/API/DB 흐름, 외부 연동 구조를 설명하세요.')}
                                {renderSingleImageUploadArea('데이터베이스 ERD', erdImg, setErdImg, '주요 테이블 관계, 핵심 엔티티, 설계 의도를 설명하세요.')}
                            </div>

                            <div className="form-group image-upload-group full-width-group" style={{ marginTop: '24px' }}>
                                <label className="section-label">
                                    주요 UI 화면 <span className="optional-mark">(다중 첨부 가능)</span>
                                </label>
                                <div className="multiple-upload-grid">
                                    {uiImgs.map((imageItem, idx) => (
                                        <div key={idx} className="ui-image-editor">
                                            <div className="upload-area has-image">
                                                <div className="image-preview">
                                                    <img src={imageItem.src} alt={`UI 화면 ${idx + 1}`} />
                                                    <button className="btn-remove-image" type="button" onClick={() => setUiImgs((prev) => prev.filter((_, i) => i !== idx))}>
                                                        &times;
                                                    </button>
                                                </div>
                                            </div>
                                            <textarea
                                                className="form-textarea image-description-input"
                                                rows={3}
                                                value={imageItem.description}
                                                onChange={(e) => handleUpdateUiImageDescription(idx, e.target.value)}
                                                placeholder={`UI 화면 ${idx + 1}의 목적, 사용자 행동, 핵심 기능을 설명하세요.`}
                                            />
                                        </div>
                                    ))}
                                    <label className="upload-area upload-placeholder">
                                        <span className="upload-icon">+</span>
                                        <span className="upload-text">이미지 추가</span>
                                        <input type="file" accept="image/*" multiple onChange={handleMultipleImageUpload} style={{ display: 'none' }} />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="portfolio-actions">
                            <button className={`btn-primary btn-ai-draft ${isGenerating ? 'loading' : ''}`} type="button" onClick={handleGenerateAIDraft} disabled={isGenerating}>
                                {isGenerating ? <span className="loader-text">AI 피드백 및 보완 중...</span> : <span>2. AI 피드백 및 내용 진단</span>}
                            </button>
                        </div>
                    </section>
                </main>

                <aside className="portfolio-sidebar">
                    <div className="ai-feedback-panel glass-panel">
                        <div className="feedback-header">
                            <div className="ai-icon">✓</div>
                            <h3>누락 항목 체크리스트</h3>
                        </div>
                        <ul className="checklist-items">
                            {REQUIRED_SECTIONS.map((section) => {
                                const isMissing = missingKeys.includes(section.key);
                                return (
                                    <li key={section.key} className={`check-item ${isMissing ? 'missing' : 'done'}`}>
                                        <span className="check-icon">{isMissing ? '!' : '✓'}</span>
                                        {section.label}
                                    </li>
                                );
                            })}
                        </ul>

                        <div className="feedback-header" style={{ marginTop: '32px' }}>
                            <div className="ai-icon">AI</div>
                            <h3>AI 개선 제안</h3>
                        </div>
                        <div className="feedback-list">
                            {suggestions.map((suggestion, idx) => (
                                <div key={idx} className="suggestion-box">
                                    <span className="suggestion-text">{suggestion}</span>
                                </div>
                            ))}
                            {suggestions.length === 0 && <p style={{ color: '#64748b', fontSize: '0.9rem' }}>조회된 개선 제안이 없습니다.</p>}
                        </div>

                        <div className="sidebar-actions-sticky">
                            <div className="sidebar-action-grid">
                                <button className="btn-sidebar btn-temp-save" type="button" onClick={() => handleActionItem('임시저장')}>
                                    임시저장
                                </button>
                                <button className="btn-sidebar btn-save" type="button" onClick={() => handleActionItem('완료 및 저장')}>
                                    저장하기
                                </button>
                                <button className="btn-sidebar btn-share" type="button" onClick={() => handleActionItem('공유')}>
                                    공유하기
                                </button>
                            </div>
                            <button className={`btn-accent btn-preview-large ${!isReadyForPreview ? 'btn-warn' : ''}`} type="button" onClick={handlePreviewRequest}>
                                미리보기 (PDF 다운로드)
                            </button>
                        </div>
                    </div>
                </aside>

                {isPreviewOpen && (
                    <div className="preview-modal-overlay fadeIn">
                        <div className="preview-modal scaleUp">
                            <header className="preview-modal-header">
                                <h3>포트폴리오 미리보기 (PDF 추출 단계)</h3>
                                <button className="btn-close" type="button" onClick={() => setIsPreviewOpen(false)}>
                                    &times;
                                </button>
                            </header>
                            <div className="preview-modal-content">
                                <div className="pdf-preview-canvas" id="pdf-content">
                                    <div className="pdf-inner">
                                        <header className="pdf-header">
                                            <div className="pdf-header-left">
                                                <h1>{projectName}</h1>
                                                <p className="pdf-subtitle">Project Portfolio Report</p>
                                            </div>
                                            <div className="pdf-meta">
                                                <span>Date: {new Date().toLocaleDateString('ko-KR')}</span>
                                            </div>
                                        </header>

                                        <div className="pdf-grid-layout">
                                            <section className="pdf-section">
                                                <h2>1. Executive Summary (개요)</h2>
                                                <div className="pdf-box">
                                                    <p className="pdf-text">{overview}</p>
                                                </div>
                                            </section>

                                            <section className="pdf-section">
                                                <h2>2. Responsibilities (역할)</h2>
                                                <div className="pdf-box">
                                                    <pre className="pdf-code">{roles}</pre>
                                                </div>
                                            </section>

                                            <section className="pdf-section">
                                                <h2>3. Technology Stack</h2>
                                                <div className="pdf-box">
                                                    <ul className="pdf-tech-list">
                                                        {Object.entries(techStack)
                                                            .filter(([, isChecked]) => isChecked)
                                                            .map(([tech]) => (
                                                                <li key={tech} className="pdf-tech-item">
                                                                    {tech}
                                                                </li>
                                                            ))}
                                                    </ul>
                                                </div>
                                            </section>

                                            {features.length > 0 && (
                                                <section className="pdf-section">
                                                    <h2>4. Key Features (주요 기능)</h2>
                                                    <div className="pdf-feature-list">
                                                        {features.map((feature, idx) => (
                                                            <div key={idx} className="pdf-item-card">
                                                                <h4 className="pdf-item-title">{feature.title}</h4>
                                                                <p className="pdf-text">{feature.description}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </section>
                                            )}

                                            {troubleshoots.length > 0 && (
                                                <section className="pdf-section">
                                                    <h2>5. Troubleshooting (문제 해결)</h2>
                                                    <div className="pdf-troubleshoot-list">
                                                        {troubleshoots.map((item, idx) => (
                                                            <div key={idx} className="pdf-item-card ts-card">
                                                                <div className="ts-issue">
                                                                    <strong>문제:</strong>
                                                                    <p className="pdf-text">{item.issue}</p>
                                                                </div>
                                                                <div className="ts-resolution">
                                                                    <strong>해결/결과:</strong>
                                                                    <p className="pdf-text">{item.resolution}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </section>
                                            )}

                                            {metrics && (
                                                <section className="pdf-section">
                                                    <h2>6. Outcomes & Metrics (성과 및 지표)</h2>
                                                    <div className="pdf-box">
                                                        <p className="pdf-text">{metrics}</p>
                                                    </div>
                                                </section>
                                            )}

                                            {(architectureImg.src || erdImg.src || uiImgs.length > 0) && (
                                                <section className="pdf-section pdf-visuals">
                                                    <h2>7. Architecture & Interface</h2>
                                                    <div className="pdf-images-grid">
                                                        {architectureImg.src && (
                                                            <div className="pdf-image-block full">
                                                                <h4>시스템 아키텍처</h4>
                                                                <div className="pdf-img-wrapper">
                                                                    <img src={architectureImg.src} alt="시스템 아키텍처" />
                                                                </div>
                                                                {architectureImg.description && <p className="pdf-image-description">{architectureImg.description}</p>}
                                                            </div>
                                                        )}
                                                        {erdImg.src && (
                                                            <div className="pdf-image-block">
                                                                <h4>데이터베이스 ERD</h4>
                                                                <div className="pdf-img-wrapper">
                                                                    <img src={erdImg.src} alt="데이터베이스 ERD" />
                                                                </div>
                                                                {erdImg.description && <p className="pdf-image-description">{erdImg.description}</p>}
                                                            </div>
                                                        )}
                                                        {uiImgs.map((imageItem, idx) => (
                                                            <div key={idx} className="pdf-image-block">
                                                                <h4>주요 UI 화면 {uiImgs.length > 1 ? `(${idx + 1})` : ''}</h4>
                                                                <div className="pdf-img-wrapper">
                                                                    <img src={imageItem.src} alt={`UI 화면 ${idx + 1}`} />
                                                                </div>
                                                                {imageItem.description && <p className="pdf-image-description">{imageItem.description}</p>}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </section>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <footer className="preview-modal-footer">
                                <p className="footer-memo">PDF 추출 버튼을 통해 결과물을 다운로드하세요.</p>
                                <button className="btn-pdf-download" type="button" onClick={handleGeneratePDF}>
                                    PDF 다운로드 API 호출
                                </button>
                            </footer>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PortfolioBuilder;
