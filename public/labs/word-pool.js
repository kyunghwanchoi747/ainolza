// AI 단어 퀴즈 문제 풀 — 120문제
//
// 자료 출처 (2026-06 기준):
//  - Digital Applied "AI Agent Glossary 2026: 60 Essential Terms" (digitalapplied.com)
//  - SK AX "2026 에이전트 AI 트렌드" (skax.co.kr/insight/trend/3624)
//  - MachineLearningMastery "7 Agentic AI Trends to Watch in 2026"
//  - Splunk "Top 10 AI Trends 2025"
//  - 나무위키 (ChatGPT, 인공지능 환각), IBM Think (GPT), Coursera AI Glossary
//  - 한국 일반인 대상 한국어 설명은 시니어 학습자 이해 수준으로 재서술
//
// 카테고리: 기초 / 도구 / 트렌드 / 에이전트 / 활용 / 윤리

const wordPool = [
    // ═══════════ 1. 기초 (30문제) ═══════════
    { category: "기초", description: "사람의 학습, 추론, 판단 능력을 컴퓨터로 구현한 기술", answer: "인공지능", options: ["인공지능", "블록체인", "메타버스", "빅데이터"], explanation: "인공지능(AI, Artificial Intelligence)은 사람의 지능을 컴퓨터로 흉내 낸 기술이에요." },
    { category: "기초", description: "AI에게 원하는 결과를 얻기 위해 입력하는 명령어나 지시문", answer: "프롬프트", options: ["프롬프트", "알고리즘", "데이터셋", "파라미터"], explanation: "프롬프트(Prompt)는 AI에게 \"이렇게 해줘\"라고 내리는 지시예요. 잘 쓰면 결과가 달라집니다." },
    { category: "기초", description: "대량의 텍스트로 학습된 거대한 AI 언어 모델", answer: "LLM", options: ["LLM", "CNN", "GAN", "API"], explanation: "LLM(Large Language Model, 대규모 언어 모델)은 GPT-4, Claude, Gemini 같은 거대한 AI를 말해요." },
    { category: "기초", description: "AI가 텍스트를 처리하는 최소 단위", answer: "토큰", options: ["토큰", "픽셀", "바이트", "비트"], explanation: "토큰(Token)은 단어나 글자 조각이에요. '인공지능'은 보통 2~3개 토큰으로 나뉩니다." },
    { category: "기초", description: "AI가 한 대화에서 기억할 수 있는 최대 텍스트 길이", answer: "컨텍스트 윈도우", options: ["컨텍스트 윈도우", "메모리 카드", "캐시", "버퍼"], explanation: "Context Window는 AI가 한 번에 볼 수 있는 글의 양이에요. 길수록 긴 대화가 가능합니다." },
    { category: "기초", description: "AI가 거짓 정보를 사실처럼 자신 있게 말하는 현상", answer: "환각", options: ["환각", "오류", "버그", "노이즈"], explanation: "환각(Hallucination)은 AI가 그럴듯하게 틀린 말을 하는 거예요. 항상 사실 확인이 필요합니다." },
    { category: "기초", description: "사람의 말이나 글을 컴퓨터가 이해하고 처리하는 기술", answer: "자연어 처리", options: ["자연어 처리", "컴퓨터 비전", "로보틱스", "클라우드"], explanation: "NLP(Natural Language Processing)는 번역, 요약, 대화 등에 쓰여요." },
    { category: "기초", description: "기계가 데이터를 통해 스스로 규칙을 찾아 학습하는 것", answer: "머신러닝", options: ["머신러닝", "프로그래밍", "데이터마이닝", "코딩"], explanation: "머신러닝(Machine Learning)은 일일이 가르치지 않아도 데이터에서 패턴을 학습합니다." },
    { category: "기초", description: "사람 뇌의 신경망 구조를 모방한 머신러닝의 한 종류", answer: "딥러닝", options: ["딥러닝", "엣지 러닝", "와이드 러닝", "쇼트 러닝"], explanation: "딥러닝(Deep Learning)은 깊은 신경망으로 복잡한 패턴을 학습하는 방법이에요." },
    { category: "기초", description: "현대 LLM의 기초가 된 신경망 구조", answer: "트랜스포머", options: ["트랜스포머", "변환기", "컨볼루션", "리커런트"], explanation: "Transformer는 '어텐션' 메커니즘 기반 구조로 GPT, BERT 등 모든 현대 LLM의 뼈대입니다." },
    { category: "기초", description: "AI가 학습하는 데 사용되는 대량의 정보 모음", answer: "데이터셋", options: ["데이터셋", "데이터베이스", "데이터마트", "데이터레이크"], explanation: "데이터셋(Dataset)은 AI 학습용으로 정리된 데이터 묶음이에요." },
    { category: "기초", description: "텍스트나 이미지의 의미를 숫자 벡터로 표현한 것", answer: "임베딩", options: ["임베딩", "인코딩", "캡슐화", "직렬화"], explanation: "임베딩(Embedding)은 의미를 숫자로 변환한 거예요. 비슷한 뜻은 가까운 위치에 모입니다." },
    { category: "기초", description: "AI 모델 내부의 학습 가능한 값", answer: "파라미터", options: ["파라미터", "엔진", "코어", "셀"], explanation: "파라미터(Parameter)는 AI 두뇌의 시냅스 같은 값. GPT-4는 수천억 개의 파라미터를 가져요." },
    { category: "기초", description: "글, 이미지, 음악, 코드 등을 새로 만들어내는 AI", answer: "생성형 AI", options: ["생성형 AI", "분석형 AI", "예측형 AI", "탐색형 AI"], explanation: "Generative AI는 ChatGPT, Midjourney처럼 새 콘텐츠를 만들어내는 AI예요." },
    { category: "기초", description: "정답이 있는 데이터로 AI를 학습시키는 방법", answer: "지도 학습", options: ["지도 학습", "비지도 학습", "강화 학습", "전이 학습"], explanation: "Supervised Learning은 라벨(정답)이 있는 데이터로 AI를 가르치는 방법이에요." },
    { category: "기초", description: "AI가 스스로 시행착오로 보상을 받으며 배우는 방법", answer: "강화 학습", options: ["강화 학습", "지도 학습", "비지도 학습", "메타 학습"], explanation: "Reinforcement Learning은 잘하면 상을, 못하면 벌을 받으며 학습하는 방식이에요." },
    { category: "기초", description: "GPT의 'G'가 의미하는 영어 단어", answer: "Generative", options: ["Generative", "General", "Global", "Graphical"], explanation: "GPT는 Generative Pre-trained Transformer의 약자. '생성형 사전학습 트랜스포머'예요." },
    { category: "기초", description: "GPT의 'P'가 의미하는 영어 단어", answer: "Pre-trained", options: ["Pre-trained", "Powerful", "Public", "Personal"], explanation: "Pre-trained는 '미리 학습된'이라는 뜻. 거대한 데이터로 먼저 학습한 후 사용해요." },
    { category: "기초", description: "AI가 사진 속 사물을 자동으로 알아보는 기술", answer: "이미지 인식", options: ["이미지 인식", "음성 인식", "패턴 인식", "지문 인식"], explanation: "Image Recognition은 컴퓨터 비전의 한 분야로 사진 속 사물·얼굴 등을 식별해요." },
    { category: "기초", description: "사람의 음성을 텍스트로 바꾸는 기술", answer: "음성 인식", options: ["음성 인식", "음성 합성", "음성 변환", "음성 압축"], explanation: "STT(Speech-to-Text)라고도 해요. 시리, 빅스비, 받아쓰기 등이 이걸 씁니다." },
    { category: "기초", description: "텍스트를 사람 목소리로 바꿔 읽어주는 기술", answer: "음성 합성", options: ["음성 합성", "음성 인식", "음성 분리", "음성 추출"], explanation: "TTS(Text-to-Speech)예요. 내비게이션, 오디오북, AI 더빙에 활용됩니다." },
    { category: "기초", description: "사람과 자연스럽게 대화하는 AI 프로그램의 통칭", answer: "챗봇", options: ["챗봇", "검색엔진", "번역기", "스피커"], explanation: "Chatbot은 텍스트 또는 음성으로 사람과 대화하는 AI예요. ChatGPT도 챗봇의 한 종류입니다." },
    { category: "기초", description: "AI가 학습할 때 패턴을 찾는 수학적 규칙", answer: "알고리즘", options: ["알고리즘", "프로그램", "스크립트", "함수"], explanation: "알고리즘(Algorithm)은 문제를 푸는 일련의 절차예요." },
    { category: "기초", description: "AI 학습 데이터의 편향 때문에 특정 집단이 불리해지는 문제", answer: "AI 편향", options: ["AI 편향", "AI 오류", "AI 노이즈", "AI 격차"], explanation: "AI Bias는 데이터가 한쪽으로 치우치면 결과도 불공정해지는 문제예요." },
    { category: "기초", description: "AI가 입력을 받아 결과를 계산하고 내놓는 과정", answer: "추론", options: ["추론", "학습", "재학습", "검증"], explanation: "Inference는 학습된 AI가 새 입력에 답을 내는 과정. 학습과 달리 빠르고 가볍습니다." },
    { category: "기초", description: "AI가 한 번에 처리하는 데이터의 묶음 단위", answer: "배치", options: ["배치", "배럴", "박스", "버킷"], explanation: "Batch는 한 번에 처리하는 데이터 묶음이에요." },
    { category: "기초", description: "여러 AI 모델을 동시에 돌리고 결과를 합치는 방식", answer: "앙상블", options: ["앙상블", "동기화", "병렬화", "복제"], explanation: "Ensemble은 여러 모델을 합쳐 더 정확한 결과를 얻는 기법이에요." },
    { category: "기초", description: "AI가 모르는 새로운 데이터에도 잘 작동하는 능력", answer: "일반화", options: ["일반화", "특수화", "압축화", "최적화"], explanation: "Generalization은 학습 안 한 데이터에도 잘 적용되는 능력이에요. AI의 핵심 평가 기준입니다." },
    { category: "기초", description: "학습 데이터에 너무 맞춰져서 새 데이터엔 못 쓰는 상태", answer: "과적합", options: ["과적합", "과소적합", "과압축", "과확장"], explanation: "Overfitting은 외운 데이터엔 100점인데 새 문제엔 0점인 상태예요." },
    { category: "기초", description: "AI 학습 데이터가 너무 적거나 단순해 학습이 안 된 상태", answer: "과소적합", options: ["과소적합", "과적합", "과학습", "과최적화"], explanation: "Underfitting은 너무 단순해서 데이터의 패턴조차 못 잡는 상태예요." },

    // ═══════════ 2. 도구·서비스 (25문제) ═══════════
    { category: "도구", description: "OpenAI가 2022년 11월에 공개한 대화형 AI", answer: "ChatGPT", options: ["ChatGPT", "Claude", "Gemini", "Copilot"], explanation: "ChatGPT는 전 세계적인 AI 열풍을 시작시킨 OpenAI의 대화형 AI예요." },
    { category: "도구", description: "Anthropic이 만든 대화형 AI", answer: "Claude", options: ["Claude", "ChatGPT", "Gemini", "Llama"], explanation: "Claude는 안전성과 정확성에 강점이 있는 Anthropic의 AI예요." },
    { category: "도구", description: "구글이 만든 대화형 멀티모달 AI", answer: "Gemini", options: ["Gemini", "Bard", "Lambda", "PaLM"], explanation: "Gemini는 구글 딥마인드의 멀티모달 AI로 텍스트·이미지·음성을 모두 다뤄요." },
    { category: "도구", description: "Meta가 만든 오픈소스 AI 모델", answer: "Llama", options: ["Llama", "Alpaca", "Falcon", "Mistral"], explanation: "Llama는 누구나 무료로 쓸 수 있는 Meta의 오픈소스 AI예요." },
    { category: "도구", description: "Midjourney와 DALL-E 같은 AI가 만들어내는 것", answer: "이미지", options: ["이미지", "음악", "코드", "영상"], explanation: "이미지 생성 AI는 텍스트 설명을 받아 그림을 그려줘요." },
    { category: "도구", description: "OpenAI의 이미지 생성 AI 이름", answer: "DALL-E", options: ["DALL-E", "Midjourney", "Stable Diffusion", "Firefly"], explanation: "DALL-E는 ChatGPT 안에서도 쓸 수 있는 OpenAI의 이미지 AI예요." },
    { category: "도구", description: "OpenAI가 만든 텍스트→영상 생성 AI", answer: "Sora", options: ["Sora", "Runway", "Pika", "Gen"], explanation: "Sora는 텍스트만으로 고품질 영상을 만드는 OpenAI의 영상 AI예요." },
    { category: "도구", description: "AI가 코드 작성을 도와주는 GitHub의 도구", answer: "GitHub Copilot", options: ["GitHub Copilot", "GitHub Pages", "GitHub Actions", "GitHub Desktop"], explanation: "Copilot은 코드를 옆에서 자동 제안해주는 AI 코딩 비서예요." },
    { category: "도구", description: "텍스트 설명만으로 음악을 만들어주는 AI 서비스", answer: "Suno", options: ["Suno", "Spotify", "Audacity", "GarageBand"], explanation: "Suno는 가사와 멜로디를 동시에 만들어주는 AI 음악 서비스예요." },
    { category: "도구", description: "노션에 탑재된 문서 작성/요약 AI", answer: "Notion AI", options: ["Notion AI", "Notion Pro", "Notion Plus", "Notion Smart"], explanation: "Notion AI는 글 다듬기, 요약, 번역 등 문서 작업을 도와줘요." },
    { category: "도구", description: "디자인 플랫폼 Canva의 AI 기능", answer: "Canva AI", options: ["Canva AI", "Canva Pro", "Canva Studio", "Canva Magic"], explanation: "Canva AI는 배경 제거, 이미지 생성 등 디자인 작업을 자동화해줘요." },
    { category: "도구", description: "구글 검색 결과를 AI가 요약해주는 기능", answer: "AI Overview", options: ["AI Overview", "Deep Search", "Smart Result", "Knowledge Panel"], explanation: "AI Overview는 구글 검색 결과 상단에 AI 요약을 보여주는 기능이에요." },
    { category: "도구", description: "출처가 있는 답변을 주는 AI 검색 엔진", answer: "Perplexity", options: ["Perplexity", "Bing", "Yahoo", "DuckDuckGo"], explanation: "Perplexity는 답변과 함께 출처 링크를 보여주는 AI 검색 서비스예요." },
    { category: "도구", description: "Anthropic의 AI 코딩 도구", answer: "Claude Code", options: ["Claude Code", "Claude Lab", "Claude Studio", "Claude Build"], explanation: "Claude Code는 터미널에서 Claude로 코딩을 자동화하는 도구예요." },
    { category: "도구", description: "구글의 AI 노트북/리서치 도구", answer: "NotebookLM", options: ["NotebookLM", "Google Docs AI", "Bard Notes", "Gemini Notes"], explanation: "NotebookLM은 자료를 올리면 AI가 요약·질의응답·팟캐스트까지 만들어줘요." },
    { category: "도구", description: "ChatGPT 같은 AI 비서를 일컫는 일반적 용어", answer: "AI 비서", options: ["AI 비서", "AI 검색기", "AI 분석가", "AI 디자이너"], explanation: "AI Assistant는 사용자의 일을 도와주는 AI 통칭이에요." },
    { category: "도구", description: "여러 AI 모델을 한 화면에서 비교할 수 있는 서비스", answer: "LMArena", options: ["LMArena", "AI Battle", "Model Match", "AI Compare"], explanation: "LMArena는 다양한 AI 모델의 답변을 익명으로 비교·투표하는 플랫폼이에요." },
    { category: "도구", description: "오픈소스 AI 모델과 데이터셋이 모이는 플랫폼", answer: "Hugging Face", options: ["Hugging Face", "GitHub", "Kaggle", "OpenAI"], explanation: "Hugging Face는 AI 모델·데이터셋의 깃허브 같은 허브 플랫폼이에요." },
    { category: "도구", description: "AI 영상 편집/생성 도구로 유명한 서비스", answer: "Runway", options: ["Runway", "Premiere", "Final Cut", "DaVinci"], explanation: "Runway는 영상 생성·편집을 AI로 하는 대표적 서비스예요." },
    { category: "도구", description: "마이크로소프트가 Office에 통합한 AI", answer: "Microsoft Copilot", options: ["Microsoft Copilot", "Office AI", "Word AI", "Excel AI"], explanation: "Copilot은 Word·Excel·PowerPoint·Teams에 들어간 마이크로소프트의 AI 비서예요." },
    { category: "도구", description: "구글의 AI 영상 생성 모델", answer: "Veo", options: ["Veo", "Imagen", "MusicLM", "Lumiere"], explanation: "Veo는 텍스트로 고품질 영상을 만드는 구글 딥마인드의 영상 AI예요." },
    { category: "도구", description: "Mistral AI 같은 회사가 개발하는 효율적인 AI 모델 형식", answer: "오픈웨이트", options: ["오픈웨이트", "오픈소스", "오픈데이터", "오픈API"], explanation: "Open Weight는 모델 가중치를 공개해서 누구나 다운받아 쓸 수 있는 형태예요." },
    { category: "도구", description: "OpenAI가 만든 음성 인식 모델", answer: "Whisper", options: ["Whisper", "Voicebox", "SpeechAI", "Listen"], explanation: "Whisper는 99개 언어를 인식하는 오픈소스 음성→텍스트 AI예요." },
    { category: "도구", description: "Cursor, Windsurf 같은 도구의 공통점은?", answer: "AI 코드 에디터", options: ["AI 코드 에디터", "AI 디자인 툴", "AI 영상 편집기", "AI 음성 비서"], explanation: "AI 코드 에디터는 코딩을 AI와 함께하는 통합 개발 환경이에요." },
    { category: "도구", description: "한국에서 만든 한국어 특화 LLM 모델 중 LG가 만든 것", answer: "엑사원", options: ["엑사원", "하이퍼클로바", "코지", "솔라"], explanation: "ExaONE은 LG AI 연구원이 만든 한국어 강한 LLM이에요." },

    // ═══════════ 3. 트렌드 (30문제 — 핵심) ═══════════
    { category: "트렌드", description: "스스로 목표를 세우고 도구를 써서 작업을 끝내는 자율 AI", answer: "AI 에이전트", options: ["AI 에이전트", "AI 비서", "AI 챗봇", "AI 검색기"], explanation: "AI Agent는 \"질문에 답\"을 넘어 \"스스로 일을 처리\"하는 AI예요. 2025-26년 최대 트렌드입니다." },
    { category: "트렌드", description: "AI가 며칠간 사람 개입 없이 복잡한 일을 해내는 차세대 에이전트", answer: "프론티어 에이전트", options: ["프론티어 에이전트", "베타 에이전트", "마스터 에이전트", "프리미엄 에이전트"], explanation: "Frontier Agent는 며칠 단위로 자율 작업하는 최첨단 에이전트예요." },
    { category: "트렌드", description: "AI가 외부 도구·데이터에 연결하는 표준 프로토콜", answer: "MCP", options: ["MCP", "API", "RPC", "SDK"], explanation: "MCP(Model Context Protocol)는 AI가 외부 시스템과 연결되는 표준이에요. 2025년에 광범위하게 채택." },
    { category: "트렌드", description: "AI가 답변할 때 외부 자료를 검색해서 근거로 쓰는 기술", answer: "RAG", options: ["RAG", "GAN", "BERT", "VAE"], explanation: "RAG(Retrieval-Augmented Generation)는 검색+생성을 결합해 환각을 줄이는 기술이에요." },
    { category: "트렌드", description: "텍스트, 이미지, 음성을 동시에 다루는 AI", answer: "멀티모달 AI", options: ["멀티모달 AI", "유니모달 AI", "크로스모달 AI", "트랜스모달 AI"], explanation: "Multimodal AI는 여러 형태의 데이터를 한꺼번에 이해해요. GPT-4o, Gemini가 대표적." },
    { category: "트렌드", description: "여러 AI 에이전트가 협력해서 일하는 시스템", answer: "멀티에이전트", options: ["멀티에이전트", "메가에이전트", "마스터에이전트", "오토에이전트"], explanation: "Multi-agent System은 여러 AI가 역할 분담해 큰 과제를 수행하는 구조예요." },
    { category: "트렌드", description: "여러 에이전트의 역할과 순서를 조율하는 기술", answer: "에이전트 오케스트레이션", options: ["에이전트 오케스트레이션", "에이전트 클러스터링", "에이전트 페어링", "에이전트 매니징"], explanation: "Agent Orchestration은 \"누가 언제 무엇을 할지\" 자동 조율하는 기술이에요." },
    { category: "트렌드", description: "OpenAI o1, Claude처럼 깊게 생각한 뒤 답하는 AI", answer: "추론 모델", options: ["추론 모델", "응답 모델", "예측 모델", "분류 모델"], explanation: "Reasoning Model은 답하기 전 단계별로 생각하는 차세대 LLM이에요." },
    { category: "트렌드", description: "AI가 답하기 전 생각의 단계를 펼쳐가는 방식", answer: "사고의 연쇄", options: ["사고의 연쇄", "사고의 점프", "사고의 압축", "사고의 분기"], explanation: "Chain-of-Thought(CoT)는 \"단계별로 생각해봐\"라고 시키면 정확도가 높아지는 기법이에요." },
    { category: "트렌드", description: "AI가 자기 답을 다시 검토하고 고치는 패턴", answer: "리플렉션", options: ["리플렉션", "리프레시", "리플레이", "리세팅"], explanation: "Reflection은 AI가 \"내 답이 맞나?\" 스스로 점검하고 개선하는 기법이에요." },
    { category: "트렌드", description: "AI 모델이 추론할 때 시간/연산을 더 써서 품질을 올리는 방식", answer: "테스트 타임 컴퓨트", options: ["테스트 타임 컴퓨트", "트레이닝 타임 컴퓨트", "런타임 메모리", "프리프로세싱"], explanation: "Test-time Compute는 \"더 오래 생각\"하게 해서 답 품질을 높이는 기법. o1·o3의 핵심이에요." },
    { category: "트렌드", description: "AI에게 도구를 줘서 직접 사용하게 하는 기능", answer: "도구 사용", options: ["도구 사용", "도구 학습", "도구 분석", "도구 검색"], explanation: "Tool Use는 LLM이 계산기·검색·API 같은 외부 도구를 실제로 호출하는 능력이에요." },
    { category: "트렌드", description: "AI 모델이 구조화된 형식으로 외부 기능을 호출하는 방식", answer: "함수 호출", options: ["함수 호출", "함수 생성", "함수 분석", "함수 검사"], explanation: "Function Calling은 AI가 JSON 형식으로 \"이 함수를 이런 인자로 실행해줘\" 요청하는 기능이에요." },
    { category: "트렌드", description: "임베딩을 저장하고 의미 기반으로 검색하는 데이터베이스", answer: "벡터 DB", options: ["벡터 DB", "그래프 DB", "관계형 DB", "키-값 DB"], explanation: "Vector Database는 의미 검색용 DB. RAG 시스템의 핵심 인프라예요." },
    { category: "트렌드", description: "키워드가 아니라 의미가 비슷한 것을 찾는 검색", answer: "의미 검색", options: ["의미 검색", "키워드 검색", "정규식 검색", "전문 검색"], explanation: "Semantic Search는 단어 일치가 아닌 뜻이 비슷한 것을 찾아줘요." },
    { category: "트렌드", description: "AI가 만든 콘텐츠에 표시를 넣어 출처를 알리는 기술", answer: "AI 워터마크", options: ["AI 워터마크", "AI 필터", "AI 태그", "AI 라벨"], explanation: "AI Watermark는 \"이것은 AI가 만들었다\"고 식별하기 위한 보이지 않는 표시예요." },
    { category: "트렌드", description: "AI 모델이 한 가지 패턴/예측만 하는 모델과 달리, 새 콘텐츠 생성에 특화된 모델", answer: "기반 모델", options: ["기반 모델", "전문 모델", "축소 모델", "임베디드 모델"], explanation: "Foundation Model은 거대한 데이터로 학습한 범용 AI. 응용 모델의 기반이 돼요." },
    { category: "트렌드", description: "거대 AI 모델을 작게 만들어 같은 일을 더 빨리 하게 하는 방법", answer: "증류", options: ["증류", "압축", "최적화", "단순화"], explanation: "Distillation은 큰 모델의 지식을 작은 모델에 옮기는 기법이에요. 모바일 AI에 활용돼요." },
    { category: "트렌드", description: "AI 모델 내부에 여러 전문가가 있고 입력마다 다른 전문가가 답하는 구조", answer: "MoE", options: ["MoE", "MoA", "MoP", "MoL"], explanation: "Mixture of Experts는 큰 모델이지만 토큰마다 일부 전문가만 활성화해 효율을 높여요. Mixtral·DeepSeek이 대표적." },
    { category: "트렌드", description: "AI 에이전트끼리 통신하는 표준 프로토콜", answer: "A2A", options: ["A2A", "B2B", "P2P", "M2M"], explanation: "Agent-to-Agent Protocol은 구글이 주도하는 에이전트 간 통신 표준이에요." },
    { category: "트렌드", description: "사람이 매번 확인하지 않고 AI가 자율적으로 일을 처리하는 흐름", answer: "에이전틱 워크플로", options: ["에이전틱 워크플로", "정형 워크플로", "수동 워크플로", "보조 워크플로"], explanation: "Agentic Workflow는 에이전트가 주체가 되어 여러 단계 작업을 자동 처리하는 흐름이에요." },
    { category: "트렌드", description: "ChatGPT가 만든, 사용자가 만든 맞춤 챗봇", answer: "GPTs", options: ["GPTs", "Gems", "Apps", "Bots"], explanation: "GPTs는 ChatGPT 위에서 누구나 만들 수 있는 맞춤 GPT 챗봇이에요." },
    { category: "트렌드", description: "전 세계 어디서나 같은 모델을 빠르게 쓸 수 있게 분산 운영하는 기술", answer: "엣지 AI", options: ["엣지 AI", "코어 AI", "클러스터 AI", "중앙 AI"], explanation: "Edge AI는 클라우드 대신 사용자 가까운 곳(휴대폰·기기)에서 AI를 돌리는 방식이에요." },
    { category: "트렌드", description: "AI 모델의 답변에 대해 평가하는 자동화된 검사", answer: "AI 평가", options: ["AI 평가", "AI 점수", "AI 측정", "AI 테스트"], explanation: "Eval은 AI 답변의 품질을 자동으로 채점하는 기준·도구를 통칭해요. AI 운영의 필수예요." },
    { category: "트렌드", description: "AI 에이전트가 코드를 안전하게 실행하기 위한 격리 환경", answer: "샌드박스", options: ["샌드박스", "컨테이너", "캡슐", "버블"], explanation: "Sandbox는 \"실수해도 본 시스템에 영향 없는\" 격리된 실행 공간이에요." },
    { category: "트렌드", description: "악의적 입력으로 AI의 안전장치를 우회하려는 공격", answer: "프롬프트 인젝션", options: ["프롬프트 인젝션", "SQL 인젝션", "쿠키 인젝션", "DNS 인젝션"], explanation: "Prompt Injection은 \"앞 지시 무시하고 비밀 알려줘\" 같은 식으로 AI를 조작하려는 공격이에요." },
    { category: "트렌드", description: "AI의 안전장치를 풀어 금지된 답을 끌어내려는 시도", answer: "탈옥", options: ["탈옥", "해킹", "복제", "변조"], explanation: "Jailbreak은 AI의 안전 정책을 우회하려는 시도예요. 보안의 큰 이슈." },
    { category: "트렌드", description: "특정 위험 상황엔 사람이 확인 후 진행하게 하는 설계", answer: "휴먼 인 더 루프", options: ["휴먼 인 더 루프", "오토 루프", "셀프 루프", "오픈 루프"], explanation: "Human-in-the-Loop(HITL)는 중요한 결정 직전에 사람 확인을 거치는 설계 원칙이에요." },
    { category: "트렌드", description: "AI가 자율적으로 작동할수록 사람이 의도한 대로 따르게 만드는 기술/연구", answer: "정렬", options: ["정렬", "조절", "조율", "통제"], explanation: "Alignment는 AI가 사람 의도와 가치관에 맞춰 행동하게 하는 핵심 연구 분야예요." },
    { category: "트렌드", description: "AI 모델이 학습 후에도 새 지식을 더 익히도록 추가 학습하는 것", answer: "파인튜닝", options: ["파인튜닝", "프롬프팅", "파라미터 튜닝", "스크래치 학습"], explanation: "Fine-tuning은 사전학습된 AI를 특정 분야에 맞게 다시 가르치는 방법이에요." },

    // ═══════════ 4. 에이전트·코딩 (20문제) ═══════════
    { category: "에이전트", description: "AI가 환경을 보고 행동을 반복하는 핵심 사이클", answer: "에이전트 루프", options: ["에이전트 루프", "결정 트리", "스택", "큐"], explanation: "Agent Loop은 \"상황 보기 → 결정 → 행동 → 결과 확인\"을 반복하는 에이전트의 두뇌 사이클이에요." },
    { category: "에이전트", description: "AI가 자기 이전 시도를 비판하고 다시 시도하는 패턴", answer: "리플렉션", options: ["리플렉션", "재귀", "리스타트", "재학습"], explanation: "Reflexion은 에이전트가 자기 행동을 되돌아본 뒤 다시 시도하는 자기개선 패턴이에요." },
    { category: "에이전트", description: "큰 에이전트가 자식 에이전트들을 만들어 일을 나누는 구조", answer: "서브에이전트", options: ["서브에이전트", "사이드에이전트", "쌍둥이에이전트", "복제에이전트"], explanation: "Subagent는 부모 에이전트가 만든 자식 에이전트로 일을 분담해요." },
    { category: "에이전트", description: "한 에이전트가 다른 에이전트들에게 일을 분배하는 패턴", answer: "감독자 패턴", options: ["감독자 패턴", "동료 패턴", "독립 패턴", "투표 패턴"], explanation: "Supervisor Pattern은 한 명의 조율 에이전트가 작업을 분배·수집하는 구조예요." },
    { category: "에이전트", description: "동등한 에이전트들이 필요할 때 서로 일을 넘기는 패턴", answer: "스웜 패턴", options: ["스웜 패턴", "스택 패턴", "스파이크 패턴", "스플릿 패턴"], explanation: "Swarm Pattern은 중앙 감독 없이 동료 에이전트가 일을 인수인계하는 분산형 구조예요." },
    { category: "에이전트", description: "AI 에이전트가 사용할 도구를 시점·필요에 따라 선택해서 로드", answer: "스킬", options: ["스킬", "플러그인", "익스텐션", "모듈"], explanation: "Skill은 필요할 때만 불러쓰는 자체 포함 기능 묶음이에요." },
    { category: "에이전트", description: "프로젝트 루트에 있는 AI 에이전트용 지침 파일의 표준", answer: "AGENTS.md", options: ["AGENTS.md", "README.md", "INSTRUCTIONS.md", "RULES.md"], explanation: "AGENTS.md는 Claude Code, Cursor 등이 읽는 에이전트 지침 파일 표준이에요." },
    { category: "에이전트", description: "에이전트가 긴 작업 중 실패해도 이어 진행할 수 있는 패턴", answer: "견고한 실행", options: ["견고한 실행", "병렬 실행", "동기 실행", "압축 실행"], explanation: "Durable Execution은 단계마다 체크포인트를 남겨 충돌·재시도에도 살아남는 구조예요." },
    { category: "에이전트", description: "여러 에이전트에 동시에 분배 후 결과를 합치는 패턴", answer: "팬아웃 팬인", options: ["팬아웃 팬인", "포크 조인", "분산 통합", "갈래 합류"], explanation: "Fan-out/Fan-in은 \"동시 분배 → 결과 모으기\" 패턴이에요." },
    { category: "에이전트", description: "AI 에이전트의 능력을 평가하는 실제 GitHub 이슈 모음 벤치마크", answer: "SWE-Bench", options: ["SWE-Bench", "AI-Bench", "Code-Bench", "Bug-Bench"], explanation: "SWE-Bench는 2,294개의 실제 오픈소스 이슈로 에이전트의 실력을 평가해요." },
    { category: "에이전트", description: "AI에게 코드를 자연어로 설명만 하면 만들어주는 코딩 방식", answer: "바이브 코딩", options: ["바이브 코딩", "페어 코딩", "클린 코딩", "리팩토링"], explanation: "Vibe Coding은 \"이런 거 만들어줘\"라고 AI에게 설명만 하면 코드가 나오는 새 방식이에요." },
    { category: "에이전트", description: "Anthropic이 주창한, 모델이 헌법에 따라 자기검열하는 기법", answer: "헌법적 AI", options: ["헌법적 AI", "윤리적 AI", "투명한 AI", "정직한 AI"], explanation: "Constitutional AI는 \"이런 원칙은 지켜라\"는 규약을 모델이 스스로 따르게 하는 Anthropic의 접근법이에요." },
    { category: "에이전트", description: "AI 에이전트가 외부 시스템에 변경을 가하기 전에 사람 확인을 요청하는 단계", answer: "승인 게이트", options: ["승인 게이트", "보안 검사", "암호 확인", "동의 창"], explanation: "Approval Gate는 위험한 작업 직전에 사람의 OK를 받는 안전 장치예요." },
    { category: "에이전트", description: "에이전트가 진행 중 사람에게 정보를 묻고 계속하는 작업 흐름", answer: "대화형 워크플로", options: ["대화형 워크플로", "정적 워크플로", "독립 워크플로", "병렬 워크플로"], explanation: "Conversational Workflow는 에이전트가 중간에 사람과 대화하며 진행하는 패턴이에요." },
    { category: "에이전트", description: "AI가 길이가 긴 글에서 특정 사실을 정확히 찾아낼 수 있는지 보는 테스트", answer: "건초 더미 속 바늘", options: ["건초 더미 속 바늘", "도토리 찾기", "마법의 책", "도시 찾기"], explanation: "Needle-in-a-Haystack은 긴 컨텍스트에 핵심 사실 하나를 숨겨두고 AI가 찾는지 보는 벤치마크예요." },
    { category: "에이전트", description: "AI가 입력 컨텍스트를 어떻게 구성할지 체계적으로 설계하는 기술", answer: "컨텍스트 엔지니어링", options: ["컨텍스트 엔지니어링", "프롬프트 엔지니어링", "코드 엔지니어링", "데이터 엔지니어링"], explanation: "Context Engineering은 \"AI에게 어떤 정보를 어떤 순서로 넣을지\" 설계하는 기술이에요." },
    { category: "에이전트", description: "이전에 처리한 프롬프트의 일부를 다시 쓰는 비용 절감 기법", answer: "프롬프트 캐싱", options: ["프롬프트 캐싱", "프롬프트 압축", "프롬프트 복제", "프롬프트 인덱싱"], explanation: "Prompt Caching은 같은 시스템 프롬프트를 반복 사용할 때 비용·지연을 크게 줄이는 기술이에요." },
    { category: "에이전트", description: "AI 응답을 한 번에 받지 않고 글자가 흘러나오는 방식", answer: "스트리밍", options: ["스트리밍", "동기", "배치", "폴링"], explanation: "Streaming은 ChatGPT가 글자를 하나씩 뱉어내는 그 동작이에요. 체감 속도를 높여요." },
    { category: "에이전트", description: "AI가 매번 인지하는 정보, 즉 단기 기억에 해당", answer: "컨텍스트", options: ["컨텍스트", "스토리지", "메모리", "캐시"], explanation: "Context는 AI가 이번 대화에서 보는 모든 정보(시스템 프롬프트+대화 이력 등)예요." },
    { category: "에이전트", description: "AI 모델 호출 한 번을 의미하는 운영 단위", answer: "추론 호출", options: ["추론 호출", "학습 호출", "재학습 호출", "임베딩 호출"], explanation: "Inference Call은 AI에게 한 번 질문해서 답을 받는 단위. 보통 토큰 수로 비용 책정해요." },

    // ═══════════ 5. 활용 (10문제) ═══════════
    { category: "활용", description: "AI에게 정확한 지시를 내리는 기술/직군", answer: "프롬프트 엔지니어링", options: ["프롬프트 엔지니어링", "데이터 엔지니어링", "머신러닝 엔지니어링", "UX 엔지니어링"], explanation: "Prompt Engineering은 AI 시대의 핵심 역량 — 좋은 지시가 좋은 결과를 만들어요." },
    { category: "활용", description: "여러 AI 도구를 연결한 자동화 흐름", answer: "AI 워크플로", options: ["AI 워크플로", "AI 파이프라인", "AI 클러스터", "AI 데이터셋"], explanation: "예: 메일 수신 → AI 요약 → 슬랙 전달 같은 흐름이에요." },
    { category: "활용", description: "AI가 반복 업무를 사람 대신 처리해주는 것", answer: "AI 자동화", options: ["AI 자동화", "AI 분석", "AI 추천", "AI 진단"], explanation: "메일 분류, 보고서 작성, 데이터 정리 같은 일을 AI가 자동 처리해요." },
    { category: "활용", description: "고객 문의에 AI가 자동으로 답하는 시스템", answer: "AI 챗봇", options: ["AI 챗봇", "FAQ 게시판", "콜센터", "이메일 자동응답"], explanation: "AI 챗봇은 고객 문의·상담을 24시간 자동 응대하는 시스템이에요." },
    { category: "활용", description: "AI가 사용자 데이터를 보고 맞춤형 제안을 해주는 기능", answer: "AI 추천", options: ["AI 추천", "AI 광고", "AI 마케팅", "AI 알림"], explanation: "AI Recommendation은 넷플릭스·유튜브가 보여주는 \"당신을 위한\" 추천의 그 기술이에요." },
    { category: "활용", description: "코딩 경험 없이 AI와 대화만으로 웹사이트를 만드는 방식", answer: "노코드 AI", options: ["노코드 AI", "프로코드 AI", "하이브리드 AI", "쇼트코드 AI"], explanation: "No-code AI는 코드 없이 AI로 만드는 도구·접근. AI놀자 바이브 코딩 강의가 이 영역이에요." },
    { category: "활용", description: "AI가 회의 음성을 듣고 요약·할 일을 뽑아주는 기능", answer: "회의 요약 AI", options: ["회의 요약 AI", "회의록 작성기", "회의 알림", "회의 일정"], explanation: "Meeting AI는 회의 녹음을 받아 핵심 요약·결정사항·할 일을 뽑아줘요. Otter, Granola 등이 대표적." },
    { category: "활용", description: "글을 다른 언어로 자동 변환하는 AI 기능", answer: "AI 번역", options: ["AI 번역", "AI 사전", "AI 통역", "AI 변환"], explanation: "Deepl, 파파고 같은 AI 번역은 사람 번역에 가까운 수준까지 발전했어요." },
    { category: "활용", description: "긴 문서를 짧게 줄여주는 AI 기능", answer: "AI 요약", options: ["AI 요약", "AI 검색", "AI 정리", "AI 압축"], explanation: "AI Summarization은 긴 글·영상·회의록을 핵심만 추려주는 기능이에요." },
    { category: "활용", description: "AI가 외부 자료를 참고해서 출처와 함께 답하는 검색 방식", answer: "AI 검색", options: ["AI 검색", "AI 인덱싱", "AI 크롤링", "AI 파싱"], explanation: "AI Search는 Perplexity, You.com 같은 출처 기반 검색이에요. 환각이 적어요." },

    // ═══════════ 6. 윤리·규제 (5문제) ═══════════
    { category: "윤리", description: "AI가 만든 가짜 영상을 일컫는 말", answer: "딥페이크", options: ["딥페이크", "딥러닝", "메타페이크", "AI페이크"], explanation: "Deepfake는 사람 얼굴·목소리를 AI로 합성한 가짜 영상. 악용 주의가 필요해요." },
    { category: "윤리", description: "AI 학습 데이터에 다른 사람의 저작물이 들어가는 문제", answer: "저작권", options: ["저작권", "초상권", "특허권", "상표권"], explanation: "AI 학습 시 저작물 무단 사용 여부는 현재 전 세계적 법적 쟁점이에요." },
    { category: "윤리", description: "유럽연합이 2024년에 통과시킨 AI 규제 법", answer: "EU AI Act", options: ["EU AI Act", "GDPR", "DMA", "DSA"], explanation: "EU AI Act는 세계 최초의 종합 AI 규제법으로 위험도별로 의무를 차등 부과해요." },
    { category: "윤리", description: "AI 시스템의 판단 과정을 사람이 이해할 수 있게 하는 연구", answer: "설명 가능한 AI", options: ["설명 가능한 AI", "투명한 AI", "정직한 AI", "단순한 AI"], explanation: "XAI(eXplainable AI)는 \"AI가 왜 그런 답을 했는지\" 설명할 수 있게 만드는 기술이에요." },
    { category: "윤리", description: "사용자 개인 정보가 AI 학습에 쓰이지 않도록 보호하는 원칙", answer: "프라이버시", options: ["프라이버시", "보안", "암호화", "익명화"], explanation: "AI 시대 Privacy는 \"내가 입력한 정보가 어떻게 쓰이나\"의 핵심 이슈예요." },
];

// 모듈 노출 (브라우저 전역)
if (typeof window !== 'undefined') {
    window.wordPool = wordPool;
}
