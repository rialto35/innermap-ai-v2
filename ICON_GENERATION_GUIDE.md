# 🎨 InnerMap AI 아이콘 생성 가이드

## 📋 **DALL-E 아이콘 생성 방법**

### **1단계: 환경 설정**
```bash
# .env 파일에 OpenAI API 키 추가
OPENAI_API_KEY=your_openai_api_key_here
```

### **2단계: 아이콘 생성 스크립트 실행**
```bash
node src/scripts/generateAppIcon.js
```

### **3단계: 생성된 아이콘 확인**
- `public/app-icon-1024.png` 파일이 생성됩니다
- 이 파일을 다양한 크기로 리사이즈해야 합니다

## 🎯 **DALL-E 프롬프트 최적화**

### **기본 프롬프트:**
```
App icon for InnerMap AI, minimalist brain-map design, holographic gradient, modern tech style, clean lines, purple and blue gradient, brain with neural network connections, map-like elements, professional and modern, suitable for app store
```

### **고급 프롬프트 (더 정교한 결과):**
```
Create a modern app icon for "InnerMap AI" - a psychological analysis platform. Design features: minimalist brain silhouette with neural network connections, holographic purple-to-blue gradient background, subtle map grid elements, clean geometric shapes, professional tech aesthetic, suitable for iOS/Android app stores, 1024x1024 resolution, high contrast for visibility
```

## 📐 **아이콘 크기별 요구사항**

| 파일명 | 크기 | 용도 |
|--------|------|------|
| `favicon.ico` | 32x32 | 브라우저 탭 아이콘 |
| `apple-touch-icon.png` | 180x180 | iOS 홈스크린 |
| `icon-192.png` | 192x192 | Android 홈스크린 |
| `icon-512.png` | 512x512 | PWA 설치 |

## 🛠️ **아이콘 리사이즈 도구**

### **온라인 도구:**
- [Favicon.io](https://favicon.io/) - 모든 크기 자동 생성
- [RealFaviconGenerator](https://realfavicongenerator.net/) - 전문적인 파비콘 생성

### **명령줄 도구:**
```bash
# ImageMagick 사용 (설치 필요)
convert app-icon-1024.png -resize 32x32 favicon.ico
convert app-icon-1024.png -resize 180x180 apple-touch-icon.png
convert app-icon-1024.png -resize 192x192 icon-192.png
convert app-icon-1024.png -resize 512x512 icon-512.png
```

## 🎨 **디자인 가이드라인**

### **색상 팔레트:**
- **주 색상:** #8b5cf6 (보라색)
- **보조 색상:** #3b82f6 (파란색)
- **강조 색상:** #06b6d4 (청록색)
- **배경:** #0a0a0f (어두운 우주)

### **디자인 요소:**
- 🧠 **뇌 모양:** 단순화된 실루엣
- 🗺️ **지도 요소:** 격자나 연결선
- ⚡ **신경망:** 연결점과 선
- 🌈 **홀로그래픽:** 그라데이션 효과

## ✅ **품질 체크리스트**

- [ ] 32x32에서도 명확하게 보임
- [ ] 어두운 배경에서 잘 보임
- [ ] 밝은 배경에서도 잘 보임
- [ ] 앱스토어 가이드라인 준수
- [ ] 브랜드 아이덴티티 반영
- [ ] 모든 크기에서 일관성 유지

## 🚀 **배포 후 확인사항**

1. **브라우저 탭:** favicon.ico 표시 확인
2. **iOS 홈스크린:** apple-touch-icon.png 표시 확인
3. **Android 홈스크린:** icon-192.png 표시 확인
4. **PWA 설치:** icon-512.png 표시 확인
5. **소셜 미디어:** OpenGraph 이미지 표시 확인

## 💡 **추가 팁**

- **투명 배경:** PNG 형식 사용
- **고해상도:** 1024x1024에서 시작
- **일관성:** 모든 크기에서 동일한 디자인
- **테스트:** 다양한 배경에서 확인
- **최적화:** 파일 크기 최소화

---

**🎉 완성되면 진짜 프로페셔널한 플랫폼 느낌!**
