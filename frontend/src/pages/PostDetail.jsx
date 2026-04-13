import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deletePost, getPostDetail, updatePostViewCount } from '../api/postApi';
import MDEditor from '@uiw/react-md-editor';
import { AuthContext } from '../context/AuthContext';
import { formatDate } from '../utils/formatDate';
import '../styles/PostDetail.css';

function PostDetail() {

    const { postId } = useParams();
    const { isLoggedIn, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchPost = async () => {
            try {
                await updatePostViewCount(postId);

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

    const handleDelete = async () => {
        if (window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
            try {
                await deletePost(postId);
                alert("게시글이 삭제되었습니다.");
                navigate("/posts");
            } catch (error) {
                console.error("삭제 실패", error);
                alert("삭제에 실패했습니다. 권한을 확인하세요");
            }
        }
    }

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
                    <span className="author">by.{post.author}</span>
                    <span className="divider">·</span>
                    <span className="date">{formatDate(post.date)}</span>
                    <span className='post-views'>{post.views || 0} views</span>
                </div>
                <div className="post-tags">
                    {post.tags?.map(tag => (
                        <span key={tag} className="tag">#{tag.trim()}</span>
                    ))}
                </div>
            </header>
            <div className="post-content">
                <MDEditor.Markdown source={post.content} />
                {isLoggedIn && user?.nickname === post?.author && (
                    <div className="admin-actions">
                        <button onClick={() => navigate(`/posts/edit/${postId}`)} className="edit-btn">수정</button>
                        <button onClick={handleDelete} className="delete-btn">삭제</button>
                    </div>
                )}
            </div>
            <footer className="post-detail-footer">
                <button onClick={() => navigate('/posts')} className="list-btn">목록으로</button>
            </footer>
        </div >
    )
}

export default PostDetail