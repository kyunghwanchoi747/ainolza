// AI놀자 실험실 공통 모듈

// 교육 전환 CTA 배너 생성
function createCTABanner(container) {
    const banner = document.createElement('div');
    banner.className = 'mt-6 p-5 rounded-2xl bg-gradient-to-r from-fuchsia-500/10 to-cyan-500/10 border border-fuchsia-500/20 text-center';
    banner.innerHTML = `
        <p class="text-sm text-gray-300 mb-3">AI를 더 깊이 배우고 싶다면?</p>
        <a href="/programs/vibe-coding" class="inline-block px-6 py-3 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-bold text-sm rounded-xl transition-all hover:scale-105">
            AI 바이브 코딩 클래스 보러가기 →
        </a>
        <p class="text-xs text-gray-500 mt-2">코딩 경험 0도 OK. AI로 나만의 웹사이트를 만들어보세요.</p>
    `;
    container.appendChild(banner);
}

// 결과 공유 이미지 생성 (Canvas API)
function createShareImage(options) {
    const { gameName, score, subtitle, badgeText } = options;

    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');

    // 배경
    const bg = ctx.createLinearGradient(0, 0, 600, 400);
    bg.addColorStop(0, '#0f0f1a');
    bg.addColorStop(1, '#1a0f2e');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 600, 400);

    // 장식 원
    ctx.beginPath();
    ctx.arc(500, 80, 120, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(139, 92, 246, 0.1)';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(100, 350, 80, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(6, 182, 212, 0.1)';
    ctx.fill();

    // 상단 로고
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = 'bold 14px Pretendard, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('AI놀자', 30, 40);

    // 게임명
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '16px Pretendard, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(gameName, 300, 100);

    // 점수 (큰 글씨)
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 72px Pretendard, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(score, 300, 200);

    // 부제
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '18px Pretendard, sans-serif';
    ctx.fillText(subtitle, 300, 240);

    // 뱃지
    if (badgeText) {
        const badgeWidth = ctx.measureText(badgeText).width + 40;
        const badgeX = 300 - badgeWidth / 2;
        ctx.fillStyle = 'rgba(139, 92, 246, 0.3)';
        roundRect(ctx, badgeX, 260, badgeWidth, 36, 18);
        ctx.fill();
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.6)';
        ctx.lineWidth = 1;
        roundRect(ctx, badgeX, 260, badgeWidth, 36, 18);
        ctx.stroke();
        ctx.fillStyle = '#a78bfa';
        ctx.font = 'bold 14px Pretendard, sans-serif';
        ctx.fillText(badgeText, 300, 283);
    }

    // 하단 URL
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.font = '12px Pretendard, sans-serif';
    ctx.fillText('ainolza.com | 놀면서 배우는 AI 교육', 300, 375);

    return canvas;
}

// 둥근 사각형 헬퍼
function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

// 이미지 다운로드
function downloadShareImage(canvas, filename) {
    const link = document.createElement('a');
    link.download = filename || 'ainolza-result.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// 공유 버튼 그룹 생성
function createShareButtons(container, options) {
    const wrap = document.createElement('div');
    wrap.className = 'flex justify-center gap-3 mt-4';

    // 이미지 저장
    const saveBtn = document.createElement('button');
    saveBtn.className = 'px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-600 text-sm font-medium text-gray-300 transition-all flex items-center gap-2';
    saveBtn.innerHTML = '<i class="fa-solid fa-download"></i> 결과 이미지 저장';
    saveBtn.onclick = () => {
        const canvas = createShareImage(options);
        downloadShareImage(canvas, `ainolza-${options.gameName.replace(/\s/g, '-')}.png`);
    };

    // 링크 복사
    const copyBtn = document.createElement('button');
    copyBtn.className = 'px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-600 text-sm font-medium text-gray-300 transition-all flex items-center gap-2';
    copyBtn.innerHTML = '<i class="fa-solid fa-link"></i> 링크 복사';
    copyBtn.onclick = () => {
        navigator.clipboard.writeText(window.location.href);
        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> 복사됨!';
        setTimeout(() => { copyBtn.innerHTML = '<i class="fa-solid fa-link"></i> 링크 복사'; }, 2000);
    };

    wrap.appendChild(saveBtn);
    wrap.appendChild(copyBtn);
    container.appendChild(wrap);
}
