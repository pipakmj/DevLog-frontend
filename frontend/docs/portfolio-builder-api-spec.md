# 포트폴리오 빌더 API 명세서

프론트엔드 포트폴리오 빌더 화면에서 필요한 백엔드 API 계약 초안입니다.

## 공통 규칙

- Base URL: `VITE_API_BASE_URL`
- 인증: 로그인 후 발급된 access token을 `Authorization: Bearer {accessToken}` 헤더로 전달
- 쿠키: refresh token 사용을 위해 `withCredentials: true`
- Content-Type: 기본 `application/json`
- 이미지: 프론트에서 Cloudinary 업로드 후 반환된 URL을 백엔드에 저장
- 공통 응답 포맷:

```json
{
  "success": true,
  "message": "요청이 성공했습니다.",
  "data": {}
}
```

- 공통 에러 포맷:

```json
{
  "success": false,
  "message": "에러 메시지",
  "code": "ERROR_CODE"
}
```

## 데이터 모델

### Portfolio

```json
{
  "id": 1,
  "projectId": 10,
  "projectName": "DevLog",
  "overview": "프로젝트 목적, 대상 사용자, 핵심 가치 설명",
  "roles": "기획 100%\n프론트엔드 100%",
  "techStack": ["React", "Spring Boot", "MySQL"],
  "features": [
    {
      "title": "AI 피드백",
      "description": "작성 내용을 분석해 개선점을 제공합니다."
    }
  ],
  "troubleshoots": [
    {
      "issue": "PDF 변환 시 이미지 비율 깨짐",
      "resolution": "object-fit과 고정 컨테이너 비율을 적용했습니다."
    }
  ],
  "metrics": "초기 로딩 속도 30% 개선",
  "images": {
    "architecture": {
      "imageUrl": "https://res.cloudinary.com/.../architecture.png",
      "description": "시스템 구성과 API 흐름 설명"
    },
    "erd": {
      "imageUrl": "https://res.cloudinary.com/.../erd.png",
      "description": "주요 테이블 관계 설명"
    },
    "ui": [
      {
        "imageUrl": "https://res.cloudinary.com/.../dashboard.png",
        "description": "대시보드 화면 설명"
      }
    ]
  },
  "status": "DRAFT",
  "isPublic": false,
  "shareToken": null,
  "createdAt": "2026-06-16T10:00:00Z",
  "updatedAt": "2026-06-16T10:10:00Z"
}
```

### PortfolioStatus

```text
DRAFT     임시 저장
COMPLETED 완료 저장
PUBLISHED 공유 공개
```

## API 목록

| 기능 | Method | 요청 URL |
| --- | --- | --- |
| 빌더용 프로젝트 목록 조회 | GET | `/api/portfolio-builder/projects` |
| 포트폴리오 단건 조회 | GET | `/api/portfolios/{portfolioId}` |
| 프로젝트 기준 포트폴리오 조회 | GET | `/api/projects/{projectId}/portfolio` |
| 포트폴리오 임시 저장/생성 | POST | `/api/portfolios` |
| 포트폴리오 수정 | PATCH | `/api/portfolios/{portfolioId}` |
| 포트폴리오 삭제 | DELETE | `/api/portfolios/{portfolioId}` |
| AI 진단/개선 제안 | POST | `/api/portfolios/ai-feedback` |
| PDF 미리보기 데이터 생성 | POST | `/api/portfolios/preview` |
| PDF 다운로드 | POST | `/api/portfolios/{portfolioId}/pdf` |
| 공유 링크 생성 | POST | `/api/portfolios/{portfolioId}/share` |
| 공유 포트폴리오 조회 | GET | `/api/portfolios/share/{shareToken}` |

## 1. 빌더용 프로젝트 목록 조회

프론트에서 포트폴리오 빌더 진입 시 사용자가 작성한 프로젝트 목록을 select 옵션으로 표시하기 위한 API입니다.

- Method: `GET`
- URL: `/api/portfolio-builder/projects`
- 인증: 필요

### Query Parameters

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| page | number | 아니오 | 기본값 `0` |
| size | number | 아니오 | 기본값 `20` |

### Response `200`

