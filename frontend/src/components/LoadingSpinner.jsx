import "../styles/LoadingSpinner.css";

export default function LoadingSpinner({ message = "데이터를 불러오는 중입니다..." }) {
    return (
        <div className="loading-overlay">
            <div className="spinner-wrapper">
                <div className="loading-spinner">
                    <div className="dot1"></div>
                    <div className="dot2"></div>
                </div>
                <p className="loading-text">{message}</p>
            </div>
        </div>
    );
}
