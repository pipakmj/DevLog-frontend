import React, { useEffect, useMemo, useState } from 'react';
import {
    createPortfolio,
    createPortfolioPreview,
    createPortfolioShareLink,
    downloadPortfolioPdf,
    getPortfolioAiFeedback,
    getPortfolioBuilderProjects,
    getProjectPortfolio,
    updatePortfolio
} from '../api/portfolioApi';
import { uploadImage } from '../utils/uploadImage';
import '../styles/PortfolioBuilder.css';

const DEFAULT_TECH_STACK = [];

const REQUIRED_SECTIONS = [
    { key: 'overview', label: '프로젝트 개요' },
    { key: 'roles', label: '담당 역할' },
    { key: 'tech', label: '기술 스택' },
    { key: 'features', label: '주요 기능' },
    { key: 'troubleshoots', label: '트러블슈팅' },
    { key: 'metrics', label: '성과/지표' }
];

const createImageItem = (src = null, description = '') => ({ src, description });

const normalizeImageItem = (item) => createImageItem(item?.imageUrl || item?.src || null, item?.description || '');

const normalizeTechName = (tech = '') => tech.trim().replace(/\s+/g, ' ');

const normalizeTechStack = (techStack = []) => {
    const selectedTechs = Array.isArray(techStack)
        ? techStack
        : Object.entries(techStack || {})
            .filter(([, isSelected]) => isSelected)
            .map(([tech]) => tech);
    const techNames = Array.from(new Set([...DEFAULT_TECH_STACK, ...selectedTechs]));

    return techNames.reduce((acc, tech) => {
        acc[tech] = selectedTechs.includes(tech);
        return acc;
    }, {});
};

const getResponseData = (response) => response?.data?.data ?? response?.data;

