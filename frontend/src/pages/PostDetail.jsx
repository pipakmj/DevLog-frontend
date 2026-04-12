import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getPostDetail } from '../api/postApi';
import MDEditor from '@uiw/react-md-editor';
import '../styles/PostDetail.css';

function PostDetail() {

    const { postId } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await getPostDetail(postId);
                setPost(res.data.data);
            } catch (error) {
                console.error("게시글 로드 실패", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPost();
    }, [postId]);
    if (isLoading) return <div className="loading">글을 불러오는 중...</div>;
    if (!post) return <div className="error">게시글을 찾을 수 없습니다.</div>;
    return (
            <div className="post-detail-container" data-color-mode="dark">
                <header className="post-detail-header">
                    <div className="post-category">
                        <Link to={`/project/${post.projectId}`} className="project-link">
                            📁 {post.projectName}
                        </Link>
                    </div>
                    <h1>{post.title}</h1>
                    <div className="post-info">
                        <span className="author">by {post.author}</span>
                        <span className="divider">·</span>
                        <span className="date">{post.date}</span>
                    </div>
                    <div className="post-tags">
                        {post.tags?.map(tag => (
                            <span key={tag} className="tag">#{tag.trim()}</span>
                        ))}
                    </div>
                </header>
                <div className="post-content">
                    <MDEditor.Markdown source={post.content} />
                </div>
                <footer className="post-detail-footer">
                    <button onClick={() => navigate('/posts')} className="list-btn">목록으로</button>
            </footer>
        </div >
    )
}

export default PostDetail