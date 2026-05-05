import React, { useState } from 'react'
import '../styles/Auth.css';
import { Link, useNavigate } from 'react-router-dom';
import { findPassword, sendValificationCode } from '../api/authApi';

function FindPassword() {
    const [userEmail, setUserEmail] = useState("");
    const [valificationCode, setValificationCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isSended, setIsSended] = useState(false);

    const navigate = useNavigate();

    const handleFindPassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage("");
        try {
            await findPassword(userEmail);
            alert("해당 이메일에 인증코드를 보냈습니다.")
            setIsSended(true);
        } catch (error) {
            console.error(error);
            const message = error.response?.data?.message || "비밀번호 찾기 중 오류가 발생했습니다.";
            setErrorMessage(message);
        } finally { 
            setIsLoading(false);
        }
    };

    const handleValidateCode = async (e) => { 
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage("");
        try {
            const res = await sendValificationCode({
                email: userEmail,
                code: valificationCode
            });
            localStorage.setItem("resetToken", res.data.data);
            alert("인증되었습니다.")
            navigate("/passwordreset")
        } catch (error) {
            console.error(error);
            const message = error.response?.data?.message || "비밀번호 찾기 중 오류가 발생했습니다.";
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
                  <p>비밀전호 찾기</p>
              </div>

              <form className='auth-form' >
                        <div className='input-group'>
                        <label>이메일 *</label>
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
                  {isSended && <div className='input-group'>
                      <label>인증 번호 *</label>
                      <input
                          type='text'
                          inputMode='numeric'
                          className='auth-input'
                          placeholder='••••••'
                          value={valificationCode}
                          onChange={(e) => setValificationCode(e.target.value)}
                          required
                          disabled={isLoading}
                      />
                  </div>}
                  {errorMessage && <div className='error-alert'>{errorMessage}</div>}
                  {isSended ? (
                      <button
                      type='submit'
                      className='primary-btn'
                      onClick={handleValidateCode}
                      disabled={isLoading}
                  >
                      인증 하기
                      </button>
                  ) : (
                      <button
                      type='submit'
                      className='primary-btn'
                      onClick={handleFindPassword}
                      disabled={isLoading}
                  >
                      인증번호 보내기
                      </button>
                  )}
              </form>

              <div className='auth-footer'>
                  로그인하러 가기
                  <Link to='/signin'>로그인</Link>
              </div>
          </div>
    </div>
  )
}

export default FindPassword