const PortfolioBuilder = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState('');
    const [portfolioId, setPortfolioId] = useState(null);
    const [projectName, setProjectName] = useState('');
    const [overview, setOverview] = useState('');
    const [roles, setRoles] = useState('');
    const [techStack, setTechStack] = useState(normalizeTechStack());
    const [newTechName, setNewTechName] = useState('');
    const [metrics, setMetrics] = useState('');
    const [features, setFeatures] = useState([]);
    const [troubleshoots, setTroubleshoots] = useState([]);
    const [architectureImg, setArchitectureImg] = useState(createImageItem());
    const [erdImg, setErdImg] = useState(createImageItem());
    const [uiImgs, setUiImgs] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await getPortfolioBuilderProjects();
                const data = getResponseData(response);
                const content = data?.content || [];

                setProjects(content);
                if (content.length > 0) {
                    setSelectedProjectId(String(content[0].projectId));
                }
            } catch (error) {
                const message = error.response?.data?.message || '포트폴리오 빌더용 프로젝트 목록을 불러오지 못했습니다.';
                alert(message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjects();
    }, []);

    useEffect(() => {
        if (!selectedProjectId) return;

        const fetchPortfolio = async () => {
            setIsLoading(true);
            try {
                const selectedProject = projects.find((project) => String(project.projectId) === String(selectedProjectId));
                const response = await getProjectPortfolio(selectedProjectId);
                const data = getResponseData(response);
                const portfolio = data?.portfolio || data;
                const exists = data?.exists ?? Boolean(portfolio?.id);

                setPortfolioId(exists ? portfolio?.id || null : null);
                setProjectName(portfolio?.projectName || selectedProject?.projectName || '');
                setOverview(portfolio?.overview || '');
                setRoles(portfolio?.roles || '');
                setTechStack(normalizeTechStack(portfolio?.techStack || selectedProject?.techStack || []));
                setMetrics(portfolio?.metrics || '');
                setFeatures(portfolio?.features || []);
                setTroubleshoots(portfolio?.troubleshoots || []);
                setArchitectureImg(normalizeImageItem(portfolio?.images?.architecture));
                setErdImg(normalizeImageItem(portfolio?.images?.erd));
                setUiImgs((portfolio?.images?.ui || []).map(normalizeImageItem));
                setSuggestions([]);
            } catch (error) {
                const selectedProject = projects.find((project) => String(project.projectId) === String(selectedProjectId));
                setPortfolioId(selectedProject?.portfolioId || null);
                setProjectName(selectedProject?.projectName || '');
                setTechStack(normalizeTechStack(selectedProject?.techStack || []));
                setOverview('');
                setRoles('');
                setMetrics('');
                setFeatures([]);
                setTroubleshoots([]);
                setArchitectureImg(createImageItem());
                setErdImg(createImageItem());
                setUiImgs([]);
                setSuggestions([]);

                const message = error.response?.data?.message || '선택한 프로젝트의 포트폴리오 정보를 불러오지 못했습니다.';
                alert(message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPortfolio();
    }, [projects, selectedProjectId]);

    const selectedTechs = useMemo(
        () => Object.entries(techStack).filter(([, isChecked]) => isChecked).map(([tech]) => tech),
        [techStack]
    );

    const buildPortfolioPayload = (status = 'DRAFT') => ({
        projectId: Number(selectedProjectId),
        overview,
        roles,
        techStack: selectedTechs,
        features: features.filter((feature) => feature.title.trim() || feature.description.trim()),
        troubleshoots: troubleshoots.filter((item) => item.issue.trim() || item.resolution.trim()),
        metrics,
        images: {
            architecture: {
                imageUrl: architectureImg.src,
                description: architectureImg.description
            },
            erd: {
                imageUrl: erdImg.src,
                description: erdImg.description
            },
            ui: uiImgs.map((item) => ({
                imageUrl: item.src,
                description: item.description
            }))
        },
        status
    });

    const checkCompletion = () => {
        const missing = [];
        if (!overview.trim()) missing.push('overview');
        if (!roles.trim()) missing.push('roles');
        if (selectedTechs.length === 0) missing.push('tech');
        if (features.length === 0 || !features.some((feature) => feature.title.trim())) missing.push('features');
        if (troubleshoots.length === 0 || !troubleshoots.some((item) => item.issue.trim())) missing.push('troubleshoots');
        if (!metrics.trim()) missing.push('metrics');
        return missing;
    };

    const missingKeys = checkCompletion();
    const isReadyForPreview = missingKeys.length === 0;
    const isDisabled = isLoading || isSaving || isUploading || isGenerating || isDownloading;

    const toggleTech = (tech) => setTechStack((prev) => ({ ...prev, [tech]: !prev[tech] }));

    const handleAddCustomTech = () => {
        const techName = normalizeTechName(newTechName);
        if (!techName) return;

        setTechStack((prev) => {
            const existingTech = Object.keys(prev).find((tech) => tech.toLowerCase() === techName.toLowerCase());
            if (existingTech) {
                return { ...prev, [existingTech]: true };
            }

            return { ...prev, [techName]: true };
        });
        setNewTechName('');
    };

    const handleTechInputKeyDown = (e) => {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        handleAddCustomTech();
    };

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

    const handleSingleImageUpload = (setter) => async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const imageUrl = await uploadImage(file);
            setter((prev) => ({ ...prev, src: imageUrl }));
        } catch {
            alert('이미지 업로드에 실패했습니다.');
        } finally {
            setIsUploading(false);
            e.target.value = null;
        }
    };

    const handleMultipleImageUpload = async (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setIsUploading(true);
        try {
            const imageUrls = await Promise.all(files.map((file) => uploadImage(file)));
            setUiImgs((prev) => [...prev, ...imageUrls.map((imageUrl) => createImageItem(imageUrl))]);
        } catch {
            alert('이미지 업로드에 실패했습니다.');
        } finally {
            setIsUploading(false);
            e.target.value = null;
        }
    };

    const handleUpdateUiImageDescription = (idx, description) => {
        setUiImgs((prev) => prev.map((item, i) => (i === idx ? { ...item, description } : item)));
    };

    const persistPortfolio = async (status) => {
        if (!selectedProjectId) {
            alert('프로젝트를 먼저 선택해주세요.');
            return null;
        }

        if (status === 'COMPLETED' && !isReadyForPreview) {
            alert('완료 저장을 위해 필수 항목을 모두 입력해주세요.');
            return null;
        }

        setIsSaving(true);
        try {
            const payload = buildPortfolioPayload(status);
            const response = portfolioId
                ? await updatePortfolio(portfolioId, payload)
                : await createPortfolio(payload);
            const data = getResponseData(response);
            const savedPortfolioId = data?.portfolioId || data?.id || portfolioId;

            setPortfolioId(savedPortfolioId);
            alert(status === 'COMPLETED' ? '포트폴리오가 저장되었습니다.' : '임시저장되었습니다.');
            return savedPortfolioId;
        } catch (error) {
            const message = error.response?.data?.message || '포트폴리오 저장에 실패했습니다.';
            alert(message);
            return null;
        } finally {
            setIsSaving(false);
        }
    };

    const handleGenerateAIDraft = async () => {
        setIsGenerating(true);
        try {
            const response = await getPortfolioAiFeedback(buildPortfolioPayload('DRAFT'));
            const data = getResponseData(response);
            const autoCompletedFields = data?.autoCompletedFields || {};

            if (autoCompletedFields.metrics && !metrics.trim()) {
                setMetrics(autoCompletedFields.metrics);
            }
            if (Array.isArray(autoCompletedFields.troubleshoots) && autoCompletedFields.troubleshoots.length > 0) {
                setTroubleshoots((prev) => (prev.length > 0 ? prev : autoCompletedFields.troubleshoots));
            }
            if (Array.isArray(data?.suggestions)) {
                setSuggestions(data.suggestions);
            }
        } catch (error) {
            const message = error.response?.data?.message || 'AI 피드백을 불러오지 못했습니다.';
            alert(message);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleShare = async () => {
        const savedPortfolioId = portfolioId || await persistPortfolio('COMPLETED');
        if (!savedPortfolioId) return;

        try {
            const response = await createPortfolioShareLink(savedPortfolioId, true);
            const data = getResponseData(response);
            const shareUrl = data?.shareUrl;

            if (shareUrl) {
                await navigator.clipboard?.writeText(shareUrl);
                alert('공유 링크가 생성되어 클립보드에 복사되었습니다.');
            } else {
                alert('공유 링크가 생성되었습니다.');
            }
        } catch (error) {
            const message = error.response?.data?.message || '공유 링크 생성에 실패했습니다.';
            alert(message);
        }
    };

    const handleGeneratePDF = async () => {
        const savedPortfolioId = portfolioId || await persistPortfolio('COMPLETED');
        if (!savedPortfolioId) return;

        setIsDownloading(true);
        try {
            const fileName = `${projectName || 'portfolio'}-portfolio.pdf`;
            const response = await downloadPortfolioPdf(savedPortfolioId, fileName);
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');

            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            const message = error.response?.data?.message || 'PDF 다운로드에 실패했습니다.';
            alert(message);
        } finally {
            setIsDownloading(false);
        }
    };

    const handlePreviewRequest = async () => {
        if (!isReadyForPreview) {
            const shouldContinue = window.confirm('필수 항목이 누락되어 있습니다. 그래도 미리보기를 진행하시겠습니까?');
            if (!shouldContinue) return;
        }

        try {
            await createPortfolioPreview({
                ...buildPortfolioPayload(isReadyForPreview ? 'COMPLETED' : 'DRAFT'),
                portfolioId,
                projectName
            });
        } catch {
            // 미리보기 정규화 API가 실패해도 현재 입력값으로 프론트 미리보기는 계속 제공한다.
        } finally {
            setIsPreviewOpen(true);
        }
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
                        <button className="btn-remove-image" type="button" onClick={() => setImageItem((prev) => ({ ...prev, src: null }))} disabled={isDisabled}>
                            &times;
                        </button>
                    </div>
                ) : (
                    <label className="upload-placeholder">
                        <span className="upload-icon">+</span>
                        <span className="upload-text">{isUploading ? '업로드 중...' : '클릭하여 업로드'}</span>
                        <input type="file" accept="image/*" onChange={handleSingleImageUpload(setImageItem)} disabled={isDisabled} style={{ display: 'none' }} />
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
        <div className='portfolio-builder-page'>
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
                                    <select value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)} className="project-select" disabled={isLoading || projects.length === 0}>
                                        {projects.length === 0 ? (
                                            <option value="">등록된 프로젝트가 없습니다.</option>
                                        ) : (
                                            projects.map((project) => (
                                                <option key={project.projectId} value={project.projectId}>
                                                    {project.projectName}
                                                </option>
                                            ))
                                        )}
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
                                <div className="tech-add-row">
                                    <input
                                        type="text"
                                        className="form-input-text tech-add-input"
                                        value={newTechName}
                                        onChange={(e) => setNewTechName(e.target.value)}
                                        onKeyDown={handleTechInputKeyDown}
                                        placeholder="포트폴리오에 추가할 기술을 입력하세요. 예: Next.js"
                                        disabled={isDisabled}
                                    />
                                    <button
                                        className="btn-add-tech"
                                        type="button"
                                        onClick={handleAddCustomTech}
                                        disabled={isDisabled || !normalizeTechName(newTechName)}
                                    >
                                        추가
                                    </button>
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
                                            <button className="btn-remove-dynamic" type="button" onClick={() => handleRemoveFeature(idx)} disabled={isDisabled}>
                                                삭제
                                            </button>
                                            <input className="form-input-text" placeholder="기능명" value={feature.title} onChange={(e) => handleUpdateFeature(idx, 'title', e.target.value)} />
                                            <textarea className="form-textarea" rows={2} placeholder="상세 설명" value={feature.description} onChange={(e) => handleUpdateFeature(idx, 'description', e.target.value)} />
                                        </div>
                                    ))}
                                    <button className="btn-add-dynamic" type="button" onClick={handleAddFeature} disabled={isDisabled}>
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
                                            <button className="btn-remove-dynamic" type="button" onClick={() => handleRemoveTroubleshoot(idx)} disabled={isDisabled}>
                                                삭제
                                            </button>
                                            <textarea className="form-textarea issue-area" rows={2} placeholder="발생한 문제" value={item.issue} onChange={(e) => handleUpdateTroubleshoot(idx, 'issue', e.target.value)} />
                                            <textarea className="form-textarea resolution-area" rows={3} placeholder="해결 방법과 결과" value={item.resolution} onChange={(e) => handleUpdateTroubleshoot(idx, 'resolution', e.target.value)} />
                                        </div>
                                    ))}
                                    <button className="btn-add-dynamic" type="button" onClick={handleAddTroubleshoot} disabled={isDisabled}>
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
                                                        <img src={imageItem.src} alt={`UI screen ${idx + 1}`} />
                                                        <button className="btn-remove-image" type="button" onClick={() => setUiImgs((prev) => prev.filter((_, i) => i !== idx))} disabled={isDisabled}>
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
                                            <span className="upload-text">{isUploading ? '업로드 중...' : '이미지 추가'}</span>
                                            <input type="file" accept="image/*" multiple onChange={handleMultipleImageUpload} disabled={isDisabled} style={{ display: 'none' }} />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="portfolio-actions">
                                <button className={`btn-primary btn-ai-draft ${isGenerating ? 'loading' : ''}`} type="button" onClick={handleGenerateAIDraft} disabled={isDisabled || !selectedProjectId}>
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
                                    <button className="btn-sidebar btn-temp-save" type="button" onClick={() => persistPortfolio('DRAFT')} disabled={isDisabled || !selectedProjectId}>
                                        {isSaving ? '저장 중...' : '임시저장'}
                                    </button>
                                    <button className="btn-sidebar btn-save" type="button" onClick={() => persistPortfolio('COMPLETED')} disabled={isDisabled || !selectedProjectId}>
                                        저장하기
                                    </button>
                                    <button className="btn-sidebar btn-share" type="button" onClick={handleShare} disabled={isDisabled || !selectedProjectId}>
                                        공유하기
                                    </button>
                                </div>
                                <button className={`btn-accent btn-preview-large ${!isReadyForPreview ? 'btn-warn' : ''}`} type="button" onClick={handlePreviewRequest} disabled={isDisabled || !selectedProjectId}>
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
                                                    <p className="pdf-kicker">DevLog Portfolio</p>
                                                    <h1>{projectName || 'Project Name'}</h1>
                                                    <p className="pdf-subtitle">Project Portfolio Report</p>
                                                </div>
                                                <div className="pdf-meta">
                                                    <span>Date</span>
                                                    <strong>{new Date().toLocaleDateString('ko-KR')}</strong>
                                                </div>
                                            </header>

                                            <div className="pdf-grid-layout">
                                                <section className="pdf-section">
                                                    <h2><span>01</span> Executive Summary <em>{'\uac1c\uc694'}</em></h2>
                                                    <div className="pdf-box">
                                                        <p className="pdf-text">{overview}</p>
                                                    </div>
                                                </section>

                                                <section className="pdf-section">
                                                    <h2><span>02</span> Responsibilities <em>{'\uc5ed\ud560'}</em></h2>
                                                    <div className="pdf-box">
                                                        <pre className="pdf-code">{roles}</pre>
                                                    </div>
                                                </section>

                                                <section className="pdf-section">
                                                    <h2><span>03</span> Technology Stack</h2>
                                                    <ul className="pdf-tech-list">
                                                        {selectedTechs.map((tech) => (
                                                            <li key={tech} className="pdf-tech-item">
                                                                {tech}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </section>

                                                {features.length > 0 && (
                                                    <section className="pdf-section">
                                                        <h2><span>04</span> Key Features <em>{'\uc8fc\uc694 \uae30\ub2a5'}</em></h2>
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

                                                {architectureImg.src && (
                                                    <section className="pdf-section">
                                                        <h2><span>05</span> System Architecture <em>{'\uc2dc\uc2a4\ud15c \uc544\ud0a4\ud14d\ucc98'}</em></h2>
                                                        <div className="pdf-image-block full">
                                                            <div className="pdf-img-wrapper">
                                                                <img src={architectureImg.src} alt="Architecture" />
                                                            </div>
                                                            {architectureImg.description && <p className="pdf-image-description">{architectureImg.description}</p>}
                                                        </div>
                                                    </section>
                                                )}

                                                {erdImg.src && (
                                                    <section className="pdf-section">
                                                        <h2><span>06</span> Database ERD <em>{'\ub370\uc774\ud130\ubca0\uc774\uc2a4 ERD'}</em></h2>
                                                        <div className="pdf-image-block full">
                                                            <div className="pdf-img-wrapper">
                                                                <img src={erdImg.src} alt="Database ERD" />
                                                            </div>
                                                            {erdImg.description && <p className="pdf-image-description">{erdImg.description}</p>}
                                                        </div>
                                                    </section>
                                                )}

                                                {uiImgs.length > 0 && (
                                                    <section className="pdf-section">
                                                        <h2><span>07</span> User Interface <em>{'\uc8fc\uc694 UI \ud654\uba74'}</em></h2>
                                                        <div className="pdf-images-grid">
                                                            {uiImgs.map((imageItem, idx) => (
                                                                <div key={idx} className="pdf-image-block">
                                                                    <div className="pdf-img-wrapper">
                                                                        <img src={imageItem.src} alt={`UI screen ${idx + 1}`} />
                                                                    </div>
                                                                    {imageItem.description && <p className="pdf-image-description">{imageItem.description}</p>}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </section>
                                                )}

                                                {troubleshoots.length > 0 && (
                                                    <section className="pdf-section">
                                                        <h2><span>08</span> Troubleshooting <em>{'\ubb38\uc81c \ud574\uacb0'}</em></h2>
                                                        <div className="pdf-troubleshoot-list">
                                                            {troubleshoots.map((item, idx) => (
                                                                <div key={idx} className="pdf-item-card ts-card">
                                                                    <div className="ts-issue">
                                                                        <span className="ts-label-issue">{'\ubb38\uc81c'}</span>
                                                                        <p className="pdf-text">{item.issue}</p>
                                                                    </div>
                                                                    <div className="ts-resolution">
                                                                        <span className="ts-label-resolution">{'\ud574\uacb0/\uacb0\uacfc'}</span>
                                                                        <p className="pdf-text">{item.resolution}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </section>
                                                )}

                                                {metrics && (
                                                    <section className="pdf-section">
                                                        <h2><span>09</span> Outcomes &amp; Metrics <em>{'\uc131\uacfc \ubc0f \uc9c0\ud45c'}</em></h2>
                                                        <div className="pdf-box">
                                                            <p className="pdf-text">{metrics}</p>
                                                        </div>
                                                    </section>
                                                )}
                                            </div>
                                            <div className="pdf-footer">
                                                Generated By DevLog Portfolio Builder
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <footer className="preview-modal-footer">
                                    <p className="footer-memo">PDF 추출 버튼을 통해 결과물을 다운로드하세요.</p>
                                    <button className="btn-pdf-download" type="button" onClick={handleGeneratePDF} disabled={isDownloading}>
                                        {isDownloading ? 'PDF 생성 중...' : 'PDF 다운로드'}
                                    </button>
                                </footer>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PortfolioBuilder;
