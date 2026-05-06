import React, { useState } from 'react';
import '../styles/Terms.css';

function Terms() {
    const [activeTab, setActiveTab] = useState('terms');

    return (
        <div className='terms-container'>
            <div className='terms-card'>
                <div className='terms-header'>
                    <h1>약관 및 정책</h1>
                    <p>DevLog 서비스 이용을 위한 약관 및 정책입니다.</p>
                </div>

                <div className='terms-tabs'>
                    <button
                        className={`terms-tab ${activeTab === 'terms' ? 'active' : ''}`}
                        onClick={() => setActiveTab('terms')}
                    >
                        이용약관
                    </button>
                    <button
                        className={`terms-tab ${activeTab === 'privacy' ? 'active' : ''}`}
                        onClick={() => setActiveTab('privacy')}
                    >
                        개인정보 처리방침
                    </button>
                </div>

                <div className='terms-content'>
                    {activeTab === 'terms' ? <TermsContent /> : <PrivacyContent />}
                </div>
            </div>
        </div>
    );
}

function TermsContent() {
    return (
        <div className='terms-body'>
            <section>
                <h2>제1조 (목적)</h2>
                <p>
                    본 약관은 DevLog(이하 "서비스")가 제공하는 개발 블로그 및 프로젝트 관리 서비스의
                    이용과 관련하여 서비스와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을
                    규정함을 목적으로 합니다.
                </p>
            </section>

            <section>
                <h2>제2조 (정의)</h2>
                <ol>
                    <li>"서비스"란 DevLog가 제공하는 개발 블로그 작성, 프로젝트 관리, GitHub 연동 분석 등의 온라인 서비스를 말합니다.</li>
                    <li>"이용자"란 본 약관에 따라 서비스를 이용하는 회원을 말합니다.</li>
                    <li>"회원"이란 서비스에 가입하여 이메일 인증을 완료한 자를 말합니다.</li>
                    <li>"게시물"이란 회원이 서비스에 게시한 글, 댓글, 이미지 등 일체의 콘텐츠를 말합니다.</li>
                </ol>
            </section>

            <section>
                <h2>제3조 (약관의 효력 및 변경)</h2>
                <ol>
                    <li>본 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력이 발생합니다.</li>
                    <li>서비스는 합리적인 사유가 발생할 경우 약관을 변경할 수 있으며, 변경된 약관은 공지 후 적용됩니다.</li>
                </ol>
            </section>

            <section>
                <h2>제4조 (회원가입 및 계정)</h2>
                <ol>
                    <li>회원가입은 이메일 인증을 통해 이루어지며, 허위 정보로 가입한 경우 서비스 이용이 제한될 수 있습니다.</li>
                    <li>회원은 자신의 계정 정보를 안전하게 관리할 책임이 있습니다.</li>
                    <li>비밀번호는 영문과 숫자를 포함하여 8자 이상으로 설정해야 합니다.</li>
                </ol>
            </section>

            <section>
                <h2>제5조 (서비스의 제공)</h2>
                <p>서비스는 다음과 같은 기능을 제공합니다:</p>
                <ol>
                    <li>개발 블로그 글 작성 및 관리</li>
                    <li>프로젝트 등록 및 관리</li>
                    <li>GitHub 저장소 연동 및 AI 분석</li>
                    <li>댓글 및 소통 기능</li>
                    <li>기타 서비스가 추가로 제공하는 기능</li>
                </ol>
            </section>

            <section>
                <h2>제6조 (게시물의 관리)</h2>
                <ol>
                    <li>회원이 작성한 게시물의 저작권은 해당 회원에게 귀속됩니다.</li>
                    <li>서비스는 관련 법령에 위반되거나 타인의 권리를 침해하는 게시물을 삭제하거나 게시를 거부할 수 있습니다.</li>
                </ol>
            </section>

            <section>
                <h2>제7조 (서비스 이용 제한)</h2>
                <p>다음에 해당하는 경우 서비스 이용이 제한될 수 있습니다:</p>
                <ol>
                    <li>타인의 정보를 도용한 경우</li>
                    <li>서비스의 정상적인 운영을 방해한 경우</li>
                    <li>불법적인 목적으로 서비스를 이용한 경우</li>
                    <li>기타 관련 법령이나 약관을 위반한 경우</li>
                </ol>
            </section>

            <section>
                <h2>제8조 (면책사항)</h2>
                <ol>
                    <li>서비스는 천재지변, 전쟁 등 불가항력적 사유로 서비스를 제공할 수 없는 경우 책임을 면합니다.</li>
                    <li>서비스는 회원의 귀책사유로 인한 서비스 이용 장애에 대해 책임을 지지 않습니다.</li>
                </ol>
            </section>

            <p className='terms-notice'>본 약관은 2026년 5월 6일부터 시행됩니다.</p>
        </div>
    );
}