```json
{
  "success": true,
  "message": "프로젝트 목록 조회 성공",
  "data": {
    "content": [
      {
        "projectId": 10,
        "projectName": "DevLog",
        "thumbnailUrl": "https://res.cloudinary.com/.../thumb.png",
        "githubUrl": "https://github.com/user/devlog",
        "demoUrl": "https://devlog.example.com",
        "techStack": ["React", "Spring Boot", "MySQL"],
        "hasPortfolio": true,
        "portfolioId": 1
      }
    ],
    "page": 0,
    "size": 20,
    "totalElements": 1,
    "totalPages": 1,
    "last": true
  }
}
```

## 2. 포트폴리오 단건 조회

- Method: `GET`
- URL: `/api/portfolios/{portfolioId}`
- 인증: 필요

### Path Parameters

| 이름 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| portfolioId | number | 예 | 포트폴리오 ID |

### Response `200`

```json
{
  "success": true,
  "message": "포트폴리오 조회 성공",
  "data": {
    "id": 1,
    "projectId": 10,
    "projectName": "DevLog",
    "overview": "DevLog는 개발자의 학습 기록과 프로젝트 관리를 돕는 플랫폼입니다.",
    "roles": "기획 100%\n프론트엔드 100%",
    "techStack": ["React", "Spring Boot", "MySQL"],
    "features": [
      {
        "title": "포트폴리오 PDF 미리보기",
        "description": "작성한 내용을 PDF 형태의 문서 레이아웃으로 확인할 수 있습니다."
      }
    ],
    "troubleshoots": [
      {
        "issue": "PDF 변환 시 이미지 비율 깨짐",
        "resolution": "이미지 컨테이너 비율과 object-fit 속성을 조정했습니다."
      }
    ],
    "metrics": "초기 로딩 속도 30% 개선",
    "images": {
      "architecture": {
        "imageUrl": "https://res.cloudinary.com/.../architecture.png",
        "description": "React, Spring Boot, MySQL 기반 3-tier 구조"
      },
      "erd": {
        "imageUrl": null,
        "description": ""
      },
      "ui": []
    },
    "status": "DRAFT",
    "isPublic": false,
    "shareToken": null,
    "createdAt": "2026-06-16T10:00:00Z",
    "updatedAt": "2026-06-16T10:10:00Z"
  }
}
```

## 3. 프로젝트 기준 포트폴리오 조회

프로젝트 선택 시 이미 저장된 포트폴리오가 있으면 불러오고, 없으면 프로젝트 기본 정보를 기반으로 초기값을 내려줍니다.

- Method: `GET`
- URL: `/api/projects/{projectId}/portfolio`
- 인증: 필요

### Response `200`

```json
{
  "success": true,
  "message": "프로젝트 포트폴리오 조회 성공",
  "data": {
    "exists": true,
    "portfolio": {
      "id": 1,
      "projectId": 10,
      "projectName": "DevLog",
      "overview": "프로젝트 개요",
      "roles": "프론트엔드 100%",
      "techStack": ["React"],
      "features": [],
      "troubleshoots": [],
      "metrics": "",
      "images": {
        "architecture": { "imageUrl": null, "description": "" },
        "erd": { "imageUrl": null, "description": "" },
        "ui": []
      },
      "status": "DRAFT",
      "isPublic": false,
      "shareToken": null
    }
  }
}
```

## 4. 포트폴리오 임시 저장/생성

- Method: `POST`
- URL: `/api/portfolios`
- 인증: 필요

### Request Body

```json
{
  "projectId": 10,
  "overview": "프로젝트 목적, 대상 사용자, 핵심 가치 설명",
  "roles": "기획 100%\n프론트엔드 100%",
  "techStack": ["React", "Spring Boot", "MySQL"],
  "features": [
    {
      "title": "AI 피드백",
      "description": "작성 내용을 분석해 개선점을 제공합니다."
    }
  ],
  "troubleshoots": [
    {
      "issue": "PDF 변환 시 이미지 비율 깨짐",
      "resolution": "object-fit과 고정 컨테이너 비율을 적용했습니다."
    }
  ],
  "metrics": "초기 로딩 속도 30% 개선",
  "images": {
    "architecture": {
      "imageUrl": "https://res.cloudinary.com/.../architecture.png",
      "description": "시스템 구성 설명"
    },
    "erd": {
      "imageUrl": null,
      "description": ""
    },
    "ui": [
      {
        "imageUrl": "https://res.cloudinary.com/.../dashboard.png",
        "description": "대시보드 화면 설명"
      }
    ]
  },
  "status": "DRAFT"
}
```

