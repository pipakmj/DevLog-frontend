import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Auth.css';

function Signin() {
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Login attempt:", { userEmail, userPassword });
        alert("로그인 시도: " + userEmail);
    };

    return (
        <div className='auth-container'>
            <div className='auth-bg-blob blob-1'></div>
            <div className='auth-bg-blob blob-2'></div>
            <div className='auth-card'>
                <div className='auth-header'>
                    <h1>DevLog</h1>
                    <p>다시 오신 것을 환영합니다!</p>
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
                        />
                    </div>

                    <div className='forgot-password'>
                        <Link to='/forgot-password'>비밀번호를 잊으셨나요?</Link>
                    </div>

                    <button type='submit' className='primary-btn'>
                        로그인
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
