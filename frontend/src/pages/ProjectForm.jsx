import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createProject, updateProject, getDetailProject } from '../api/projectApi';
import LoadingSpinner from '../components/LoadingSpinner';

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
                    <input name="githubUrl" value={formData.githubUrl} onChange={handleChange} placeholder="https://github.com/..." />
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