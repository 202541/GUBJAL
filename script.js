// 언어 번역 데이터
const translations = {
    ko: {
        title: '구구단 퀴즈',
        subtitle: '재미있게 구구단을 배워요!',
        welcomeText: '환영합니다!',
        instruction: '2단부터 9단까지 재미있는 구구단 퀴즈에 도전해보세요!',
        startBtn: '시작하기',
        scoreLabel: '점수',
        questionCounterLabel: '문제',
        resultTitle: '퀴즈 완료!',
        finalScoreLabel: '최종 점수',
        retryBtn: '다시 하기',
        correctFeedback: '정답입니다! 👏',
        wrongFeedback: '아쉬워요! 다음 문제도 힘내요! 💪',
        resultMessages: {
            perfect: '완벽해요! 구구단 마스터! 🏆',
            excellent: '정말 잘했어요! 👍',
            good: '잘했어요! 조금만 더 연습해봐요! 😊',
            needPractice: '괜찮아요! 더 연습하면 잘할 수 있어요! 💪'
        }
    },
    th: {
        title: 'แบบทดสอบตารางสูตรคูณ',
        subtitle: 'มาเรียนรู้ตารางสูตรคูณอย่างสนุกสนาน!',
        welcomeText: 'ยินดีต้อนรับ!',
        instruction: 'มาท้าทายแบบทดสอบตารางสูตรคูณจาก 2 ถึง 9 อย่างสนุกสนาน!',
        startBtn: 'เริ่มเลย',
        scoreLabel: 'คะแนน',
        questionCounterLabel: 'ข้อ',
        resultTitle: 'เสร็จสิ้น!',
        finalScoreLabel: 'คะแนนรวม',
        retryBtn: 'เล่นอีกครั้ง',
        correctFeedback: 'ถูกต้อง! 👏',
        wrongFeedback: 'ไม่เป็นไร! ลองข้อถัดไปกันเถอะ! 💪',
        resultMessages: {
            perfect: 'สมบูรณ์แบบ! คุณเป็นเซียนคูณเลข! 🏆',
            excellent: 'ยอดเยี่ยมมาก! 👍',
            good: 'ดีมาก! ฝึกเพิ่มอีกนิดจะเก่งขึ้น! 😊',
            needPractice: 'ไม่เป็นไร! ฝึกเพิ่มแล้วจะเก่งขึ้น! 💪'
        }
    }
};

// 현재 언어 설정
let currentLanguage = 'ko';

// 게임 상태
let score = 0;
let currentQuestion = 0;
let totalQuestions = 10;
let correctAnswer = 0;
let questions = [];

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    changeLanguage('ko');
});

// 언어 변경 함수
function changeLanguage(lang) {
    currentLanguage = lang;

    // 언어 버튼 활성화 상태 변경
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`lang-${lang}`).classList.add('active');

    // 텍스트 업데이트
    const t = translations[lang];
    document.getElementById('title').textContent = t.title;
    document.getElementById('subtitle').textContent = t.subtitle;
    document.getElementById('welcome-text').textContent = t.welcomeText;
    document.getElementById('instruction').textContent = t.instruction;
    document.getElementById('start-btn').textContent = t.startBtn;
    document.getElementById('score-label').textContent = t.scoreLabel;
    document.getElementById('question-counter-label').textContent = t.questionCounterLabel;
    document.getElementById('result-title').textContent = t.resultTitle;
    document.getElementById('final-score-label').textContent = t.finalScoreLabel;
    document.getElementById('retry-btn').textContent = t.retryBtn;
}

// 퀴즈 시작
function startQuiz() {
    score = 0;
    currentQuestion = 0;
    questions = generateQuestions();

    // 화면 전환
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('result-screen').classList.add('hidden');
    document.getElementById('quiz-screen').classList.remove('hidden');

    // 점수 초기화
    updateScore();

    // 첫 문제 표시
    showQuestion();
}

// 문제 생성
function generateQuestions() {
    const questions = [];
    const usedQuestions = new Set();

    while (questions.length < totalQuestions) {
        const num1 = Math.floor(Math.random() * 8) + 2; // 2-9
        const num2 = Math.floor(Math.random() * 9) + 1; // 1-9
        const questionKey = `${num1}x${num2}`;

        // 중복 방지
        if (!usedQuestions.has(questionKey)) {
            usedQuestions.add(questionKey);
            questions.push({
                num1: num1,
                num2: num2,
                answer: num1 * num2
            });
        }
    }

    return questions;
}

