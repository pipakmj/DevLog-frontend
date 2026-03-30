import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProjects } from '../api/projectApi';
import { getRepoCommits, parseGithubUrl } from '../api/githubApi';
import '../styles/ProjectDetail.css';

function ProjectDetail() {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [commits, setCommits] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const res = await getProjects();
                const target = res.data.data.find(p => p.id === parseInt(projectId));
                setProject(target);

                if (target && target.github_url) {
                    const parsed = parseGithubUrl(target.github_url);
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

    if (isLoading) return <div className="loading-screen">프로젝트 분석 중...</div>;
    if (!project) return <div>프로젝트를 찾을 수 없습니다.</div>;

    return (
        <div className="detail-container">
            
            <header className="detail-header">
                <span className="status-badge">Live</span>
                <h1>{project.title}</h1>
                <div className="detail-links">
                    <a href={project.github_url} target="_blank" rel="noreferrer" className="link-btn github">GitHub Repo</a>
                    {project.demo_url && <a href={project.demo_url} target="_blank" rel="noreferrer" className="link-btn demo">Visit Live Site</a>}
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
        </div>
    )
}

export default ProjectDetail