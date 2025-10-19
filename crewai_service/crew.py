"""
CrewAI Analysis Crew - Multi-Agent Psychological Analysis System
"""

from typing import Dict, Any
from crewai import Agent, Task, Crew, Process
from crewai.tools import tool
from langchain_openai import ChatOpenAI

from config import settings
from models import Big5Model, Inner9Model, HeroModel, AnalysisResult


class AnalysisCrew:
    """
    Multi-agent crew for deep psychological analysis
    """
    
    def __init__(
        self,
        big5: Big5Model,
        mbti: str | None,
        inner9: Inner9Model,
        hero: HeroModel | None,
    ):
        self.big5 = big5
        self.mbti = mbti
        self.inner9 = inner9
        self.hero = hero
        
        # Initialize LLM
        self.llm = ChatOpenAI(
            model=settings.OPENAI_MODEL,
            temperature=settings.OPENAI_TEMPERATURE,
            max_tokens=settings.ANALYSIS_MAX_TOKENS,
        )
        
        # Create agents
        self.personality_analyst = self._create_personality_analyst()
        self.growth_advisor = self._create_growth_advisor()
        self.relationship_expert = self._create_relationship_expert()
        self.career_consultant = self._create_career_consultant()
        self.report_writer = self._create_report_writer()
    
    def _create_personality_analyst(self) -> Agent:
        """Create personality analyst agent"""
        return Agent(
            role="성격 분석 전문가",
            goal="Big5, MBTI, Inner9 데이터를 종합하여 핵심 성격 특징을 도출합니다",
            backstory="""
            당신은 20년 경력의 심리학 박사로, Big5 성격 이론과 MBTI, 그리고 Inner9 시스템에 
            정통한 전문가입니다. 복잡한 심리 데이터를 명확하고 실용적인 통찰로 변환하는 능력이 
            뛰어납니다.
            """,
            llm=self.llm,
            verbose=True,
            allow_delegation=False,
        )
    
    def _create_growth_advisor(self) -> Agent:
        """Create growth advisor agent"""
        return Agent(
            role="성장 조언 전문가",
            goal="강점을 극대화하고 약점을 보완하는 구체적인 성장 전략을 제시합니다",
            backstory="""
            당신은 개인 성장 코칭 분야의 권위자로, 수백 명의 내담자를 성공적으로 변화시킨 
            경험이 있습니다. 각 개인의 고유한 특성을 존중하면서도 실천 가능한 조언을 제공하는 
            것이 특기입니다.
            """,
            llm=self.llm,
            verbose=True,
            allow_delegation=False,
        )
    
    def _create_relationship_expert(self) -> Agent:
        """Create relationship expert agent"""
        return Agent(
            role="관계 심리 전문가",
            goal="대인관계 패턴을 분석하고 소통 스타일 개선 방안을 제시합니다",
            backstory="""
            당신은 관계 심리학과 의사소통 이론의 전문가로, 다양한 성격 유형 간의 상호작용을 
            깊이 이해하고 있습니다. 갈등 해결과 건강한 관계 구축에 대한 실용적인 조언을 
            제공합니다.
            """,
            llm=self.llm,
            verbose=True,
            allow_delegation=False,
        )
    
    def _create_career_consultant(self) -> Agent:
        """Create career consultant agent"""
        return Agent(
            role="진로 컨설턴트",
            goal="성격 특성에 맞는 직업 분야와 커리어 발전 방향을 제시합니다",
            backstory="""
            당신은 산업 심리학과 진로 상담 분야의 전문가로, 성격과 직업 적합성에 대한 
            폭넓은 지식을 보유하고 있습니다. 개인의 강점을 살릴 수 있는 커리어 경로를 
            제안하는 데 탁월합니다.
            """,
            llm=self.llm,
            verbose=True,
            allow_delegation=False,
        )
    
    def _create_report_writer(self) -> Agent:
        """Create report writer agent"""
        return Agent(
            role="심리 리포트 작성자",
            goal="모든 분석 결과를 통합하여 구조화되고 읽기 쉬운 최종 리포트를 작성합니다",
            backstory="""
            당신은 심리학적 통찰을 명확하고 공감적인 언어로 전달하는 전문 작가입니다. 
            복잡한 분석 결과를 일반인도 이해하기 쉽게 정리하는 능력이 뛰어나며, 
            독자에게 동기부여를 주는 글쓰기에 능숙합니다.
            """,
            llm=self.llm,
            verbose=True,
            allow_delegation=False,
        )
    
    def _create_tasks(self) -> list[Task]:
        """Create analysis tasks"""
        
        # Prepare context data
        context = self._prepare_context()
        
        # Task 1: Personality Analysis
        personality_task = Task(
            description=f"""
            다음 심리 데이터를 종합 분석하여 핵심 성격 특징을 도출하세요:
            
            {context}
            
            분석 결과는 다음을 포함해야 합니다:
            1. 전반적인 성격 특징 (2-3 문단)
            2. 주요 강점 3-5가지
            3. 성장이 필요한 영역 3-5가지
            
            한국어로 작성하고, 구체적이고 실용적인 통찰을 제공하세요.
            """,
            agent=self.personality_analyst,
            expected_output="성격 분석 결과 (강점, 약점 포함)",
        )
        
        # Task 2: Growth Strategy
        growth_task = Task(
            description="""
            앞선 성격 분석 결과를 바탕으로 구체적인 성장 전략을 제시하세요:
            
            1. 강점을 더욱 발전시키는 방법
            2. 약점을 보완하는 실천 가능한 조언
            3. 단기(1-3개월), 중기(6개월), 장기(1년) 성장 목표
            
            각 조언은 구체적이고 실행 가능해야 하며, 동기부여적인 톤을 유지하세요.
            """,
            agent=self.growth_advisor,
            expected_output="구체적인 성장 전략 및 실천 방안",
            context=[personality_task],
        )
        
        # Task 3: Relationship Analysis
        relationship_task = Task(
            description="""
            성격 분석을 바탕으로 대인관계 패턴과 소통 스타일을 분석하세요:
            
            1. 주요 대인관계 패턴 및 특징
            2. 소통 스타일 (강점과 개선점)
            3. 갈등 상황에서의 대처 방식
            4. 더 나은 관계를 위한 구체적인 조언
            
            공감적이고 실용적인 조언을 제공하세요.
            """,
            agent=self.relationship_expert,
            expected_output="대인관계 분석 및 소통 개선 방안",
            context=[personality_task],
        )
        
        # Task 4: Career Guidance
        career_task = Task(
            description="""
            성격 특성을 바탕으로 적합한 직업 분야와 커리어 발전 방향을 제시하세요:
            
            1. 적합한 직업 분야 및 역할 (3-5가지)
            2. 업무 환경 선호도 분석
            3. 커리어 발전을 위한 핵심 역량
            4. 장기적인 커리어 비전 제안
            
            구체적인 직업명과 함께 그 이유를 명확히 설명하세요.
            """,
            agent=self.career_consultant,
            expected_output="커리어 추천 및 발전 방향",
            context=[personality_task],
        )
        
        # Task 5: Final Report
        report_task = Task(
            description="""
            모든 분석 결과를 통합하여 최종 리포트를 작성하세요.
            
            리포트는 다음 구조를 따라야 합니다:
            
            1. **전체 요약** (2-3 문단): 핵심 성격 특징을 간결하게 요약
            2. **주요 강점** (리스트 형태, 3-5개): 각 강점에 대한 간단한 설명 포함
            3. **성장 영역** (리스트 형태, 3-5개): 각 영역에 대한 간단한 설명 포함
            4. **성장 조언** (2-3 문단): 구체적이고 실천 가능한 조언
            5. **관계 및 소통** (2-3 문단): 대인관계 패턴과 개선 방안
            6. **커리어 방향** (2-3 문단): 적합한 직업 분야와 발전 방향
            
            톤은 공감적이고 격려적이며, 독자가 자신의 잠재력을 믿고 
            성장할 수 있도록 동기부여해야 합니다.
            
            JSON 형식으로 출력하세요:
            {{
              "summary": "전체 요약 텍스트",
              "strengths": ["강점1", "강점2", ...],
              "weaknesses": ["약점1", "약점2", ...],
              "growthAdvice": "성장 조언 텍스트",
              "relationships": "관계 및 소통 텍스트",
              "career": "커리어 방향 텍스트"
            }}
            """,
            agent=self.report_writer,
            expected_output="최종 통합 리포트 (JSON 형식)",
            context=[personality_task, growth_task, relationship_task, career_task],
        )
        
        return [
            personality_task,
            growth_task,
            relationship_task,
            career_task,
            report_task,
        ]
    
    def _prepare_context(self) -> str:
        """Prepare context data for analysis"""
        context_parts = []
        
        # Big5
        context_parts.append("**Big5 성격 점수:**")
        context_parts.append(f"- 개방성 (O): {self.big5.O:.2f}")
        context_parts.append(f"- 성실성 (C): {self.big5.C:.2f}")
        context_parts.append(f"- 외향성 (E): {self.big5.E:.2f}")
        context_parts.append(f"- 친화성 (A): {self.big5.A:.2f}")
        context_parts.append(f"- 신경성 (N): {self.big5.N:.2f}")
        context_parts.append("")
        
        # MBTI
        if self.mbti:
            context_parts.append(f"**MBTI 유형:** {self.mbti}")
            context_parts.append("")
        
        # Inner9
        context_parts.append("**Inner9 차원 점수:**")
        context_parts.append(f"- 창조 (Creation): {self.inner9.creation:.1f}")
        context_parts.append(f"- 의지 (Will): {self.inner9.will:.1f}")
        context_parts.append(f"- 통찰 (Insight): {self.inner9.insight:.1f}")
        context_parts.append(f"- 감수성 (Sensitivity): {self.inner9.sensitivity:.1f}")
        context_parts.append(f"- 성장 (Growth): {self.inner9.growth:.1f}")
        context_parts.append(f"- 균형 (Balance): {self.inner9.balance:.1f}")
        context_parts.append(f"- 조화 (Harmony): {self.inner9.harmony:.1f}")
        context_parts.append(f"- 표현 (Expression): {self.inner9.expression:.1f}")
        context_parts.append("")
        
        # Hero
        if self.hero:
            context_parts.append(f"**영웅 원형:** {self.hero.title} ({self.hero.code})")
            if self.hero.tribe:
                context_parts.append(f"**부족:** {self.hero.tribe}")
            context_parts.append("")
        
        return "\n".join(context_parts)
    
    async def run(self) -> AnalysisResult:
        """Run the analysis crew"""
        
        # Create tasks
        tasks = self._create_tasks()
        
        # Create crew
        crew = Crew(
            agents=[
                self.personality_analyst,
                self.growth_advisor,
                self.relationship_expert,
                self.career_consultant,
                self.report_writer,
            ],
            tasks=tasks,
            process=Process.sequential,
            verbose=True,
        )
        
        # Execute crew
        result = crew.kickoff()
        
        # Parse result (assuming JSON output from final task)
        import json
        try:
            # Extract JSON from result
            result_str = str(result)
            # Find JSON block
            start_idx = result_str.find("{")
            end_idx = result_str.rfind("}") + 1
            json_str = result_str[start_idx:end_idx]
            
            parsed_result = json.loads(json_str)
            
            return AnalysisResult(**parsed_result)
        except Exception as e:
            # Fallback: return raw result with basic structure
            return AnalysisResult(
                summary=str(result)[:500],
                strengths=["분석 결과 파싱 중 오류 발생"],
                weaknesses=["분석 결과 파싱 중 오류 발생"],
                growthAdvice="분석 결과를 다시 확인해주세요.",
                relationships="분석 결과를 다시 확인해주세요.",
                career="분석 결과를 다시 확인해주세요.",
            )

