export default function FeatureSection() {
    return (
        <section className="feature-section">
            <h2>Features</h2>

            <div className="feature-grid">
                <div className="feature-card">
                    <h3>TIL 기록</h3>
                    <p>공부한 내용을 정리하고 기록할 수 있습니다.</p>
                </div>

                <div className="feature-card">
                    <h3>프로젝트 관리</h3>
                    <p>개발 프로젝트를 포트폴리오로 정리할 수 있습니다.</p>
                </div>

                <div className="feature-card">
                    <h3>태그 시스템</h3>
                    <p>기술 스택별로 글을 정리하고 검색할 수 있습니다.</p>
                </div>
            </div>
        </section>
    );
}