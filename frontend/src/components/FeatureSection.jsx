export default function FeatureSection() {
    return (
        <section id="features" className="feature-section">
            <h2>Features</h2>

            <div className="feature-grid">
                <div className="feature-card">
                    <div className="icon">🚀</div>
                    <h3>Development Journey</h3>
                    <p>프로젝트별 GitHub 커밋 이력을 타임라인으로 확인하고 성장의 과정을 기록하세요.</p>
                </div>
                <div className="feature-card">
                    <div className="icon">📂</div>
                    <h3>Portfolio Hub</h3>
                    <p>진행한 프로젝트의 목표, 기술 스택, 결과물을 체계적인 포트폴리오로 관리합니다.</p>
                </div>
                <div className="feature-card">
                    <div className="icon">📝</div>
                    <h3>Tech Log</h3>
                    <p>마크다운 에디터를 사용하여 코드 하이라이팅이 포함된 전문적인 기술 로그를 작성하세요.</p>
                </div>
            </div>
        </section>
    );
}