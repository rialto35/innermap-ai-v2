# Inner9 Changelog

## v1.1.0 (2025-01-19)

### 🚀 Major Features
- **Enhanced Score Calculation**: Added MBTI/RETI type weighting system
- **Hybrid Narrative Engine**: Rule-based + LLM enhancement for smarter interpretations
- **Robust Data Validation**: Zod schema validation for all Inner9 scores
- **Type-Safe Architecture**: Comprehensive TypeScript types and validation

### 🔧 Technical Improvements
- **Score Normalization**: All scores clamped to 0-100 integers
- **NaN Protection**: Safe number conversion with fallbacks
- **Type Weighting**: MBTI and RETI-based adjustments for insight and growth
- **Caching**: API response caching with proper headers
- **Logging**: Comprehensive monitoring and debugging

### 📊 MBTI/RETI Weighting System
- **MBTI Adjustments**:
  - N-type: +10% insight
  - S-type: -5% insight, +10% growth
  - T-type: +5% insight
  - F-type: +5% growth
  - J-type: +10% growth
  - P-type: +5% insight, -5% growth

- **RETI Adjustments**:
  - Logic types (1,5,9): +10% insight
  - Express types (2,3,7): +10% growth
  - Will types (4,6,8): +5% insight, +5% growth

### 🧠 Narrative Engine
- **Rule-based Summary**: Threshold-based labeling (매우 높음/높음/보통/낮음/매우 낮음)
- **LLM Enhancement**: Optional AI-powered coaching feedback
- **Hybrid Approach**: Combines reliability of rules with naturalness of AI

### 🛠️ Configuration
- `INNER9_USE_TYPE_WEIGHTS`: Enable/disable type weighting (default: true)
- `INNER9_USE_LLM_ENHANCEMENT`: Enable/disable LLM enhancement (default: false)
- `INNER9_CACHE_DURATION`: Cache duration in seconds (default: 300)

### 🧪 Testing
- Comprehensive unit tests for score computation
- Type weighting validation
- Edge case handling (NaN, Infinity, null values)
- Range validation (0-100 scores)

### 📈 Performance
- Optimized score calculation
- Reduced API response times with caching
- Efficient type checking and validation

### 🔍 Monitoring
- Detailed logging for score computation
- User-specific score tracking
- Error handling and fallbacks

---

## v1.0.0 (2025-01-18)

### 🎯 Initial Release
- Basic Inner9 score computation from Big5 percentiles
- 9-dimensional radar chart visualization
- Simple narrative generation
- Database persistence

### 📊 Core Features
- Creation, Will, Sensitivity, Harmony, Expression
- Insight, Resilience, Balance, Growth
- Score normalization and validation
- Chart rendering with Recharts

### 🗄️ Data Management
- Database schema with inner9_scores column
- API endpoints for score storage and retrieval
- User-specific score tracking
