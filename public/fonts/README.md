# Pretendard 폰트 다운로드 안내

이 디렉토리에 다음 폰트 파일을 배치해주세요:

1. **Pretendard-Regular.ttf**
2. **Pretendard-Bold.ttf**

## 다운로드 링크

공식 GitHub 릴리스:
https://github.com/orioncactus/pretendard/releases

### 빠른 다운로드 (v1.3.9)

```bash
# Pretendard-Regular.ttf
curl -L -o public/fonts/Pretendard-Regular.ttf https://github.com/orioncactus/pretendard/raw/v1.3.9/dist/public/static/Pretendard-Regular.ttf

# Pretendard-Bold.ttf
curl -L -o public/fonts/Pretendard-Bold.ttf https://github.com/orioncactus/pretendard/raw/v1.3.9/dist/public/static/Pretendard-Bold.ttf
```

또는 Windows PowerShell:

```powershell
# Pretendard-Regular.ttf
Invoke-WebRequest -Uri "https://github.com/orioncactus/pretendard/raw/v1.3.9/dist/public/static/Pretendard-Regular.ttf" -OutFile "public/fonts/Pretendard-Regular.ttf"

# Pretendard-Bold.ttf
Invoke-WebRequest -Uri "https://github.com/orioncactus/pretendard/raw/v1.3.9/dist/public/static/Pretendard-Bold.ttf" -OutFile "public/fonts/Pretendard-Bold.ttf"
```

## 사용처

- **react-pdf**: PDF 리포트의 한글 폰트
- **SVG 차트**: Big5 Radar Chart 라벨 렌더링
- **웹 폰트 대체**: 시스템 폰트 없을 때 fallback

## 라이선스

Pretendard는 SIL Open Font License 1.1 하에 배포됩니다.
상업적 사용 가능.

