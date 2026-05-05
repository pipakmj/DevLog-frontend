import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { resetPassword } from '../api/authApi';

function ResetPassword() {
    const navigate = useNavigate();
    const resetToken = localStorage.getItem("resetToken");
    const [newPassword, setNewPassword] = useState("");
    const [checkPassword, setCheckPassword] = useState("");
   
    const isPasswordMatch = newPassword === checkPassword;
    if (!resetToken) return <div>잘못된 접근입니다.</div>;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!resetToken) {
            alert("유효하지 않은 접근입니다. 토큰이 없습니다.");
            return;
        }
        try {
            await resetPassword({
                token: resetToken,
                newPassword: newPassword
            });
            alert("비밀번호가 성공적으로 변경되었습니다. 다시 로그인해주세요.");
            localStorage.removeItem("resetToken")
            navigate("/signin");
        } catch (error) {
            alert("토큰이 만료되었거나 올바르지 않습니다."+error);
        }
    };
  return (
      <div className="auth-container">
          <div className='auth-card'>
              <div className='auth-header'>
                  <h1>DevLog</h1>
                  <p>새 비밀번호 설정</p>
              </div>
              <div className='input-group'>
                  <label>비밀번호 *</label>
                  <input
                      type="password"
                      placeholder="새로운 비밀번호"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                  />
              </div>
              <div className='input-group'>
                  <label>비밀번호 확인 *</label>
                  <input
                      type='password'
                      className='auth-input'
                      placeholder='••••••••'
                      required
                      value={checkPassword}
                      onChange={(e) => setCheckPassword(e.target.value)}
                  />
                  {!isPasswordMatch && (
                      <p className="error-message">비밀번호가 일치하지 않습니다</p>
                  )}
              </div>
              <form className='auth-form' onSubmit={handleSubmit}>
                  <button className='primary-btn' type="submit">변경하기</button>
              </form>
          </div>
      </div>
  )
}

export default ResetPassword