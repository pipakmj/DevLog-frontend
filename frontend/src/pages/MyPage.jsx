import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getMyInfo, updateMyInfo } from '../api/userApi';
import '../styles/MyPage.css';

function MyPage() {
    const { user, login } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // 프로필 정보 상태
    const [userInfo, setUserInfo] = useState({
        email: '',
        nickname: '',
        bio: '',
        github_url: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await getMyInfo();
                setUserInfo(res.data.data);
            } catch (error) {
                console.error("프로필을 불러오는데 실패했습니다.", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await updateMyInfo({
                nickname: userInfo.nickname,
                bio: userInfo.bio,
                github_url: userInfo.github_url
            });

            // 전역 상태(nickname 등) 업데이트
            login({ nickname: userInfo.nickname });
            alert("프로필이 성공적으로 수정되었습니다!");
        } catch (error) {
            console.error("프로필 수정 실패:", error);
            alert("프로필 수정 중 오류가 발생했습니다.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="loading-container">데이터를 불러오는 중...</div>;

    return (
        <div className="mypage-container">
            <div className="mypage-card">
                <div className="mypage-header">
                    <h2>내 프로필 관리</h2>
                    <p>DevLog에서 활동할 때 보여지는 정보를 수정하세요.</p>
                </div>

                <form className="mypage-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>이메일</label>
                        <input type="email" value={userInfo.email} disabled className="readonly-input" />
                        <small>이메일은 변경할 수 없습니다.</small>
                    </div>

                    <div className="input-group">
                        <label>닉네임</label>
                        <input
                            type="text"
                            name="nickname"
                            value={userInfo.nickname}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>한 줄 소개</label>
                        <textarea
                            name="bio"
                            value={userInfo.bio || ''}
                            onChange={handleChange}
                            placeholder="나를 짧게 소개해 보세요."
                            rows="3"
                        />
                    </div>

                    <div className="input-group">
                        <label>GitHub URL</label>
                        <input
                            type="url"
                            name="github_url"
                            value={userInfo.github_url || ''}
                            onChange={handleChange}
                            placeholder="https://github.com/your-id"
                        />
                    </div>

                    <div className="button-group">
                        <button type="submit" className="save-btn" disabled={isSaving}>
                            {isSaving ? "저장 중..." : "정보 수정하기"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default MyPage;