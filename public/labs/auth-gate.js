// AI놀자 실험실 — 공통 로그인 가드
//
// 모든 /labs/*.html 상단(head)에서 가장 먼저 로드되어야 합니다.
// 비로그인 방문자는 /login?next=현재경로 로 즉시 보냅니다.
//
// 왜 클라이언트에서 검사하나:
//   - 정적 HTML이 Cloudflare CDN에 캐시되면 Next.js 미들웨어가 실행되지 않음.
//   - 이 한 줄짜리 스크립트는 매 요청마다 fetch로 세션을 확인해서
//     CDN 캐시 영향과 무관하게 항상 로그인 상태를 강제함.
;(function labsAuthGate() {
    // 페이지 렌더 깜빡임 최소화 — 응답 받기 전엔 body 가림
    try {
        var styleEl = document.createElement('style');
        styleEl.id = 'labs-auth-gate-style';
        styleEl.textContent = 'body{visibility:hidden}';
        (document.head || document.documentElement).appendChild(styleEl);
    } catch (_) {}

    function reveal() {
        var el = document.getElementById('labs-auth-gate-style');
        if (el) el.remove();
    }

    fetch('/api/users/me', { credentials: 'include' })
        .then(function (res) { return res.ok ? res.json() : null; })
        .then(function (data) {
            if (data && data.user) {
                reveal();
            } else {
                var next = encodeURIComponent(location.pathname + location.search);
                location.replace('/login?next=' + next);
            }
        })
        .catch(function () {
            // 네트워크 오류 시 도구를 완전히 차단하면 사용자 경험 더 나쁨 → 일단 노출
            reveal();
        });
})();
