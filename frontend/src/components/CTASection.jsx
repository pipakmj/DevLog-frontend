import { useNavigate } from "react-router-dom";

export default function CTASection() {
    const navigate = useNavigate();
    return (
        <section className="cta">
            <h2>지금 DevLog를 시작해보세요</h2>
            <p>당신의 개발 기록을 남기고 성장 과정을 관리하세요.</p>

            <button
                className="primary-btn"
                type="button"
                onClick={() => navigate("/signup")}
            >
                회원가입
            </button>
        </section>
    );
}