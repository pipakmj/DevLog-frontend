import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function HeroSection() { 
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
        <section className="hero">
            <h1>DevLog</h1>
            <p>
                개발자의 공부 기록과 프로젝트를
                <br />
                정리하고 공유하는 공간
            </p>
            <div className="cta-group">
                <button className="primary-btn" onClick={handleStart}>시작하기</button>
                <button className="secondary-btn" onClick={() => { navigate("/projectlist") }}>프로젝트 보기</button>
            </div>
        </section>
    );
}