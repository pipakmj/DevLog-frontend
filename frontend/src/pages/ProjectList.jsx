import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { getProjects } from '../api/projectApi';
import '../styles/ProjectList.css';

function ProjectList() {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await getProjects();
                setProjects(res.data.data);
            } catch (error) {
                console.log("프로젝트 목록을 불러오지 못했습니다.", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProjects();
    }, []);

    if (isLoading) return <div className='list-loading'>프로젝트 로딩중..</div>;

    return (
        <div className='project-list-container'>
            <header className='list-header'>
                <h1>Showcase</h1>
                <p>지금까지 진행한 프로젝트의 히스토리와 실시간 현황입니다.</p>
            </header>

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
                                <p>{project.demo_url}</p>
                                <p>{project.github_url}</p>
                                <div className="card-tags">
                                    {project.tech_stack?.split(",").map(tag => (
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