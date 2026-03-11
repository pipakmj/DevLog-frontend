import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Auth.css';

function Signup() {
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [checkPassword, setCheckPassword] = useState("");
    const [userNickname, setUserNickname] = useState("");
    const [userGithubUrl, setUserGithubUrl] = useState("");
    const [isAgreed, setIsAgreed] = useState(false);

    const isPasswordMatch = userPassword === checkPassword;
    const canSubmit = userEmail && userPassword && isPasswordMatch && userNickname && isAgreed;

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!canSubmit) {
            alert("모든 필수 항목을 입력하고 약관에 동의해주세요.");
            return;
        }

        console.log("Signup attempt:", { userEmail, userNickname, userGithubUrl });
        alert("회원가입 요청이 전송되었습니다!");
    }

    return (
        <div className='auth-container'>
            <div className='auth-bg-blob blob-1'></div>
            <div className='auth-bg-blob blob-2'></div>
            <div className='auth-card'>
                <div className='auth-header'>
                    <h1>DevLog</h1>
                    <p>새로운 여정을 시작해보세요</p>
                </div>

                <form className='auth-form' onSubmit={handleSubmit}>
                    <div className='input-group'>
                        <label>이메일 *</label>
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
                        <label>비밀번호 *</label>
                        <input
                            type='password'
                            className='auth-input'
                            placeholder='••••••••'
                            value={userPassword}
                            onChange={(e) => setUserPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className='input-group'>
                        <label>비밀번호 확인 *</label>
                        <input
                            type='password'
                            className='auth-input'
                            placeholder='••••••••'
                            value={checkPassword}
                            onChange={(e) => setCheckPassword(e.target.value)}
                            required
                        />
                        {checkPassword && !isPasswordMatch && (
                            <p className="error-message">비밀번호가 일치하지 않습니다</p>
                        )}
                    </div>

                    <div className='input-group'>
                        <label>닉네임 *</label>
                        <input
                            type='text'
                            className='auth-input'
                            placeholder='멋진 닉네임'
                            value={userNickname}
                            onChange={(e) => setUserNickname(e.target.value)}
                            required
                        />
                    </div>

                    <div className='input-group'>
                        <label>깃허브 주소 (선택)</label>
                        <input
                            type='url'
                            className='auth-input'
                            placeholder='https://github.com/username'
                            value={userGithubUrl}
                            onChange={(e) => setUserGithubUrl(e.target.value)}
                        />
                    </div>

                    <div className='checkbox-group'>
                        <input
                            id="terms"
                            type='checkbox'
                            checked={isAgreed}
                            onChange={(e) => setIsAgreed(e.target.checked)}
                        />
                        <label htmlFor="terms">
                            이용약관 및 개인정보 처리 방침에 동의합니다. *
                        </label>
                    </div>

                    <button
                        type='submit'
                        className='primary-btn'
                        disabled={!canSubmit}
                    >
                        계정 만들러 가기
                    </button>
                </form>

                <div className='auth-footer'>
                    이미 계정이 있으신가요?
                    <Link to='/signin'>로그인</Link>
                </div>
            </div>
        </div>
    );
}

export default Signup;
