import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { getProjects, getAllProjects } from '../api/projectApi';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/ProjectList.css';
import image from '../assets/DevLog_Thumbnail.png';

function ProjectList() {
    const [projects, setProjects] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState("all");
    const { isLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        setProjects([]);
        setPage(0);
        setHasMore(true);
        fetchProjects(0, true);
    }, [viewMode]);

    const fetchProjects = async (pageNum, isReset = false) => {
        setIsLoading(true);
        try {
            const res = viewMode === "all"
                ? await getAllProjects(pageNum, 9)
                : await getProjects(pageNum, 9);

            const data = res.data.data;
            const newData = data.content;
            const hasNext = data.hasNext;

            setHasMore(hasNext);

            setProjects(prev => isReset ? newData : [...prev, ...newData]);
        } catch (error) {
            console.log("프로젝트 목록을 불러오지 못했습니다.", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchProjects(nextPage);
    };

    const handleAddProject = () => {
        if (isLoggedIn) {
            navigate("/project/add");
        } else {
            navigate("/signin", { state: { from: "/project/add" } });
        }
    };

    if (isLoading && projects.length === 0) return <LoadingSpinner message="프로젝트 목록을 불러오고 있습니다..." />;

    return (
        <div className='project-list-container'>
            <header className='list-header'>
                <h1>Showcase</h1>
                <p>지금까지 진행한 프로젝트의 히스토리와 실시간 현황입니다.</p>

                <div className='list-actions'>
                    <button onClick={handleAddProject} className='add-project-btn' style={{ cursor: 'pointer', border: 'none' }}>프로젝트 등록</button>
                </div>
            </header>

            <div className="project-tabs">
                {isLoggedIn && (
                    <div>
                        <button
                            className={viewMode === "all" ? "active" : ""}
                            onClick={() => setViewMode("all")}
                        >
                            All Projects
                        </button>
                        <button
                            className={viewMode === "mine" ? "active" : ""}
                            onClick={() => setViewMode("mine")}
                        >
                            My Projects
                        </button>
                    </div>
                )}
            </div>

            {projects.length === 0 ? (
                <div className="no-projects-message">
                    <p>등록된 프로젝트가 없습니다.</p>
                    <p>당신의 멋진 프로젝트를 첫 번째로 등록해보세요!</p>
                </div>
            ) : (
                <>
                    <div className='project-grid'>
                        {projects.map(project => (
                            <article key={project.id} className='project-card'>
                                <div className="card-image">
                                    <img src={project.thumbnail || image} alt={project.title} />
                                    <div className="card-overlay highlight">
                                        <span>상세 보기</span>
                                    </div>
                                </div>
                                <div className='card-content'>
                                    <h3>{project.title}</h3>
                                    <p>{project.description}</p>
                                    <p>{project.demoUrl}</p>
                                    <p>{project.githubUrl}</p>
                                    <div className="card-tags">
                                        {project.techStack?.split(",").map(tag => (
                                            <span key={tag} className="tag-badge">{tag}</span>
                                        ))}
                                    </div>

                                    <Link to={`/project/${project.id}`} className="view-detail-btn">
                                        자세히 알아보기
                                    </Link>

                                    <p>{project.created_at}</p>
                                </div>
                            </article>
                        ))}
                    </div>

                    {hasMore && (
                        <div className="load-more-container">
                            <button
                                onClick={handleLoadMore}
                                className="load-more-btn"
                                disabled={isLoading}
                            >
                                {isLoading ? "Loading..." : "Load More Projects"}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default ProjectList