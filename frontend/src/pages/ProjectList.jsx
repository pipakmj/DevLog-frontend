import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { getProjects, getAllProjects } from '../api/projectApi';
import { AuthContext } from '../context/AuthContext';
import '../styles/ProjectList.css';

function ProjectList() {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState("all");
    const { isLoggedIn } = useContext(AuthContext);

    useEffect(() => {
        const fetchProjects = async () => {
            setIsLoading(true);
            try {
                const res = viewMode === "all" ? await getAllProjects() : await getProjects();
                setProjects(res.data.data);
            } catch (error) {
                console.log("프로젝트 목록을 불러오지 못했습니다.", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProjects();
    }, [viewMode]);

    if (isLoading) return <div className='list-loading'>프로젝트 로딩중..</div>;

    return (
        <div className='project-list-container'>
            <header className='list-header'>
                <h1>Showcase</h1>
                <p>지금까지 진행한 프로젝트의 히스토리와 실시간 현황입니다.</p>

                <div className='list-actions'>
                    <Link to="/project/add" className='add-project-btn'>프로젝트 등록</Link>
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

            <div className='project-grid'>
                {projects.map(project => (
                    <article key={project.id} className='project-card'>
                            <div className="card-image">
                                <img src={project.thumbnail} alt={project.title} />
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
        </div>
    )
}

export default ProjectList