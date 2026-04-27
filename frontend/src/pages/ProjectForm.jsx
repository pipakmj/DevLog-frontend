import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createProject, updateProject, getDetailProject, gitHubAnalyze } from '../api/projectApi';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/ProjectForm.css';

function ProjectForm() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!projectId;

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        githubUrl: "",
        demoUrl: "",
        techStack: "",
        thumbnail: ""
    });

    const [isLoading, setIsLoading] = useState(isEditMode);
    const [isSaving, setIsSaving] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            const fetchDetail = async () => {
                setIsLoading(true);
                try {
                    const res = await getDetailProject(projectId);
                    const target = res.data.data;
                    if (target) {
                        setFormData({
                            title: target.title || "",
                            description: target.description || "",
                            githubUrl: target.githubUrl || "",
                            demoUrl: target.demoUrl || "",
                            techStack: target.techStack || "",
                            thumbnail: target.thumbnail || ""
                        });
                    }
                } catch (error) {
                    console.error("데이터 로딩 실패:", error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchDetail();
        }
    }, [projectId, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSaving) return;
        setIsSaving(true);
        try {
            if (isEditMode) {
                await updateProject(projectId, formData);
                alert("수정 되었습니다.");
            } else {
                await createProject(formData);
                alert("등록 되었습니다.");
            }
            navigate("/projectlist");
        } catch (error) {
            console.error("작업 중 오류 발생:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleAnalyze = async () => {
        if (!formData.githubUrl) {
            alert("GitHub URL을 먼저 입력해주세요.");
            return;
        }
        setIsAnalyzing(true);
        try {
            const res = await gitHubAnalyze({ gitUrl: formData.githubUrl });
            const aiData = res.data.data;
            if (aiData) {
                setFormData(prev => ({
                    ...prev,
                    techStack: aiData.techStack.join(", "),
                    description: `${aiData.description}\n\n### 주요 기능\n${aiData.features.map(f => `- ${f}`).join("\n")}`
                }));
                alert("AI 분석 데이터가 입력되었습니다! 내용을 검토하고 수정해 주세요.");
            }
        } catch (error) {
            console.error("분석 실패:", error);
            alert("AI 분석 중 오류가 발생했습니다. 직접 입력해 주세요.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    if (isLoading) {
        return <LoadingSpinner message='프로젝트 정보를 불러오는 중입니다...' />
    }

    return (
        <div className="form-container">
            <h2>{isEditMode ? "프로젝트 수정" : "새 프로젝트 등록"}</h2>
            <form onSubmit={handleSubmit} className="project-form">
                <div className="input-group">
                    <label>프로젝트 제목</label>
                    <input name="title" value={formData.title} onChange={handleChange} placeholder="제목을 입력하세요" required />
                </div>
                <div className="input-group">
                    <label>상세 설명</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="프로젝트에 대해 설명해주세요" required rows="5" />
                </div>
                <div className="input-group">
                    <label>GitHub URL</label>
                    <div className="input-with-button">
                        <input
                            name="githubUrl"
                            value={formData.githubUrl}
                            onChange={handleChange}
                            placeholder="https://github.com/..."
                        />
                        <button
                            type="button"
                            onClick={handleAnalyze}
                            disabled={isAnalyzing}
                            className="analyze-btn"
                        >
                            {isAnalyzing ? (
                                <>
                                    <div className="mini-spinner"></div>
                                    <span>분석 중...</span>
                                </>
                            ) : (
                                <>
                                    <span>🪄 AI 분석</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
                <div className="input-group">
                    <label>배포 주소</label>
                    <input name="demoUrl" value={formData.demoUrl} onChange={handleChange} placeholder="https://..." />
                </div>
                <div className="input-group">
                    <label>기술 스택</label>
                    <input name="techStack" value={formData.techStack} onChange={handleChange} placeholder="React, Spring, MySQL 등 (쉼표 구분)" />
                </div>
                <div className="input-group">
                    <label>이미지 경로</label>
                    <input name="thumbnail" value={formData.thumbnail} onChange={handleChange} placeholder="이미지 URL" />
                </div>

                <div className="form-buttons">
                    <button type="submit" className="submit-btn" disabled={isSaving}>{isEditMode ? "수정 완료" : "프로젝트 생성"}</button>
                    <button type="button" onClick={() => navigate(-1)} className="cancel-btn">취소</button>
                </div>
            </form>
        </div>
    );
}

export default ProjectForm;