### Validation

| 필드 | 규칙 |
| --- | --- |
| projectId | 필수 |
| overview | `COMPLETED` 저장 시 필수 |
| roles | `COMPLETED` 저장 시 필수 |
| techStack | `COMPLETED` 저장 시 1개 이상 필수 |
| features | `COMPLETED` 저장 시 1개 이상 필수 |
| troubleshoots | `COMPLETED` 저장 시 1개 이상 필수 |
| metrics | `COMPLETED` 저장 시 필수 |
| images | 선택 |

### Response `201`

```json
{
  "success": true,
  "message": "포트폴리오 저장 성공",
  "data": {
    "portfolioId": 1,
    "status": "DRAFT",
    "updatedAt": "2026-06-16T10:10:00Z"
  }
}
```

## 5. 포트폴리오 수정

- Method: `PATCH`
- URL: `/api/portfolios/{portfolioId}`
- 인증: 필요

### Request Body

`POST /api/portfolios`와 동일하며, 변경된 값 전체를 전달합니다.

```json
{
  "overview": "수정된 프로젝트 개요",
  "roles": "프론트엔드 100%",
  "techStack": ["React", "Spring Boot"],
  "features": [
    {
      "title": "PDF 다운로드",
      "description": "포트폴리오를 PDF로 다운로드합니다."
    }
  ],
  "troubleshoots": [
    {
      "issue": "PDF 이미지 렌더링 지연",
      "resolution": "이미지 프리로드 후 PDF 생성을 호출했습니다."
    }
  ],
  "metrics": "PDF 생성 실패율 0%로 개선",
  "images": {
    "architecture": {
      "imageUrl": "https://res.cloudinary.com/.../architecture.png",
      "description": "시스템 구조 설명"
    },
    "erd": {
      "imageUrl": null,
      "description": ""
    },
    "ui": []
  },
  "status": "COMPLETED"
}
```

### Response `200`

```json
{
  "success": true,
  "message": "포트폴리오 수정 성공",
  "data": {
    "portfolioId": 1,
    "status": "COMPLETED",
    "updatedAt": "2026-06-16T10:20:00Z"
  }
}
```

## 6. 포트폴리오 삭제

- Method: `DELETE`
- URL: `/api/portfolios/{portfolioId}`
- 인증: 필요

### Response `200`

```json
{
  "success": true,
  "message": "포트폴리오 삭제 성공",
  "data": {
    "portfolioId": 1
  }
}
```

## 7. AI 진단/개선 제안

현재 화면의 "AI 피드백 및 내용 진단" 버튼에서 호출합니다. 저장 전 입력 중인 값으로도 호출할 수 있어야 합니다.

- Method: `POST`
- URL: `/api/portfolios/ai-feedback`
- 인증: 필요
- Timeout 권장: `60000ms`

### Request Body

```json
{
  "projectId": 10,
  "overview": "프로젝트 개요",
  "roles": "프론트엔드 100%",
  "techStack": ["React", "Spring Boot"],
  "features": [
    {
      "title": "AI 피드백",
      "description": "작성 내용을 분석합니다."
    }
  ],
  "troubleshoots": [],
  "metrics": "",
  "images": {
    "architecture": {
      "imageUrl": null,
      "description": ""
    },
    "erd": {
      "imageUrl": null,
      "description": ""
    },
    "ui": []
  }
}
```

### Response `200`

```json
{
  "success": true,
  "message": "AI 진단 성공",
  "data": {
    "score": 78,
    "missingSections": ["troubleshoots", "metrics"],
    "suggestions": [
      "성과/지표 영역에 정량적인 개선 수치를 추가하면 전문성이 높아집니다.",
      "트러블슈팅에는 문제 원인, 해결 과정, 결과를 함께 작성해 주세요."
    ],
    "autoCompletedFields": {
      "metrics": "기능 개선 후 초기 로딩 속도와 사용자 경험이 개선되었습니다.",
      "troubleshoots": [
        {
          "issue": "초기 로딩 속도 저하",
          "resolution": "코드 스플리팅과 이미지 최적화를 적용해 초기 로딩 시간을 개선했습니다."
        }
      ]
    }
  }
}
```

