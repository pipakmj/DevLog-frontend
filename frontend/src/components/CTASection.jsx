import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function CTASection() {
    const navigate = useNavigate();
    const { isLoggedIn } = useContext(AuthContext);

    const handleStart = () => {
        if (isLoggedIn) {
            navigate("/projectlist");
        } else {
            navigate("/signup");
        }
    };

    return (
        <section className="cta">
            <h2>지금 DevLog를 시작해보세요</h2>
            <p>당신의 개발 기록을 남기고 성장 과정을 관리하세요.</p>

            <button
                className="primary-btn"
                type="button"
                onClick={handleStart}
            >
                {isLoggedIn ? "대시보드 바로가기" : "지금 가입하기"}
            </button>
        </section>
    );
}