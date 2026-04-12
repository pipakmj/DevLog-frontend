import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllPosts } from '../api/postApi';
import '../styles/PostList.css';

function PostList() {
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // 임시 데이터 또는 API 호출
        setPosts([
            { id: 1, title: "Vite + React 초기 세팅하기", author: "홍길동", date: "2024-04-08", tags: ["React", "Vite"], views: 120, projectName: "DevLog 서비스" },
            { id: 2, title: "Axios 인터셉터 정복하기", author: "이몽룡", date: "2024-04-07", tags: ["Axios", "Auth"], views: 85, projectName: "DevLog 서비스" },
            { id: 3, title: "Axios 인터셉터 정복하기", author: "이몽룡", date: "2024-04-07", tags: ["Axios", "Auth"], views: 85, projectName: "DevLog 서비스" },
            { id: 4, title: "Axios 인터셉터 정복하기", author: "이몽룡", date: "2024-04-07", tags: ["Axios", "Auth"], views: 85, projectName: "DevLog 서비스" },
            { id: 5, title: "Axios 인터셉터 정복하기", author: "이몽룡", date: "2024-04-07", tags: ["Axios", "Auth"], views: 85, projectName: "DevLog 서비스" },
            { id: 6, title: "Axios 인터셉터 정복하기", author: "이몽룡", date: "2024-04-07", tags: ["Axios", "Auth"], views: 85, projectName: "DevLog 서비스" },
            { id: 7, title: "Axios 인터셉터 정복하기", author: "이몽룡", date: "2024-04-07", tags: ["Axios", "Auth"], views: 85, projectName: "DevLog 서비스" },
            { id: 8, title: "Axios 인터셉터 정복하기", author: "이몽룡", date: "2024-04-07", tags: ["Axios", "Auth"], views: 85, projectName: "DevLog 서비스" },
        ]);
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
                            <span className="post-date">{post.date}</span>
                        </div>
                        <Link to={`/posts/${post.id}`} className="post-title">
                            <h3>{post.title}</h3>
                        </Link>
                        <div className="post-tags">
                            {post.tags.map(tag => <span key={tag} className="tag">#{tag}</span>)}
                        </div>
                        <div className="post-footer">
                            <span className="post-author">by {post.author}</span>
                            <span className="post-views">조회수 {post.views}</span>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}

export default PostList;