## 8. PDF 미리보기 데이터 생성

프론트가 PDF 미리보기 모달을 열기 전에 서버에서 렌더링용 데이터를 정규화받고 싶을 때 사용합니다. 현재 UI 구조상 프론트 렌더링만으로도 가능하지만, 백엔드가 PDF 템플릿 기준 데이터를 보정한다면 이 API가 필요합니다.

- Method: `POST`
- URL: `/api/portfolios/preview`
- 인증: 필요

### Request Body

```json
{
  "portfolioId": 1,
  "projectName": "DevLog",
  "overview": "프로젝트 개요",
  "roles": "프론트엔드 100%",
  "techStack": ["React", "Spring Boot"],
  "features": [],
  "troubleshoots": [],
  "metrics": "",
  "images": {
    "architecture": { "imageUrl": null, "description": "" },
    "erd": { "imageUrl": null, "description": "" },
    "ui": []
  }
}
```

### Response `200`

```json
{
  "success": true,
  "message": "PDF 미리보기 데이터 생성 성공",
  "data": {
    "title": "DevLog",
    "subtitle": "Project Portfolio Report",
    "generatedAt": "2026-06-16T10:30:00Z",
    "sections": [
      {
        "type": "SUMMARY",
        "title": "1. Executive Summary",
        "content": "프로젝트 개요"
      },
      {
        "type": "TECH_STACK",
        "title": "2. Technology Stack",
        "items": ["React", "Spring Boot"]
      }
    ]
  }
}
```

## 9. PDF 다운로드

백엔드에서 PDF 파일을 생성해 내려주는 API입니다.

- Method: `POST`
- URL: `/api/portfolios/{portfolioId}/pdf`
- 인증: 필요
- Response Type: `blob`

### Request Body

```json
{
  "fileName": "DevLog-portfolio.pdf"
}
```

### Response `200`

- Header: `Content-Type: application/pdf`
- Header: `Content-Disposition: attachment; filename="DevLog-portfolio.pdf"`
- Body: PDF binary

## 10. 공유 링크 생성

- Method: `POST`
- URL: `/api/portfolios/{portfolioId}/share`
- 인증: 필요

### Request Body

```json
{
  "isPublic": true
}
```

### Response `200`

```json
{
  "success": true,
  "message": "공유 링크 생성 성공",
  "data": {
    "portfolioId": 1,
    "isPublic": true,
    "shareToken": "pf_7f9a1c2e",
    "shareUrl": "https://devlog.example.com/portfolio/share/pf_7f9a1c2e"
  }
}
```

## 11. 공유 포트폴리오 조회

로그인하지 않은 사용자가 공유 링크로 접근할 때 사용합니다.

- Method: `GET`
- URL: `/api/portfolios/share/{shareToken}`
- 인증: 불필요

### Response `200`

```json
{
  "success": true,
  "message": "공유 포트폴리오 조회 성공",
  "data": {
    "id": 1,
    "projectName": "DevLog",
    "overview": "프로젝트 개요",
    "roles": "프론트엔드 100%",
    "techStack": ["React", "Spring Boot"],
    "features": [],
    "troubleshoots": [],
    "metrics": "",
    "images": {
      "architecture": { "imageUrl": null, "description": "" },
      "erd": { "imageUrl": null, "description": "" },
      "ui": []
    },
    "updatedAt": "2026-06-16T10:20:00Z"
  }
}
```

## 프론트엔드 연동 메모

- 기존 axios 인스턴스는 10초 타임아웃이므로 `ai-feedback`, `pdf` 생성 API는 개별 timeout을 60초 이상으로 설정하는 것이 좋습니다.
- `DRAFT` 저장은 필수값이 비어 있어도 허용해야 합니다.
- `COMPLETED` 저장은 화면의 필수 체크리스트 기준으로 검증해 주세요.
- 이미지 파일 자체는 백엔드로 보내지 않고 Cloudinary URL만 전달하는 방향이 현재 프론트 구조와 맞습니다.
- 공유 조회 API는 access token 없이 호출 가능해야 합니다.
