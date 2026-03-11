export default function HeroSection() { 
    return (
        <section className="hero">
            <h1>DevLog</h1>
            <p>
                개발자의 공부 기록과 프로젝트를
                <br />
                정리하고 공유하는 공간
            </p>
            <div className="cta-group">
                <button className="primary-btn">시작하기</button>
                <button className="secondary-btn">프로젝트 보기</button>
            </div>
        </section>
    );
}