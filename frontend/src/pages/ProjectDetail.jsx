import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { getProjects, deleteProject } from '../api/projectApi';
import { getRepoCommits, parseGithubUrl } from '../api/githubApi';
import '../styles/ProjectDetail.css';

function ProjectDetail() {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [commits, setCommits] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const res = await getProjects();
                const target = res.data.data.find(p => p.id === parseInt(projectId));
                setProject(target);

                if (target && target.githubUrl) {
                    const parsed = parseGithubUrl(target.githubUrl);
                    if (parsed) {
                        const commitData = await getRepoCommits(parsed.owner, parsed.repo);
                        setCommits(commitData);
                    }
                }
            } catch (error) {
                console.error("데이터로딩 실패:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllData();
    }, [projectId]);

    const handleDelete = async () => {
        if (window.confirm("정말로 이 프로젝트를 삭제하시겠습니까?")) {
            try {
                await deleteProject(projectId);
                alert("프로젝트가 삭제되었습니다.");
                navigate("/projectlist");
            } catch (error) {
                console.error("삭제 실패:", error);
                alert("삭제 중 오류가 발생했습니다.");
            }
        }
    };

    if (isLoading) return <div className="loading-screen">프로젝트 분석 중...</div>;
    if (!project) return <div>프로젝트를 찾을 수 없습니다.</div>;

    return (
        <div className="detail-container">

            <header className="detail-header">
                <span className="status-badge">Live</span>
                <h1>{project.title}</h1>
                <div className="detail-links">
                    <a href={project.githubUrl} target="_blank" rel="noreferrer" className="link-btn github">GitHub Repo</a>
                    {project.demoUrl && <a href={project.demoUrl} target="_blank" rel="noreferrer" className="link-btn demo">Visit Live Site</a>}
                </div>
            </header>
            
            <section className="description-section">
                <div className="section-title">
                    <h3>About Project</h3>
                    <div className="title-underline"></div>
                </div>
                <p className="project-text">{project.description}</p>
            </section>

            <section className="activity-section">
                <div className="section-title">
                    <h3>GitHub Development Journey</h3>
                    <p>프로젝트의 발자취를 따라가보세요.</p>
                </div>

                <div className="horizontal-timeline-container">
                    <div className="timeline-items">
                        <div className="timeline-line"></div>
                        {commits.map((commit, index) => (
                            <div key={index} className="timeline-item">
                                <div className="timeline-node">
                                    <div className="node-dot"></div>
                                    <span className="node-date">
                                        {new Date(commit.commit.author.date).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="timeline-card">
                                    <div className="commit-hash">#{commit.sha.substring(0, 7)}</div>
                                    <p className="commit-msg">{commit.commit.message}</p>
                                    <span className="commit-author">@{commit.commit.author.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="admin-actions">
                <Link to={`/project/edit/${project.id}`} className="link-btn edit">Edit</Link>
                <button onClick={handleDelete} className="link-btn delete">Delete</button>
            </div>

        </div>
    )
}

export default ProjectDetail