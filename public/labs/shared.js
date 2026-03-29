// AI놀자 실험실 공통 모듈

// 교육 전환 CTA 배너 생성
function createCTABanner(container) {
    const banner = document.createElement('div');
    banner.className = 'mt-6 p-5 rounded-2xl bg-gradient-to-r from-fuchsia-500/10 to-cyan-500/10 border border-fuchsia-500/20 text-center';
    banner.innerHTML = `
        <p class="text-sm text-gray-300 mb-3">AI를 더 깊이 배우고 싶다면?</p>
        <a href="/programs/vibe-coding" class="inline-block px-6 py-3 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-bold text-sm rounded-xl transition-all hover:scale-105">
            AI 바이브 코딩 클래스 보러가기 &rarr;
        </a>
        <p class="text-xs text-gray-500 mt-2">코딩 경험 0도 OK. AI로 나만의 웹사이트를 만들어보세요.</p>
    `;
    container.appendChild(banner);
}

// 결과 공유 이미지 생성 (Canvas API) - 카카오톡 공유에 최적화된 1:1 비율
function createShareImage(options) {
    const { gameName, score, subtitle, badgeText } = options;

    const canvas = document.createElement('canvas');
    canvas.width = 720;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');

    // 배경 그라데이션
    const bg = ctx.createLinearGradient(0, 0, 720, 720);
    bg.addColorStop(0, '#0a0a1a');
    bg.addColorStop(0.5, '#1a0f2e');
    bg.addColorStop(1, '#0f1a2e');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 720, 720);

    // 장식 원들
    ctx.globalAlpha = 0.08;
    ctx.beginPath(); ctx.arc(580, 120, 160, 0, Math.PI * 2); ctx.fillStyle = '#8b5cf6'; ctx.fill();
    ctx.beginPath(); ctx.arc(140, 600, 120, 0, Math.PI * 2); ctx.fillStyle = '#06b6d4'; ctx.fill();
    ctx.beginPath(); ctx.arc(600, 550, 80, 0, Math.PI * 2); ctx.fillStyle = '#f59e0b'; ctx.fill();
    ctx.globalAlpha = 1;

    // 상단 로고
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('AI\ub180\uc790', 360, 60);

    // 구분선
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(260, 80); ctx.lineTo(460, 80); ctx.stroke();

    // 게임명
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(gameName, 360, 140);

    // 점수 (메인)
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 96px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(score, 360, 300);

    // 부제
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '24px sans-serif';
    ctx.fillText(subtitle, 360, 350);

    // 뱃지
    if (badgeText) {
        ctx.font = 'bold 18px sans-serif';
        const badgeWidth = ctx.measureText(badgeText).width + 50;
        const badgeX = 360 - badgeWidth / 2;
        ctx.fillStyle = 'rgba(139, 92, 246, 0.25)';
        roundRect(ctx, badgeX, 385, badgeWidth, 44, 22);
        ctx.fill();
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.5)';
        ctx.lineWidth = 1.5;
        roundRect(ctx, badgeX, 385, badgeWidth, 44, 22);
        ctx.stroke();
        ctx.fillStyle = '#c4b5fd';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText(badgeText, 360, 413);
    }

    // 하단 안내
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.font = '16px sans-serif';
    ctx.fillText('\ub098\ub3c4 \ub3c4\uc804\ud574\ubcf4\uc138\uc694!', 360, 530);

    // 하단 URL 배경
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fillRect(0, 640, 720, 80);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath(); ctx.moveTo(0, 640); ctx.lineTo(720, 640); ctx.stroke();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('AI\ub180\uc790 | \ub180\uba74\uc11c \ubc30\uc6b0\ub294 AI \uad50\uc721', 360, 670);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.font = '13px sans-serif';
    ctx.fillText('ainolza-web.stressoutcompany.workers.dev', 360, 695);

    return canvas;
}

