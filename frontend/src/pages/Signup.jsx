import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Auth.css';
import { signUp, signUpSendCode, signUpVerifyCode } from '../api/authApi';

function Signup() {
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [checkPassword, setCheckPassword] = useState("");
    const [userNickname, setUserNickname] = useState("");
    const [userGithubUrl, setUserGithubUrl] = useState("");
    const [isAgreed, setIsAgreed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [isSendingCode, setIsSendingCode] = useState(false);
    const [timeLeft, setTimeLeft] = useState(300);

    const navigate = useNavigate();

    const isPasswordMatch = userPassword === checkPassword;
    const isPasswordValid = userPassword.length >= 8 && /[a-zA-Z]/.test(userPassword) && /[0-9]/.test(userPassword);
    const canSubmit = userEmail && userPassword && isPasswordValid && isPasswordMatch && userNickname && isAgreed && isEmailVerified;

    useEffect(() => {
        let timer;
        if (isCodeSent && !isEmailVerified && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isCodeSent, isEmailVerified, timeLeft]);

    const handleSendVerificationCode = async () => {
        try {
            setIsSendingCode(true);
            setErrorMessage("");

            await signUpSendCode(userEmail);

            setIsCodeSent(true);
            setTimeLeft(300);
            setVerificationCode("");
            alert("인증번호가 전송되었습니다.");
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "이메일 전송에 실패했습니다.");
        } finally {
            setIsSendingCode(false);
        }
    };

    const handleVerifyCode = async () => {
        if (timeLeft === 0) {
            setErrorMessage("인증 시간이 만료되었습니다. 코드를 재전송해주세요.");
            return;
        }
        try {
            setIsLoading(true);
            setErrorMessage("");

            const res = await signUpVerifyCode({
                email: userEmail,
                code: verificationCode
            })
            if (res.data.data) {
                setIsEmailVerified(true);
            } else {
                setErrorMessage("잘못된 인증 코드입니다.");
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "인증 코드 검증에 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!canSubmit) {
            alert("모든 필수 항목을 입력하고 약관에 동의해주세요.");
            return;
        }
        setIsLoading(true);
        setErrorMessage("");

        try {
            const res = await signUp({
                email: userEmail,
                password: userPassword,
                nickname: userNickname,
                bio: "",
                github_url: userGithubUrl
            })
            console.log("sign up success", res.data);
            navigate("/signin")
        } catch (error) {
            const message = error.response?.data?.message || "회원가입 중 오류가 발생했습니다.";
            setErrorMessage(message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className='auth-container'>
            <div className='auth-bg-blob blob-1'></div>
            <div className='auth-bg-blob blob-2'></div>
            <div className='auth-card'>
                <div className='auth-header'>
                    <h1>DevLog</h1>
                    <p>새로운 여정을 시작해보세요</p>
                    {errorMessage && <div className='error-alert'>{errorMessage}</div>}
                </div>

                <form className='auth-form' onSubmit={handleSubmit}>
                    <div className='input-group'>
                        <label>이메일 *</label>
                        <div className='email-verify-row'>
                            <input
                                type='email'
                                className='auth-input'
                                placeholder='name@example.com'
                                value={userEmail}
                                onChange={(e) => setUserEmail(e.target.value)}
                                required
                                disabled={isLoading || isEmailVerified}
                            />
                            <button
                                type="button"
                                className={`verify-send-btn ${isEmailVerified ? 'verified' : ''}`}
                                onClick={handleSendVerificationCode}
                                disabled={!userEmail || isEmailVerified || isSendingCode}
                            >
                                {isSendingCode ? "전송 중..." : isEmailVerified ? "인증완료" : isCodeSent ? "재전송" : "코드 전송"}
                            </button>
                        </div>
                        {isEmailVerified && (
                            <p className="success-message">✅ 이메일 인증이 완료되었습니다.</p>
                        )}
                    </div>

                    {isCodeSent && !isEmailVerified && (
                        <div className='input-group'>
                            <label>인증 번호 *</label>
                            <div className='email-verify-row'>
                                <input
                                    type='text'
                                    className='auth-input'
                                    placeholder='6자리 인증번호 입력'
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    disabled={isLoading}
                                    maxLength={6}
                                />
                                <button
                                    type="button"
                                    className='verify-confirm-btn'
                                    onClick={handleVerifyCode}
                                    disabled={!verificationCode || isLoading}
                                >
                                    확인
                                </button>
                            </div>
                            {timeLeft > 0 ? (
                                <p className={`timer-text ${timeLeft <= 60 ? 'timer-warning' : ''}`}>
                                    남은 시간: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                                </p>
                            ) : (
                                <p className="error-message">인증 시간이 만료되었습니다. 코드를 재전송해주세요.</p>
                            )}
                        </div>
                    )}

                    <div className='input-group'>
                        <label>비밀번호 *</label>
                        <input
                            type='password'
                            className='auth-input'
                            placeholder='영문, 숫자 포함 8자 이상'
                            value={userPassword}
                            onChange={(e) => setUserPassword(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                        {userPassword && !isPasswordValid && (
                            <p className="error-message">비밀번호는 영문, 숫자를 포함하여 8자 이상이어야 합니다.</p>
                        )}
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
                            disabled={isLoading}
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
                            disabled={isLoading}
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
                            disabled={isLoading}
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
                            <Link to='/terms' target='_blank' className='terms-link'>이용약관 및 개인정보 처리방침</Link>에 동의합니다. *
                        </label>
                    </div>

                    <button
                        type='submit'
                        className='primary-btn'
                        disabled={!canSubmit || isLoading}
                    >
                        {isLoading ? "처리 중..." : "계정 만들러 가기"}
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
