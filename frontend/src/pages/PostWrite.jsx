import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import { getProjects } from '../api/projectApi';
import { createPost } from '../api/postApi';
import '../styles/PostWrite.css';

function PostWrite() {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [selectedProject, setSelectedProject] = useState("");
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState([]);
    const [myProjects, setMyProjects] = useState([]);

    useEffect(() => {
        getProjects().then(res => {
            setMyProjects(res.data.data);
        }).catch(err => console.error("프로젝트 로드 실패", err));
    }, []);

    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter' && tagInput.trim() !== '') {
            e.preventDefault();
            if (!tags.includes(tagInput.trim())) {
                setTags([...tags, tagInput.trim()]);
            }
            setTagInput("");
        }
    };

    const removeTag = (indexToRemove) => {
        setTags(tags.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const postData = {
                title,
                content,
                projectId: selectedProject,
                tags: tags.join(",")
            };
            await createPost(postData);
            alert("데브로그가 기록되었습니다!");
            navigate("/posts");
        } catch (error) {
            console.error("저장 실패", error);
        }
    };

    return (
        <div className="post-write-container" data-color-mode="dark">
            <header className="write-header">
                <h1>Record New Log</h1>
            </header>

            <form onSubmit={handleSubmit} className="write-form">
                <input
                    className="title-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="제목을 입력하세요..."
                    required
                />

                <div className="write-options">
                    <select
                        value={selectedProject}
                        onChange={(e) => setSelectedProject(e.target.value)}
                        required
                    >
                        <option value="">관련 프로젝트 선택</option>
                        {myProjects.map(proj => (
                            <option key={proj.id} value={proj.id}>{proj.title}</option>
                        ))}
                    </select>

                    <div className="tag-section">
                        {tags.map((tag, index) => (
                            <span key={index} className="tag-badge">
                                #{tag} <button type="button" onClick={() => removeTag(index)}>x</button>
                            </span>
                        ))}
                        <input
                            placeholder="태그 입력 후 Enter"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleTagKeyDown}
                        />
                    </div>
                </div>

                <div className="editor-wrapper">
                    <MDEditor
                        value={content}
                        onChange={setContent}
                        height={600}
                        preview="live"
                    />
                </div>

                <div className="write-footer">
                    <button type="submit" className="save-btn">로그 기록하기</button>
                    <button type="button" onClick={() => navigate(-1)} className="cancel-btn">취소</button>
                </div>
            </form>
        </div>
    );
}

export default PostWrite;