# Pretendard 폰트 수동 다운로드 가이드

네트워크 이슈로 인해 자동 다운로드가 실패했습니다. 아래 단계를 따라 수동으로 다운로드해주세요.

## 방법 1: 브라우저에서 직접 다운로드 (권장)

1. 아래 링크를 브라우저에서 열어 다운로드:
   - [Pretendard-Regular.ttf 다운로드](https://github.com/orioncactus/pretendard/raw/v1.3.9/dist/public/static/Pretendard-Regular.ttf)
   - [Pretendard-Bold.ttf 다운로드](https://github.com/orioncactus/pretendard/raw/v1.3.9/dist/public/static/Pretendard-Bold.ttf)

2. 다운로드한 파일을 `E:\innermap-ai-v2\public\fonts\` 폴더로 이동

## 방법 2: 공식 릴리스 페이지에서 다운로드

1. https://github.com/orioncactus/pretendard/releases 방문
2. 최신 릴리스(v1.3.9 이상)에서 `Pretendard-1.3.9.zip` 또는 유사한 파일 다운로드
3. 압축 해제 후 `dist/public/static/` 폴더에서:
   - `Pretendard-Regular.ttf`
   - `Pretendard-Bold.ttf`
4. 위 두 파일을 `E:\innermap-ai-v2\public\fonts\`로 복사

## 방법 3: curl 사용 (Git Bash 또는 WSL)

```bash
cd E:/innermap-ai-v2
curl -L -o public/fonts/Pretendard-Regular.ttf https://github.com/orioncactus/pretendard/raw/v1.3.9/dist/public/static/Pretendard-Regular.ttf
curl -L -o public/fonts/Pretendard-Bold.ttf https://github.com/orioncactus/pretendard/raw/v1.3.9/dist/public/static/Pretendard-Bold.ttf
```

## 확인

파일이 제대로 배치되었는지 확인:

```powershell
dir public/fonts
```

다음 두 파일이 보여야 합니다:
- `Pretendard-Regular.ttf` (약 2-4 MB)
- `Pretendard-Bold.ttf` (약 2-4 MB)

## 다음 단계

폰트 파일 배치 후 다음 명령으로 배포 진행:

```bash
git add public/fonts/*.ttf
git commit -m "chore(fonts): add Pretendard Regular/Bold"
git push
```

