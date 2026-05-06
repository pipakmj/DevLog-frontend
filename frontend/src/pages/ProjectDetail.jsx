import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { deleteProject, getDetailProject } from '../api/projectApi';
import { getRepoCommits, parseGithubUrl } from '../api/githubApi';
import { AuthContext } from "../context/AuthContext"
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/ProjectDetail.css';

function ProjectDetail() {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [commits, setCommits] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isCommitsLoading, setIsCommitsLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { isLoggedIn, user } = useContext(AuthContext);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchDetailData = async () => {
            try {
                const res = await getDetailProject(projectId);
                const currentData = res.data.data;
                setProject(currentData);

                if (currentData && currentData.githubUrl) {
                    const parsed = parseGithubUrl(currentData.githubUrl);
                    if (parsed) {
                        const commitData = await getRepoCommits(parsed.owner, parsed.repo, 1);
                        setCommits(commitData);
                        if (commitData.length < 10) setHasMore(false);
                    }
                }
            } catch (error) {
                console.error("데이터로딩 실패:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDetailData();
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

    const loadMoreCommits = async () => {
        if (!project?.githubUrl || isCommitsLoading) return;

        setIsCommitsLoading(true);
        const parsed = parseGithubUrl(project.githubUrl);
        if (parsed) {
            const nextPage = page + 1;
            const newCommits = await getRepoCommits(parsed.owner, parsed.repo, nextPage);

            if (newCommits.length < 10) {
                setHasMore(false);
            }

            setCommits(prev => [...prev, ...newCommits]);
            setPage(nextPage);
        }
        setIsCommitsLoading(false);
    };

    if (isLoading) return <LoadingSpinner message="프로젝트 상세 정보를 불러오는 중..." />;
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

            {project.myRole && (
                <section className="myrole-section">
                    <div className="section-title">
                        <h3>My Role</h3>
                        <div className="title-underline"></div>
                    </div>
                    <p className="project-text">{project.myRole}</p>
                </section>
            )}

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
                        {hasMore && (
                            <div className="timeline-item load-more-item" onClick={loadMoreCommits}>
                                <div className="timeline-node">
                                    <div className="node-dot plus">+</div>
                                </div>
                                <div className="timeline-card load-more-card">
                                    <p>{isCommitsLoading ? "..." : "과거 커밋 더 보기"}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
            {isLoggedIn && user?.userId === project?.userId && (<div className="admin-actions">
                <Link to={`/project/edit/${project.id}`} className="link-btn edit">Edit</Link>
                <button onClick={handleDelete} className="link-btn delete">Delete</button>
            </div>)}

        </div>
    )
}

export default ProjectDetail