// 수료증 이미지 생성
function createCertificateImage(options) {
    const { userName, gameName, achievement, date } = options;

    const canvas = document.createElement('canvas');
    canvas.width = 720;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');

    // 배경
    const bg = ctx.createLinearGradient(0, 0, 720, 720);
    bg.addColorStop(0, '#0f172a');
    bg.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 720, 720);

    // 테두리
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.3)';
    ctx.lineWidth = 3;
    roundRect(ctx, 30, 30, 660, 660, 20);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.15)';
    ctx.lineWidth = 1;
    roundRect(ctx, 45, 45, 630, 630, 16);
    ctx.stroke();

    // 장식
    ctx.globalAlpha = 0.06;
    ctx.beginPath(); ctx.arc(100, 100, 80, 0, Math.PI * 2); ctx.fillStyle = '#fbbf24'; ctx.fill();
    ctx.beginPath(); ctx.arc(620, 620, 80, 0, Math.PI * 2); ctx.fillStyle = '#8b5cf6'; ctx.fill();
    ctx.globalAlpha = 1;

    // 상단: 수료증
    ctx.fillStyle = 'rgba(250, 204, 21, 0.8)';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('\u2605 CERTIFICATE \u2605', 360, 100);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('\uc218\ub8cc\uc99d', 360, 155);

    // 구분선
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(200, 180); ctx.lineTo(520, 180); ctx.stroke();

    // 이름
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '18px sans-serif';
    ctx.fillText('\uc704 \uc0ac\ub78c\uc740', 360, 240);

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 42px sans-serif';
    ctx.fillText(userName || 'AI \ud559\uc2b5\uc790', 360, 295);

    // 내용
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '18px sans-serif';
    ctx.fillText('AI\ub180\uc790 ' + gameName + '\uc744(\ub97c) \uc644\ub8cc\ud558\uace0', 360, 365);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText(achievement, 360, 415);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '18px sans-serif';
    ctx.fillText('\uc758 \uc131\uc801\uc744 \uac70\ub450\uc5c8\uc74c\uc744 \uc99d\uba85\ud569\ub2c8\ub2e4.', 360, 455);

    // 날짜
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.font = '14px sans-serif';
    ctx.fillText(date || new Date().toISOString().split('T')[0], 360, 530);

    // 하단 로고
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.2)';
    ctx.beginPath(); ctx.moveTo(200, 570); ctx.lineTo(520, 570); ctx.stroke();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('AI\ub180\uc790', 360, 610);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.font = '13px sans-serif';
    ctx.fillText('\ub180\uba74\uc11c \ubc30\uc6b0\ub294 AI \uad50\uc721 \ud50c\ub7ab\ud3fc', 360, 640);

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

// 공유 버튼 그룹 생성 (결과 이미지 + 수료증 + 링크 복사)
function createShareButtons(container, options) {
    const wrap = document.createElement('div');
    wrap.className = 'flex flex-wrap justify-center gap-2 mt-4';

    // 결과 이미지 저장
    const saveBtn = document.createElement('button');
    saveBtn.className = 'px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-600 text-sm font-medium text-gray-300 transition-all flex items-center gap-2';
    saveBtn.innerHTML = '<i class="fa-solid fa-image"></i> \uacb0\uacfc \uc774\ubbf8\uc9c0';
    saveBtn.onclick = () => {
        const canvas = createShareImage(options);
        downloadShareImage(canvas, `ainolza-${options.gameName.replace(/\s/g, '-')}.png`);
    };

    // 수료증 저장
    const certBtn = document.createElement('button');
    certBtn.className = 'px-4 py-2 rounded-xl bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/40 text-sm font-medium text-yellow-300 transition-all flex items-center gap-2';
    certBtn.innerHTML = '<i class="fa-solid fa-certificate"></i> \uc218\ub8cc\uc99d';
    certBtn.onclick = () => {
        const name = prompt('\uc218\ub8cc\uc99d\uc5d0 \ub4e4\uc5b4\uac08 \uc774\ub984\uc744 \uc785\ub825\ud558\uc138\uc694:') || '';
        if (!name) return;
        const canvas = createCertificateImage({
            userName: name,
            gameName: options.gameName,
            achievement: options.score,
            date: new Date().toISOString().split('T')[0]
        });
        downloadShareImage(canvas, `ainolza-certificate-${options.gameName.replace(/\s/g, '-')}.png`);
    };

    // 링크 복사
    const copyBtn = document.createElement('button');
    copyBtn.className = 'px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-600 text-sm font-medium text-gray-300 transition-all flex items-center gap-2';
    copyBtn.innerHTML = '<i class="fa-solid fa-link"></i> \ub9c1\ud06c \ubcf5\uc0ac';
    copyBtn.onclick = () => {
        navigator.clipboard.writeText(window.location.href);
        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> \ubcf5\uc0ac\ub428!';
        setTimeout(() => { copyBtn.innerHTML = '<i class="fa-solid fa-link"></i> \ub9c1\ud06c \ubcf5\uc0ac'; }, 2000);
    };

    wrap.appendChild(saveBtn);
    wrap.appendChild(certBtn);
    wrap.appendChild(copyBtn);
    container.appendChild(wrap);
}