function PrivacyContent() {
    return (
        <div className='terms-body'>
            <section>
                <h2>1. 개인정보의 수집 및 이용 목적</h2>
                <p>DevLog는 다음의 목적을 위하여 개인정보를 처리합니다:</p>
                <ol>
                    <li><strong>회원 관리:</strong> 회원제 서비스 제공을 위한 본인 확인, 개인 식별, 가입 의사 확인</li>
                    <li><strong>서비스 제공:</strong> 블로그 글 작성, 프로젝트 관리, GitHub 연동 서비스 제공</li>
                    <li><strong>서비스 개선:</strong> 서비스 이용 통계 분석 및 서비스 품질 향상</li>
                </ol>
            </section>

            <section>
                <h2>2. 수집하는 개인정보 항목</h2>
                <table className='terms-table'>
                    <thead>
                        <tr>
                            <th>구분</th>
                            <th>수집 항목</th>
                            <th>수집 목적</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>필수</td>
                            <td>이메일, 비밀번호, 닉네임</td>
                            <td>회원 가입 및 서비스 이용</td>
                        </tr>
                        <tr>
                            <td>선택</td>
                            <td>GitHub 주소, 자기소개</td>
                            <td>프로필 정보 표시 및 GitHub 연동</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section>
                <h2>3. 개인정보의 보유 및 이용 기간</h2>
                <ol>
                    <li>회원 탈퇴 시까지 보유하며, 탈퇴 즉시 파기합니다.</li>
                    <li>단, 관련 법령에 의해 보존이 필요한 경우 해당 기간 동안 보관합니다.</li>
                </ol>
            </section>

            <section>
                <h2>4. 개인정보의 제3자 제공</h2>
                <p>
                    DevLog는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다.
                    다만, 법령의 규정에 의하거나 수사 목적으로 법령에 정해진 절차와 방법에 따라
                    수사기관의 요구가 있는 경우는 예외로 합니다.
                </p>
            </section>

            <section>
                <h2>5. 개인정보의 안전성 확보 조치</h2>
                <p>DevLog는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다:</p>
                <ol>
                    <li><strong>비밀번호 암호화:</strong> 비밀번호는 단방향 암호화하여 저장 및 관리합니다.</li>
                    <li><strong>인증 토큰:</strong> JWT 기반 토큰 인증 방식을 사용하여 안전한 접근을 보장합니다.</li>
                    <li><strong>접근 제한:</strong> 개인정보에 대한 접근 권한을 최소한으로 관리합니다.</li>
                </ol>
            </section>

            <section>
                <h2>6. 이용자의 권리</h2>
                <p>이용자는 언제든지 다음의 권리를 행사할 수 있습니다:</p>
                <ol>
                    <li>개인정보 열람 요구</li>
                    <li>개인정보 수정 요구</li>
                    <li>회원 탈퇴를 통한 개인정보 삭제 요구</li>
                </ol>
            </section>

            <section>
                <h2>7. 개인정보 보호책임자</h2>
                <p>
                    개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 이용자의
                    불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
                </p>
                <ul>
                    <li>담당자: DevLog 운영팀</li>
                    <li>연락처: 서비스 내 문의</li>
                </ul>
            </section>

            <p className='terms-notice'>본 개인정보 처리방침은 2026년 5월 6일부터 시행됩니다.</p>
        </div>
    );
}

export default Terms;
