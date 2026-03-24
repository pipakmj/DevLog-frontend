import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Auth.css';
import { signIn } from '../api/authApi';
import { AuthContext } from '../context/AuthContext';

function Signin() {
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const { login } = useContext(AuthContext);

    const handleSubmit = async(e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage("");

        try {
            const res = await signIn({
                email: userEmail,
                password: userPassword,
            })
            console.log("login success", res.data);
            const accessToken = res.data.data?.token
            if (accessToken) {
                localStorage.setItem("accessToken", accessToken);
                login({ nickname: res.data.data.nickname }); 
                alert("로그인 성공!");
                navigate("/");
            } else {
                setErrorMessage("토큰을 받지 못했습니다. 서버 설정을 확인하세요.");
            }
        } catch (error) {
            const message = error.response?.data?.message || "로그인 중 오류가 발생했습니다.";
            setErrorMessage(message);
        } finally { 
            setIsLoading(false);
        }
    };

    return (
        <div className='auth-container'>
            <div className='auth-bg-blob blob-1'></div>
            <div className='auth-bg-blob blob-2'></div>
            <div className='auth-card'>
                <div className='auth-header'>
                    <h1>DevLog</h1>
                    <p>다시 오신 것을 환영합니다!</p>
                    {errorMessage && <div className='error-alert'>{errorMessage}</div>}
                </div>

                <form className='auth-form' onSubmit={handleSubmit}>
                    <div className='input-group'>
                        <label>이메일</label>
                        <input
                            type='email'
                            className='auth-input'
                            placeholder='name@example.com'
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className='input-group'>
                        <label>비밀번호</label>
                        <input
                            type='password'
                            className='auth-input'
                            placeholder='••••••••'
                            value={userPassword}
                            onChange={(e) => setUserPassword(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className='forgot-password'>
                        <Link to='/forgot-password'>비밀번호를 잊으셨나요?</Link>
                    </div>

                    <button
                        type='submit'
                        className='primary-btn'
                        disabled={isLoading}
                    >
                        {isLoading ? "로그인 중..." : "로그인"}
                    </button>
                </form>

                <div className='auth-footer'>
                    계정이 없으신가요?
                    <Link to='/signup'>회원가입</Link>
                </div>
            </div>
        </div>
    );
}

export default Signin;
