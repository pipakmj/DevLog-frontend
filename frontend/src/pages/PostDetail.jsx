import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deletePost, getLikeStatus, getPostDetail, toggleLike, updatePostViewCount } from '../api/postApi';
import MDEditor from '@uiw/react-md-editor';
import { AuthContext } from '../context/AuthContext';
import { formatDate } from '../utils/formatDate';
import '../styles/PostDetail.css';
import { createComment, deleteComment, getComments, updateComment } from '../api/commentApi';

function PostDetail() {

    const { postId } = useParams();
    const { isLoggedIn, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentInput, setCommentInput] = useState("");
    const [replyToId, setReplyToId] = useState(null);
    const [replyInput, setReplyInput] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editInput, setEditInput] = useState("");

    const fetchComments = async () => {
        try {
            const res = await getComments(postId);
            setComments(res.data.data);
        } catch (error) {
            console.error("댓글 로드 실패", error);
        }
    };

    useEffect(() => {
        const fetchPost = async () => {
            try {
                await updatePostViewCount(postId);
                const postResponse = await getPostDetail(postId);
                const likeResponse = await getLikeStatus(postId);

                setPost(postResponse.data.data);
                setIsLiked(likeResponse.data.data.isLiked);
                setLikes(likeResponse.data.data.likeCount);
            } catch (error) {
                console.error("게시글 로드 실패", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPost();
        fetchComments();
    }, [postId]);

    const handleLike = async () => {
        if (!isLoggedIn) {
            alert("좋아요를 누르시려면 로그인이 필요합니다.");
            navigate("/signin", { state: { from: `/posts/${postId}` } });
            return;
        }

        try {
            const res = await toggleLike(postId);
            setLikes(res.data.data?.likeCount);
            setIsLiked(res.data.data?.isLiked);
        } catch (error) {
            console.error("좋아요 처리 실패", error);
        }
    };

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

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!isLoggedIn) {
            alert("로그인이 필요합니다.");
            return;
        }
        if (!commentInput?.trim()) return;

        try {
            await createComment(postId, commentInput);
            setCommentInput("");
            fetchComments();
            alert("댓글이 등록되었습니다.");
        } catch (error) {
            console.error("댓글 작성성 실패", error);
        }
    };

    const handleEditClick = (comment) => {
        setEditingId(comment.commentId);
        setEditInput(comment.content);
    };
    
    const handleEditSubmit = async (commentId) => { 
        try {
            await updateComment(commentId, editInput);
            setEditingId(null);
            fetchComments();
        } catch (error) {
            console.error("수정 실패", error);
        }
    };

    const handleCommentDelete = async (commentId) => {
        if (window.confirm("댓글을 삭제하시겠습니까?")) {
            try {
                await deleteComment(commentId);
                fetchComments();
                alert("댓글이 삭제되었습니다.");
            } catch (error) {
                console.error("댓글 삭제 실패", error);
                alert("삭제 권한이 없습니다.");
            }
        }
    };

    const handleReplySubmit = async (e, parentId) => {
        e.preventDefault();
        if (!replyInput?.trim()) return;

        try {
            await createComment(postId, replyInput, parentId);
            setReplyInput("");
            setReplyToId(null);
            fetchComments();
            alert("답글을 등록했습니다.");
        } catch (error) {
            console.error("답글 작성 실패", error);
        }
    };

    const formatComments = (allComments) => {
        const parentComments = allComments.filter(c => !c.parentId); // 부모들만 추출
        const replyComments = allComments.filter(c => c.parentId);  // 대댓글들만 추출
        const result = [];
        parentComments.forEach(parent => {
            result.push(parent); // 부모 넣고
            // 해당 부모를 부모로 가진 대댓글들만 찾아서 바로 뒤에 넣기
            const childReplies = replyComments.filter(reply => reply.parentId === parent.commentId);
            result.push(...childReplies);
        });
        return result;
    };

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
                    <span className="author">by. {post.author}</span>
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

                <div className="like-section">
                    <button className={`like-btn ${isLiked ? 'active' : ''}`} onClick={handleLike}>
                        <span className="heart">{isLiked ? '❤️' : '🤍'}</span>
                        <span className="count">{likes}</span>
                    </button>
                </div>

                {isLoggedIn && user?.nickname === post?.author && (
                    <div className="admin-actions">
                        <button onClick={() => navigate(`/posts/edit/${postId}`)} className="edit-btn">수정</button>
                        <button onClick={handleDelete} className="delete-btn">삭제</button>
                    </div>
                )}
            </div>
            <div className="comment-section">
                <h3>댓글 {comments.length}개</h3>

                <form className="comment-form" onSubmit={handleCommentSubmit}>
                    <textarea
                        placeholder={isLoggedIn ? "따뜻한 댓글을 남겨주세요." : "로그인 후 댓글을 남길 수 있습니다."}
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        disabled={!isLoggedIn}
                    />
                    <button type="submit" disabled={!isLoggedIn || !commentInput?.trim()}>등록</button>
                </form>
                <div className="comment-list">
                    {formatComments(comments).map(c => (
                        <div key={c.commentId} className={`comment-item ${c.parentId ? 'reply' : ''}`}>
                            <div className="comment-meta">
                                <span className="comment-author">
                                    {c.nickname}
                                    {c.nickname === post.author && <span className='author-badge'>작성자</span>}
                                </span>
                                {c.updatedAt === null ? (
                                    <span className="comment-date">{formatDate(c.createdAt)}</span>
                                ) : (
                                    <span className='comment-updated-date'>{formatDate(c.updatedAt)} 수정됨</span>
                                )}
                            </div>
                            {c.isDeleted ? (<p className='comment-content deleted-message'>삭제된 댓글입니다.</p>
                            ) : (
                                <>
                                    {editingId === c.commentId ? (
                                            <div className="edit-form">
                                                <textarea
                                                    value={editInput}
                                                    onChange={(e) => setEditInput(e.target.value)}
                                                    autoFocus
                                                />
                                                <div className="edit-actions">
                                                    <button onClick={() => handleEditSubmit(c.commentId)}>저장</button>
                                                    <button onClick={() => setEditingId(null)}>취소</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <p className = 'comment-content'>{c.content}</p>
                                                {!c.parentId && isLoggedIn &&
                                                    (<button className="reply-toggle-btn" onClick={() => setReplyToId(replyToId === c.commentId ? null : c.commentId)}>
                                                        {replyToId === c.commentId ? "취소" : "답글"}
                                                    </button>)}
                                                {isLoggedIn && user?.nickname === c.nickname && (
                                                    <>
                                                        <button className="comment-delete-btn" onClick={() => handleCommentDelete(c.commentId)}>
                                                            삭제
                                                        </button>
                                                        <button className="comment-edit-btn" onClick={() => handleEditClick(c)}>
                                                            수정
                                                        </button>
                                                    </>
                                                )}
                                            </>
                                    )}
                                </>
                            )}
                            {replyToId === c.commentId && (
                                <form className="reply-form" onSubmit={(e) => handleReplySubmit(e, c.commentId)}>
                                    <textarea
                                        placeholder="답글을 입력하세요..."
                                        value={replyInput}
                                        onChange={(e) => setReplyInput(e.target.value)}
                                        autoFocus
                                    />
                                    <button type="submit" disabled={!replyInput.trim()}>답글 등록</button>
                                </form>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <footer className="post-detail-footer">
                <button onClick={() => navigate('/posts')} className="list-btn">목록으로</button>
            </footer>
        </div >
    )
}

export default PostDetail