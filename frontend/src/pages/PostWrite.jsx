import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MDEditor, { commands } from '@uiw/react-md-editor';
import { getProjectsToPost } from '../api/projectApi';
import { createPost, getPostDetail, updatePost } from '../api/postApi';
import { uploadImage } from '../utils/uploadImage';
import '../styles/PostWrite.css';

function PostWrite() {
    const navigate = useNavigate();
    const { postId } = useParams();
    const isEditMode = !!postId;

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [selectedProject, setSelectedProject] = useState("");
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState([]);
    const [myProjects, setMyProjects] = useState([]);

    useEffect(() => {
        getProjectsToPost().then(res => {
            setMyProjects(res.data.data);
        }).catch(err => console.error("프로젝트 로드 실패", err));

        if (isEditMode) {
            getPostDetail(postId).then(res => {
                const data = res.data.data;
                setTitle(data.title);
                setContent(data.content);
                setTags(data.tags);
                setSelectedProject(data.projectId);
            });
        }
    }, [postId]);

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
        const postData = { title, content, projectId: selectedProject, tags: tags.join(",") }
        try {
            if (isEditMode) {
                await updatePost(postId, postData);
                alert("수정되었습니다.");
            } else {
                await createPost(postData);
                alert("데브로그가 기록되었습니다!");
            }
            navigate(`/posts/${postId || ""}`);
        } catch (error) {
            console.error("저장 실패", error);
        }
    };

    // 에디터에 이미지를 붙여넣었을 때(ctrl+v) 실행되는 이벤트 핸들러
    const handlePaste = async (e) => {
        const items = e.clipboardData?.items;
        if (!items) return;

        // 클립보드 아이템들 중 이미지 파일만 필터링하여 처리
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf("image") !== -1) {
                // 붙여넣기 기본 동작(브라우저가 이미지 자체를 문자열로 읽거나 무시하는 현상)을 막음
                e.preventDefault();
                const file = items[i].getAsFile();
                if (!file) continue;

                // 현재 커서(Selection) 위치 확보를 위해 이벤트 타겟(textarea) 추출
                const textarea = e.target;
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;

                // 업로드 전 임시로 보여줄 마크다운 텍스트 생성
                const placeholder = `![Uploading ${file.name}...]()`;

                // 기존 내용(content)에서 커서 위치에 임시 텍스트 삽입
                const newValue = content.substring(0, start) + placeholder + content.substring(end);
                setContent(newValue);

                try {
                    // Cloudinary로 이미지 업로드 진행
                    const url = await uploadImage(file);
                    // 업로드 성공 후 임시 텍스트를 실제 반환된 url이 포함된 마크다운 이미지 태그로 교체
                    setContent(prev => prev.replace(placeholder, `![image](${url})`));
                } catch (error) {
                    console.error("이미지 업로드 실패", error);
                    alert("이미지 업로드에 실패했습니다.");
                    // 업로드 실패 시 임시 텍스트 제거
                    setContent(prev => prev.replace(placeholder, ''));
                }
                return; // 하나의 이미지를 처리했으면 루프 종료
            }
        }
    };

    // 에디터 위로 이미지 파일을 드래그 앤 드롭했을 때 실행되는 핸들러 
    const handleDrop = async (e) => {
        const files = e.dataTransfer?.files;
        if (!files) return;

        let hasImage = false;
        // 드롭된 파일 중 이미지만 처리
        for (let i = 0; i < files.length; i++) {
            if (files[i].type.indexOf("image") !== -1) {
                // 브라우저가 이미지 파일을 새 탭에서 열어버리는 기본 동작을 막음
                e.preventDefault();
                hasImage = true;
                const file = files[i];

                const placeholder = `![Uploading ${file.name}...]()`;
                // 드롭의 경우 정확한 커서 위치를 찾기 어려우므로 일반적으로 맨 뒤 혹은 기존 코드처럼 진행합니다
                // 여기서는 글의 마지막에 이미지를 추가합니다.
                setContent(prev => prev + `\n${placeholder}\n`);

                try {
                    // Cloudinary 업로드 진행 후 실제 URL 적용
                    const url = await uploadImage(file);
                    setContent(prev => prev.replace(placeholder, `![image](${url})`));
                } catch (error) {
                    console.error("이미지 업로드 실패", error);
                    alert("이미지 업로드에 실패했습니다.");
                    setContent(prev => prev.replace(placeholder, ''));
                }
            }
        }
        if (hasImage) e.preventDefault(); // 이미지가 포함된 경우 최종적으로 기본 이벤트 차단
    };

    // 에디터 툴바의 '이미지' 아이콘 위치를 대체할 커스텀 명령어 지정
    const imageUploadCommand = {
        ...commands.image, // 기본 react-md-editor의 이미지 명령어의 이름, 버튼 아이콘 등 속성 상속
        execute: (state, api) => { // 버튼 클릭 시 실행할 로직
            const input = document.createElement('input');
            input.type = 'file'; // 파일 선택기 (input file) 생성
            input.accept = 'image/*'; // 이미지만 업로드 가능하도록 제한
            input.onchange = async (event) => {
                const file = event.target.files[0];
                if (file) {
                    const placeholder = `![Uploading ${file.name}...]()`;
                    // api.replaceSelection()은 현재 텍스트 에디터의 커서 위치에 바로 문자열을 삽입해줍니다.
                    api.replaceSelection(placeholder);
                    try {
                        const url = await uploadImage(file);
                        // api.replaceSelection()은 즉시 반영되기 때문에 이후의 url 대치는 content 상태값(prev) 업데이트로 수행
                        setContent(prev => prev.replace(placeholder, `![image](${url})`));
                    } catch (error) {
                        console.error("이미지 업로드 실패", error);
                        alert("이미지 업로드에 실패했습니다.");
                        setContent(prev => prev.replace(placeholder, ''));
                    }
                }
            };
            input.click(); // 숨겨진 input 엘리먼트 강제 클릭으로 브라우저의 파일 선택 창 오픈 
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
                    {/* 
                     - commands.getCommands(): 기본 명령어 배열
                     - filter(): 기존 'image' 명령어를 제거
                     - imageUploadCommand: 우리가 위에서 구현한 이미지 업로드 로직으로 대체
                     - textareaProps: 텍스트 영역(textarea)에 발생되는 이벤트를 직접 핸들링
                    */}
                    <MDEditor
                        value={content}
                        onChange={setContent}
                        height={600}
                        preview="live"
                        commands={[...commands.getCommands().filter(c => c.name !== 'image'), imageUploadCommand]}
                        textareaProps={{
                            onPaste: handlePaste,
                            onDrop: handleDrop
                        }}
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