// 문제 표시
function showQuestion() {
    if (currentQuestion >= totalQuestions) {
        showResult();
        return;
    }

    const question = questions[currentQuestion];
    correctAnswer = question.answer;

    // 문제 텍스트 업데이트
    document.getElementById('question').textContent = `${question.num1} × ${question.num2} = ?`;

    // 문제 카운터 업데이트
    document.getElementById('question-counter').textContent = `${currentQuestion + 1}/${totalQuestions}`;

    // 답변 버튼 생성
    const answers = generateAnswers(correctAnswer);
    const answersGrid = document.getElementById('answers-grid');
    answersGrid.innerHTML = '';

    answers.forEach(answer => {
        const button = document.createElement('button');
        button.className = 'answer-btn';
        button.textContent = answer;
        button.onclick = () => checkAnswer(answer, button);
        answersGrid.appendChild(button);
    });

    // 피드백 숨기기
    document.getElementById('feedback').classList.add('hidden');
}

// 답변 생성 (정답 1개 + 오답 3개)
function generateAnswers(correctAnswer) {
    const answers = [correctAnswer];
    const usedAnswers = new Set([correctAnswer]);

    while (answers.length < 4) {
        // 정답 근처의 숫자들을 오답으로 생성
        const offset = Math.floor(Math.random() * 10) - 5; // -5 ~ +5
        let wrongAnswer = correctAnswer + offset;

        // 음수나 0 방지
        if (wrongAnswer < 1) wrongAnswer = correctAnswer + Math.abs(offset);

        if (!usedAnswers.has(wrongAnswer)) {
            usedAnswers.add(wrongAnswer);
            answers.push(wrongAnswer);
        }
    }

    // 답변 섞기
    return answers.sort(() => Math.random() - 0.5);
}

// 답변 체크
function checkAnswer(selectedAnswer, button) {
    const t = translations[currentLanguage];
    const feedback = document.getElementById('feedback');
    const allButtons = document.querySelectorAll('.answer-btn');

    // 모든 버튼 비활성화
    allButtons.forEach(btn => {
        btn.style.pointerEvents = 'none';
    });

    if (selectedAnswer === correctAnswer) {
        // 정답
        button.classList.add('correct');
        feedback.textContent = t.correctFeedback;
        feedback.className = 'feedback correct';
        score++;
    } else {
        // 오답
        button.classList.add('wrong');
        feedback.textContent = t.wrongFeedback;
        feedback.className = 'feedback wrong';

        // 정답 표시
        allButtons.forEach(btn => {
            if (parseInt(btn.textContent) === correctAnswer) {
                btn.classList.add('correct');
            }
        });
    }

    feedback.classList.remove('hidden');
    updateScore();

    // 다음 문제로 이동
    setTimeout(() => {
        currentQuestion++;
        allButtons.forEach(btn => {
            btn.style.pointerEvents = 'auto';
        });
        showQuestion();
    }, 2000);
}

// 점수 업데이트
function updateScore() {
    document.getElementById('score').textContent = score;
}

// 결과 표시
function showResult() {
    const t = translations[currentLanguage];

    // 화면 전환
    document.getElementById('quiz-screen').classList.add('hidden');
    document.getElementById('result-screen').classList.remove('hidden');

    // 최종 점수
    document.getElementById('final-score').textContent = `${score}/${totalQuestions}`;

    // 결과 메시지 및 이모지
    let message, emoji;
    const percentage = (score / totalQuestions) * 100;

    if (percentage === 100) {
        message = t.resultMessages.perfect;
        emoji = '🏆';
    } else if (percentage >= 70) {
        message = t.resultMessages.excellent;
        emoji = '🎉';
    } else if (percentage >= 50) {
        message = t.resultMessages.good;
        emoji = '😊';
    } else {
        message = t.resultMessages.needPractice;
        emoji = '💪';
    }

    document.getElementById('result-message').textContent = message;
    document.getElementById('result-emoji').textContent = emoji;
}
