// 현재 선택된 언어
let selectedLanguage = 'th'; // 기본값: 태국어

// 언어 정보
const languages = {
    th: {
        name: '태국어',
        englishName: 'Thai',
        code: 'th',
        flag: '🇹🇭'
    },
    bn: {
        name: '벵골어',
        englishName: 'Bengali',
        code: 'bn',
        flag: '🇧🇩'
    }
};

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    const inputTextarea = document.getElementById('korean-input');
    const charCounter = document.getElementById('char-counter');

    // 입력 텍스트 글자 수 카운터
    inputTextarea.addEventListener('input', function() {
        const length = this.value.length;
        charCounter.textContent = length;

        // 글자 수 색상 변경
        if (length > 900) {
            charCounter.style.color = '#f44336';
        } else if (length > 700) {
            charCounter.style.color = '#ff9800';
        } else {
            charCounter.style.color = '#999';
        }
    });

    // Enter 키로 번역 (Ctrl/Cmd + Enter)
    inputTextarea.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            translateText();
        }
    });
});

// 언어 선택
function selectLanguage(lang) {
    selectedLanguage = lang;

    // 버튼 활성화 상태 변경
    document.querySelectorAll('.lang-select-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-lang="${lang}"]`).classList.add('active');

    // 출력 라벨 변경
    const langInfo = languages[lang];
    document.getElementById('output-label').textContent = `${langInfo.name} 번역`;
    document.getElementById('output-label-en').textContent = `${langInfo.englishName} Translation`;

    // 출력창 초기화
    const outputBox = document.getElementById('output-box');
    outputBox.innerHTML = `
        <div class="placeholder">
            <span class="placeholder-icon">💬</span>
            <p>번역 결과가 여기에 표시됩니다</p>
            <p class="placeholder-sub">Translation will appear here</p>
        </div>
    `;
    outputBox.classList.remove('has-content');
    document.getElementById('copy-btn').style.display = 'none';
}

// 번역 실행
async function translateText() {
    const inputText = document.getElementById('korean-input').value.trim();

    // 입력 검증
    if (!inputText) {
        alert('번역할 한국어를 입력해주세요!\nPlease enter Korean text to translate!');
        return;
    }

    // UI 요소
    const loading = document.getElementById('loading');
    const outputBox = document.getElementById('output-box');
    const copyBtn = document.getElementById('copy-btn');
    const outputSection = document.getElementById('output-section');

    // 로딩 표시
    loading.classList.add('show');
    outputSection.style.display = 'none';

    try {
        // MyMemory Translation API 호출
        const langPair = `ko|${selectedLanguage}`;
        const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(inputText)}&langpair=${langPair}`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        // 응답 확인
        if (data.responseStatus === 200 || data.responseData) {
            let translatedText = data.responseData.translatedText;

            // 번역 후처리 (초등학생 수준 조정)
            translatedText = simplifyTranslation(translatedText, selectedLanguage);

            // 결과 표시
            displayTranslation(translatedText);
        } else {
            throw new Error('번역에 실패했습니다.');
        }
    } catch (error) {
        console.error('Translation error:', error);

        // 오류 메시지 표시
        outputBox.innerHTML = `
            <div class="placeholder" style="color: #f44336;">
                <span class="placeholder-icon">⚠️</span>
                <p><strong>번역 오류가 발생했습니다</strong></p>
                <p class="placeholder-sub">Translation error occurred</p>
                <p style="font-size: 0.9em; margin-top: 10px;">
                    인터넷 연결을 확인하거나<br>잠시 후 다시 시도해주세요
                </p>
            </div>
        `;
        outputBox.classList.remove('has-content');
    } finally {
        // 로딩 숨기기
        loading.classList.remove('show');
        outputSection.style.display = 'block';
    }
}

// 번역 단순화 (초등학생 수준)
function simplifyTranslation(text, targetLang) {
    // 기본적인 후처리
    let simplified = text;

    // 불필요한 특수문자 제거
    simplified = simplified.trim();

    // 태국어 초등 3학년 수준 조정
    if (targetLang === 'th') {
        // 태국어는 일반적으로 간단한 표현을 사용
        // API가 제공하는 번역을 그대로 사용
    }

    // 벵골어 초등 4학년 수준 조정
    if (targetLang === 'bn') {
        // 벵골어도 API 번역을 그대로 사용
        // 실제 교육 수준 조정은 전문 번역가나 교육 전문가 필요
    }

    return simplified;
}

// 번역 결과 표시
function displayTranslation(text) {
    const outputBox = document.getElementById('output-box');
    const copyBtn = document.getElementById('copy-btn');

    // 결과 표시
    outputBox.innerHTML = `<div style="white-space: pre-wrap;">${escapeHtml(text)}</div>`;
    outputBox.classList.add('has-content', 'success');

    // 복사 버튼 표시
    copyBtn.style.display = 'inline-block';

    // 성공 애니메이션 제거 (1초 후)
    setTimeout(() => {
        outputBox.classList.remove('success');
    }, 600);

    // 저장 (다음 복사 시 사용)
    outputBox.dataset.translatedText = text;
}

// HTML 이스케이프 (XSS 방지)
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 번역 결과 복사
function copyTranslation() {
    const outputBox = document.getElementById('output-box');
    const text = outputBox.dataset.translatedText;

    if (!text) {
        return;
    }

    // 클립보드에 복사
    navigator.clipboard.writeText(text).then(() => {
        // 복사 성공 메시지
        const copyBtn = document.getElementById('copy-btn');
        const originalText = copyBtn.innerHTML;

        copyBtn.innerHTML = '<span>✅</span> 복사 완료! (Copied!)';
        copyBtn.style.background = '#4caf50';
        copyBtn.style.color = 'white';
        copyBtn.style.borderColor = '#4caf50';

        // 2초 후 원래대로
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.style.background = 'white';
            copyBtn.style.color = '#667eea';
            copyBtn.style.borderColor = '#667eea';
        }, 2000);
    }).catch(err => {
        alert('복사에 실패했습니다.\nCopy failed.');
        console.error('Copy error:', err);
    });
}

// 예시 문장 사용
function useExample(text) {
    const inputTextarea = document.getElementById('korean-input');
    inputTextarea.value = text;

    // 글자 수 업데이트
    const charCounter = document.getElementById('char-counter');
    charCounter.textContent = text.length;

    // 입력창으로 스크롤
    inputTextarea.focus();

    // 자동 번역 (선택사항)
    setTimeout(() => {
        const autoTranslate = confirm('바로 번역할까요?\nTranslate now?');
        if (autoTranslate) {
            translateText();
        }
    }, 300);
}

// 키보드 단축키 안내
console.log('%c⌨️ 키보드 단축키 | Keyboard Shortcuts', 'font-size: 16px; font-weight: bold; color: #667eea;');
console.log('Ctrl/Cmd + Enter: 번역하기 (Translate)');
