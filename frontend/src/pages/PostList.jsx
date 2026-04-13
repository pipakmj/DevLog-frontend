import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllPosts } from '../api/postApi';
import { formatDate } from '../utils/formatDate';
import '../styles/PostList.css';

function PostList() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            try {
                const res = await getAllPosts();
                setPosts(res.data.data);
            } catch (error) {
                console.log("게시글 목록을 가져오지 못했습니다.", error);
            } finally { 
                setIsLoading(false);
            }
        };
        fetchPosts();
    }, []);

    return (
        <div className="post-list-container">
            <header className="post-header">
                <h1>DevLogs</h1>
                <p>개발 과정에서의 고민과 기록들을 공유합니다.</p>
                <button className="write-btn" onClick={() => navigate('/posts/write')}>글쓰기</button>
            </header>

            <div className="post-items">
                {posts.map(post => (
                    <article key={post.id} className="post-card">
                        <div className="post-meta">
                            <span className="post-project">{post.projectName}</span>
                            <span className="post-date">{formatDate(post.date)}</span>
                        </div>
                        <Link to={`/posts/${post.id}`} className="post-title">
                            <h3>{post.title}</h3>
                        </Link>
                        <div className="post-tags">
                            {post.tags.map(tag => <span key={tag} className="tag">#{tag}</span>)}
                        </div>
                        <div className="post-footer">
                            <span className="post-author">by. {post.author}</span>
                            <span className="post-views">조회수 {post.views}</span>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}

export default PostList;