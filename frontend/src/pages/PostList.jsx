import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllPosts } from '../api/postApi';
import { formatDate } from '../utils/formatDate';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/PostList.css';
import Pagination from '../components/Pagination';

function PostList() {
    const [posts, setPosts] = useState([]);
    const [pageInfo, setPageInfo] = useState({ number: 0, totalPages: 0 });
    const [currentPage, setCurrentPage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            try {
                const res = await getAllPosts(currentPage, 10);
                const data = res.data.data;

                setPosts(data.content);

                setPageInfo({
                    number: data.number,
                    totalPages: data.totalPages,
                    totalElements: data.totalElements,
                })
            } catch (error) {
                console.log("게시글 목록을 가져오지 못했습니다.", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPosts();
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    if (isLoading) return <LoadingSpinner message="포스트 목록을 불러오는 중..." />;

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
            <Pagination
                pageInfo={pageInfo} onPageChange={handlePageChange}
            />
        </div>
    );
}

export default PostList;