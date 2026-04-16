import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isLoggedIn, isLoading } = useContext(AuthContext);
    const location = useLocation();

    // 세션 복원 중(로딩 중)일 때는 아무것도 보여주지 않거나 로딩 스피너를 보여줍니다.
    if (isLoading) {
        return <div className="loading-screen">인증 확인 중...</div>;
    }

    if (!isLoggedIn) {
        // 원래 가려던 페이지 정보를 state에 담아 로그인 페이지로 보냅니다.
        return <Navigate to="/signin" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
