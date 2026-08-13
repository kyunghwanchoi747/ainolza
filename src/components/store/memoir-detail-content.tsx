/**
 * "부모님의 일생" 자서전·오디오북·다큐멘터리 상품 상세페이지 본문.
 * design-handoff/memoir/jaseojeon.html 디자인을 그대로 이식.
 * 자체 CSS 변수/scene 단위 스크롤 연출 체계라 Tailwind로 재작성하지 않고
 * 원본 <style> 블록을 이 컴포넌트 스코프로 그대로 옮김.
 * 이미지: public/memoir/1~4.jpg
 */
export function MemoirDetailContent() {
  return (
    <div className="memoirRoot">
      <style>{`
.memoirRoot{
  --ink:#171412;
  --hanji:#F7F4EF;
  --hanji-2:#EFEAE1;
  --seal:#8C2F23;
  --slate:#3D4A52;
  --muted:#6B645E;
  --line:#D9D2C7;

  --bg:var(--hanji);
  --bg-alt:var(--hanji-2);
  --bg-deep:var(--ink);
  --fg:var(--ink);
  --fg-muted:var(--muted);
  --fg-on-deep:#F0EBE3;
  --fg-on-deep-muted:#A79F95;
  --rule:var(--line);
  --accent:var(--seal);
  --accent-on-deep:#C4553F;

  --serif:"Noto Serif KR",NanumMyeongjo,"Nanum Myeongjo","AppleMyungjo",Georgia,serif;
  --sans:"Pretendard","Noto Sans KR","Apple SD Gothic Neo","Malgun Gothic",system-ui,sans-serif;

  --s1:.5rem; --s2:1rem; --s3:1.4rem; --s4:2.2rem; --s5:3rem; --s6:5rem;
  --measure:34rem;

  background:var(--bg);
  color:var(--fg);
  font-family:var(--sans);
  font-size:17px;
  line-height:1.85;
  -webkit-font-smoothing:antialiased;
  -moz-osx-font-smoothing:grayscale;
  text-rendering:optimizeLegibility;
  word-break:keep-all;
}
@media (prefers-color-scheme:dark){
  .memoirRoot:not([data-theme="light"]){
    --bg:#14120F;
    --bg-alt:#1C1916;
    --bg-deep:#0C0B09;
    --fg:#EDE7DE;
    --fg-muted:#9A9187;
    --fg-on-deep:#EDE7DE;
    --fg-on-deep-muted:#8F877D;
    --rule:#332E28;
    --accent:#C4553F;
    --accent-on-deep:#C4553F;
  }
}

.memoirRoot *{box-sizing:border-box}
.memoirRoot h1,.memoirRoot h2,.memoirRoot h3{font-family:var(--serif);text-wrap:balance;margin:0;line-height:1.5}
.memoirRoot h1,.memoirRoot h2,.memoirRoot h3,.memoirRoot .display,.memoirRoot .lead,.memoirRoot .beat,.memoirRoot .quote,.memoirRoot .eyebrow,.memoirRoot .tagline{font-weight:500;-webkit-font-smoothing:antialiased}
.memoirRoot p{margin:0}

.memoirRoot .scene{
  min-height:62vh;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  padding:var(--s6) var(--s3);
  border-bottom:1px solid var(--rule);
  position:relative;
  text-align:center;
}
.memoirRoot .scene--short{min-height:auto;padding-block:var(--s5)}
.memoirRoot .scene--breath{min-height:92vh;padding-block:calc(var(--s6) * 1.6)}
.memoirRoot .scene--dense{min-height:auto;padding-block:var(--s5)}
.memoirRoot .scene--deep{background:var(--bg-deep);color:var(--fg-on-deep);border-bottom-color:transparent}
.memoirRoot .scene--deep .kicker{color:var(--fg-on-deep-muted)}
.memoirRoot .scene--deep .sub{color:var(--fg-on-deep-muted)}
.memoirRoot .scene--alt{background:var(--bg-alt)}
.memoirRoot .scene--left{text-align:left;align-items:flex-start}

.memoirRoot .inner{width:100%;max-width:var(--measure);display:flex;flex-direction:column;gap:var(--s3)}
.memoirRoot .inner--wide{max-width:56rem}

.memoirRoot .kicker{
  font-size:.74rem;letter-spacing:.22em;text-transform:uppercase;
  color:var(--fg-muted);font-family:var(--sans);
}
.memoirRoot .display{font-size:clamp(1.9rem,5.2vw,3.1rem);letter-spacing:-.01em}
.memoirRoot .display--xl{font-size:clamp(2.3rem,7vw,4.2rem);line-height:1.35}
.memoirRoot .lead{font-family:var(--serif);font-size:clamp(1.25rem,3vw,1.7rem);line-height:1.85}
.memoirRoot .sub{color:var(--fg-muted);font-size:.98rem;line-height:1.9}
.memoirRoot .sub b{font-weight:700;color:var(--fg)}
.memoirRoot .note{font-size:.82rem;color:var(--fg-muted)}
.memoirRoot .memoirTop{margin-top:calc(var(--s6) * -1.2);margin-bottom:var(--s5)}
.memoirRoot .lnk{color:var(--accent);text-decoration:none;border-bottom:1px solid currentColor;padding-bottom:1px}

.memoirRoot .sealWrap{display:flex;flex-direction:column;align-items:center;gap:.6rem;align-self:center}
.memoirRoot .seal{
  width:76px;height:76px;background:var(--accent);color:#FDFBF8;
  border-radius:4px;display:grid;place-items:center;
  font-family:var(--serif);font-size:2.7rem;line-height:1;padding-bottom:.08em;
  box-shadow:inset 0 0 0 1px rgba(255,255,255,.22);
}
.memoirRoot .sealLabel{font-family:var(--sans);font-size:.88rem;font-weight:500;
  letter-spacing:.34em;text-indent:.34em;color:var(--accent)}
.memoirRoot .scene--deep .seal{background:var(--accent-on-deep);color:#12100E}
.memoirRoot .scene--deep .sealLabel{color:var(--accent-on-deep)}
.memoirRoot .eyebrow{font-family:var(--serif);font-size:clamp(1.05rem,3vw,1.5rem);letter-spacing:.02em;color:var(--fg-muted);line-height:1.7}
.memoirRoot .tagline{font-family:var(--serif);font-size:clamp(1.05rem,2.8vw,1.4rem);letter-spacing:.04em;color:var(--fg);line-height:1.8}
.memoirRoot .taglineList{list-style:none;padding:0;margin:0 0 1.4rem;display:flex;flex-direction:column;gap:.55rem;
  font-family:var(--serif);font-size:clamp(1.05rem,2.8vw,1.4rem);letter-spacing:.06em;color:var(--fg);line-height:1.7}
.memoirRoot .scene--deep .eyebrow,.memoirRoot .scene--deep .tagline{color:var(--fg-on-deep-muted)}
.memoirRoot .scene--deep .taglineList{color:var(--fg-on-deep)}

.memoirRoot .rule{width:1px;height:var(--s5);background:var(--rule);align-self:center}
.memoirRoot .rule--h{width:3rem;height:1px;align-self:center}

.memoirRoot .figure{width:100%;margin:0}
.memoirRoot .figure img{width:100%;height:auto;display:block}
.memoirRoot .figure--tall{max-width:22rem;margin-inline:auto}

.memoirRoot .list{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:var(--s2);text-align:left}
.memoirRoot .list li{padding-left:1.4rem;position:relative;line-height:1.8}
.memoirRoot .list li::before{content:"";position:absolute;left:0;top:.85em;width:.5rem;height:1px;background:var(--accent)}
.memoirRoot .list--center{text-align:center;align-items:center}
.memoirRoot .list--center li{padding-left:0}
.memoirRoot .list--center li::before{display:none}

.memoirRoot .pieces{display:grid;grid-template-columns:repeat(auto-fit,minmax(11rem,1fr));gap:1px;background:var(--rule);border:1px solid var(--rule);width:100%}
.memoirRoot .piece{background:var(--bg);padding:var(--s3) var(--s2);display:flex;flex-direction:column;gap:.4rem;align-items:center}
.memoirRoot .piece dt{font-family:var(--serif);font-size:1.12rem}
.memoirRoot .piece dd{margin:0;font-size:.8rem;color:var(--fg-muted);letter-spacing:.04em}

.memoirRoot .steps{display:flex;flex-direction:column;gap:0;width:100%;text-align:left}
.memoirRoot .step{display:grid;grid-template-columns:2.6rem 1fr;gap:var(--s2);padding:var(--s3) 0;border-top:1px solid var(--rule)}
.memoirRoot .step:last-child{border-bottom:1px solid var(--rule)}
.memoirRoot .step-n{font-family:var(--serif);color:var(--accent);font-variant-numeric:tabular-nums;font-size:1rem;padding-top:.15rem}
.memoirRoot .step-t{font-family:var(--serif);font-size:1.2rem;display:block;margin-bottom:.2rem}
.memoirRoot .step-d{font-size:.92rem;color:var(--fg-muted);line-height:1.8}
.memoirRoot .ways{list-style:none;padding:0;margin:.9rem 0 0;display:flex;flex-direction:column;gap:.55rem;font-size:.9rem}
.memoirRoot .ways li{padding-left:.95rem;position:relative;color:var(--fg-muted);line-height:1.75}
.memoirRoot .ways li::before{content:"·";position:absolute;left:.1rem;color:var(--accent)}
.memoirRoot .ways b{font-weight:400;color:var(--fg);font-family:var(--serif)}

.memoirRoot .split{display:grid;grid-template-columns:repeat(auto-fit,minmax(8rem,1fr));gap:1px;background:var(--rule);border:1px solid var(--rule);width:100%}
.memoirRoot .split div{background:var(--bg);padding:var(--s3) var(--s1);display:flex;flex-direction:column;gap:.3rem;align-items:center}
.memoirRoot .split b{font-family:var(--serif);font-size:1.35rem;font-weight:400;font-variant-numeric:tabular-nums}
.memoirRoot .split span{font-size:.76rem;color:var(--fg-muted);letter-spacing:.1em}

.memoirRoot .tiers{display:flex;flex-direction:column;gap:var(--s3);width:100%}
@media (min-width:820px){
  .memoirRoot .tiers{display:grid;grid-template-columns:1fr 1fr;align-items:start;gap:var(--s4)}
}
.memoirRoot .tier{border:1px solid var(--rule);padding:var(--s4) var(--s3);text-align:left;display:flex;flex-direction:column;gap:var(--s2)}
.memoirRoot .tier--lead{border-color:var(--accent);border-width:1.5px;background:var(--bg-alt)}
.memoirRoot .tier-name{font-family:var(--serif);letter-spacing:.3em;font-size:.9rem;color:var(--accent)}
.memoirRoot .tier-price{font-family:var(--serif);font-size:clamp(2rem,6vw,3rem);font-variant-numeric:tabular-nums;line-height:1.2}
.memoirRoot .tier--sub .tier-price{font-size:clamp(1.4rem,4vw,1.9rem)}
.memoirRoot .tier--sub{opacity:.82}
.memoirRoot .tier ul{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:.45rem;font-size:.93rem;color:var(--fg-muted)}
.memoirRoot .tier ul li{padding-left:1rem;position:relative}
.memoirRoot .tier ul li::before{content:"·";position:absolute;left:.2rem;color:var(--accent)}

.memoirRoot .sched{width:100%;text-align:left;display:flex;flex-direction:column}
.memoirRoot .sched-row{display:grid;grid-template-columns:6.5rem 1fr;gap:var(--s2);padding:var(--s2) 0;border-top:1px solid var(--rule);align-items:baseline}
.memoirRoot .sched-row:last-of-type{border-bottom:1px solid var(--rule)}
.memoirRoot .sched-when{font-family:var(--serif);color:var(--accent);font-size:.95rem;font-variant-numeric:tabular-nums}
.memoirRoot .sched-what{font-size:.98rem}

.memoirRoot .actions{display:flex;flex-wrap:wrap;gap:var(--s2);justify-content:center}
.memoirRoot .btn{
  font-family:var(--sans);font-size:.98rem;letter-spacing:.06em;
  padding:1.05rem 2.4rem;border:1px solid currentColor;
  text-decoration:none;display:inline-block;transition:background .25s,color .25s;
}
.memoirRoot .btn--primary{background:var(--accent);border-color:var(--accent);color:#FDFBF8}
.memoirRoot .btn--primary:hover{background:transparent;color:var(--accent)}
.memoirRoot .scene--deep .btn--primary{color:#12100E}
.memoirRoot .scene--deep .btn--primary:hover{color:var(--accent-on-deep)}
.memoirRoot .btn--ghost{color:var(--fg);background:transparent}
.memoirRoot .btn--ghost:hover{background:var(--fg);color:var(--bg)}
.memoirRoot .scene--deep .btn--ghost{color:var(--fg-on-deep)}
.memoirRoot .scene--deep .btn--ghost:hover{background:var(--fg-on-deep);color:var(--bg-deep)}

.memoirRoot .beat{font-family:var(--serif);font-size:clamp(1.6rem,4.6vw,2.6rem);line-height:1.7}
.memoirRoot .beat em,.memoirRoot .display em,.memoirRoot .em{font-style:normal;color:var(--accent)}
.memoirRoot .mark{font-weight:700}
.memoirRoot .hl{font-weight:700;background:linear-gradient(transparent 52%,rgba(194,146,36,1) 52%,rgba(194,146,36,1) 92%,transparent 92%);
  padding:0 .15em;box-decoration-break:clone;-webkit-box-decoration-break:clone}
.memoirRoot .scene--deep .hl{background:linear-gradient(transparent 52%,rgba(194,146,36,1) 52%,rgba(194,146,36,1) 92%,transparent 92%)}

.memoirRoot .quote{font-family:var(--serif);font-size:clamp(1.7rem,5.5vw,2.9rem);line-height:1.6;position:relative}

.memoirRoot footer{padding:var(--s5) var(--s3);text-align:center;background:var(--bg-deep);color:var(--fg-on-deep-muted);font-size:.82rem;display:flex;flex-direction:column;gap:var(--s2);align-items:center}
.memoirRoot footer a{color:var(--fg-on-deep);text-decoration:none;border-bottom:1px solid rgba(255,255,255,.25);padding-bottom:2px}

@media (prefers-reduced-motion:reduce){.memoirRoot *{animation:none!important;transition:none!important}}
@media (max-width:560px){
  .memoirRoot{--s6:3rem;--s5:2rem}
  .memoirRoot .scene{min-height:auto;padding-block:var(--s6)}
  .memoirRoot .scene--breath{min-height:auto;padding-block:calc(var(--s6) * 1.5)}
  .memoirRoot .figure{width:100%;margin:0}
  .memoirRoot .figure img{width:100%;height:auto;display:block}
  .memoirRoot .figure--tall{max-width:22rem;margin-inline:auto}
}
      `}</style>

      {/* ══ 1부 감정 ══ */}
      <section className="scene scene--breath">
        <div className="inner">
          <p className="eyebrow">누구의 일생에도, 한 편의 영화가 있습니다</p>
          <h2 className="display display--xl">부모님의 일생을<br /><em className="em">영화처럼</em><br />보게 됩니다</h2>
          <div className="rule"></div>
          <ul className="taglineList">
            <li>자서전</li>
            <li>전자책</li>
            <li>목소리 오디오북</li>
            <li>영상 다큐멘터리</li>
          </ul>
          <div className="sealWrap"><span className="seal" aria-hidden="true">記</span><span className="sealLabel">기록</span></div>
        </div>
      </section>

      <section className="scene scene--alt">
        <div className="inner">
          <h2 className="display">부모님의 인생 이야기<br />얼마나 눈부셨는지<br />들어보신 적 있으신가요?</h2>
          <figure className="figure"><img src="/memoir/1.jpg" alt="부모님 젊은 시절" /></figure>
          <p className="lead">언젠가 여쭤보면 된다고 미뤘습니다.<br />언젠가 들을 수 있다고 생각했습니다.</p>
          <p className="beat">그런데 그 &lsquo;언젠가&rsquo;는<br />생각보다 빨리 지나갑니다.</p>
        </div>
      </section>

      <section className="scene scene--deep scene--breath">
        <div className="inner">
          <p className="quote">&ldquo;<br />그때 여쭤볼걸<br />&rdquo;</p>
        </div>
      </section>

      <section className="scene scene--breath">
        <div className="inner">
          <p className="beat">후회로 남지 않도록</p>
          <p className="beat">어디서도 볼 수 없었던</p>
          <p className="beat"><span className="mark">세상에 단 하나뿐인 기록</span>으로<br />준비했습니다.</p>
        </div>
      </section>

      <section className="scene scene--alt">
        <div className="inner">
          <p className="lead">온 가족이 모여</p>
          <div className="rule"></div>
          <p className="beat">부모님의 일생을<br />영화처럼 보게 됩니다</p>
        </div>
      </section>

      {/* ══ 2부 선망 ══ */}
      <section className="scene scene--alt">
        <div className="inner">
          <p className="beat">자서전은 원래<br />회장님들의 것이었습니다.</p>
          <p className="sub">기업 창업주, 정치인, 명망가.<br />일생을 정리해 책으로 남기는 일은<br />오래도록 그분들의 몫이었습니다.</p>
          <div className="rule"></div>
          <p className="beat">그런데 그분들의 일생이<br />우리 부모님의 일생보다<br /><em>더 대단할 이유가 있습니까.</em></p>
        </div>
      </section>

      {/* ══ 3부 증거 ══ */}
      <section className="scene">
        <div className="inner">
          <p className="lead">지난해</p>
          <p className="lead">은퇴하신 한 회장님의<br />자서전을 만들었습니다.</p>
          <figure className="figure figure--tall"><img src="/memoir/2.jpg" alt="회장님 자서전" /></figure>
          <p className="sub">상품으로 만들려고 시작한 일이 아니었습니다.</p>
          <p className="sub">이야기를 듣다보니 이런 것을 만들어보면 어떨까<br />진심을 담았고<br />그 생각 하나로 시작했습니다.</p>
        </div>
      </section>

      <section className="scene scene--alt">
        <div className="inner">
          <p className="lead">처음엔 거절하셨습니다.</p>
          <p className="sub">제가 보기에는 너무나 많은 일을 해오셨고<br />너무나 자랑스러운 일이 많은 인생임에도<br />자신이 한 일이 없다며 겸손하셨고<br />자서전을 남길만큼 대단한 사람이 아니라며<br />자신을 낮추셨습니다.</p>
          <figure className="figure"><img src="/memoir/3.jpg" alt="회장님이 보내주신 편지" /></figure>
          <p className="sub">지금은 창립자로서의 철학을 전달할<br />기업 회고록, 사사를 작업중에 있습니다.</p>
          <div className="rule"></div>
          <p className="beat">부모님께 여쭤보시면<br />아마 <span className="mark">손사래를 치실 겁니다.</span></p>
          <p className="lead">남길 만한 인생이 아니라고,<br />뭐 그런 걸 하냐고.</p>
          <p className="sub">아직까지 그렇게 말씀하시지 않는 분을<br />단 한번도 뵌 적이 없습니다.</p>
        </div>
      </section>

      <section className="scene scene--deep scene--breath">
        <div className="inner">
          <p className="sub">그리고 한참이 지난 뒤에 이야기를 들었습니다.</p>
          <p className="lead">명절에 온 가족이 모였고<br />거실에 둘러앉아<br />다큐멘터리를 함께 보았고</p>
          <div className="rule"></div>
          <p className="quote">모두가<br />눈물을 훔쳤다고 했습니다.</p>
        </div>
      </section>

      <section className="scene scene--breath">
        <div className="inner">
          <p className="sub memoirTop">그리고 문득 생각이 났습니다.</p>
          <p className="beat">내 부모님의 이야기도<br /><em>될 수 있지 않을까.</em></p>
        </div>
      </section>

      <section className="scene scene--alt">
        <div className="inner">
          <p className="lead">AI 시대의 자서전은<br />어떤 모습이어야 할까.</p>
          <div className="rule rule--h"></div>
          <p className="lead">책 한 권으로<br />모든 것을 남길 수 있을까.</p>
          <div className="rule rule--h"></div>
          <p className="lead">대필 작가가 써주고<br />책 모양만 갖추면<br />자서전의 가치가 남는 것일까.</p>
          <div className="rule rule--h"></div>
          <p className="lead">공식적인 기록으로<br />남아야 하지 않을까.</p>
        </div>
      </section>

      <section className="scene scene--deep">
        <div className="inner inner--wide">
          <p className="lead">AI놀자는<br />기록에 대한 <span className="hl">경험을 갖추었고</span><br />목소리와 영상으로 남기는 <span className="hl">기술을 갖추었고</span><br />공식적인 기록으로 등재하는 <span className="hl">자격을 갖추었습니다.</span></p>
          <div className="rule"></div>
          <p className="beat">책으로만 남기지 않습니다.<br /><em>부모님의 인생을<br />다큐멘터리로 만듭니다.</em></p>
        </div>
      </section>

      <section className="scene scene--breath">
        <div className="inner">
          <p className="beat">책은 혼자 읽지만</p>
          <div className="rule"></div>
          <p className="beat"><em>영상은<br />온 가족이 함께 봅니다.</em></p>
        </div>
      </section>

      <section className="scene scene--deep scene--breath">
        <div className="inner">
          <p className="quote">부모님의 일생은,<br />이미 한 편의 작품입니다.</p>
          <div className="rule"></div>
          <p className="sub">저희가 특별하게 만들어드리는 것이 아닙니다.<br />원래 그러했는데, 기록이 없었을 뿐입니다.</p>
        </div>
      </section>

      {/* ══ 3부 상품 ══ */}
      <section className="scene">
        <div className="inner inner--wide">
          <p className="beat">남는 것은 네 가지입니다.</p>
          <dl className="pieces">
            <div className="piece"><dt>다큐멘터리</dt><dd>영상</dd></div>
            <div className="piece"><dt>오디오북</dt><dd>목소리</dd></div>
            <div className="piece"><dt>종이책</dt><dd>정식 출간</dd></div>
            <div className="piece"><dt>전자책</dt><dd>디지털 원본 파일</dd></div>
          </dl>
          <p className="lead">전부 포함입니다.<br />추가 비용은 없습니다.</p>
        </div>
      </section>

      <section className="scene scene--deep scene--breath">
        <div className="inner">
          <p className="kicker">오디오북</p>
          <p className="beat">목소리가 남습니다.</p>
          <p className="sub">부모님의 목소리로<br />부모님의 이야기를 읽어드립니다.</p>
          <div className="rule"></div>
          <p className="lead">세월이 흐른 뒤에도<br />그 목소리는 그대로 남아 있습니다.</p>
        </div>
      </section>

      <section className="scene scene--alt">
        <div className="inner">
          <p className="kicker">정식 출간</p>
          <p className="beat">저희는 출판사입니다.</p>
          <ul className="list">
            <li>ISBN 정식 발급</li>
            <li>국립중앙도서관 영구 보존</li>
            <li>주요 온라인 서점 유통 (선택사항)</li>
          </ul>
          <div className="rule"></div>
          <p className="lead">부모님의 책이<br /><em>기록으로 남습니다.</em></p>
          <figure className="figure"><img src="/memoir/4.jpg" alt="국립중앙도서관 등재" /></figure>
        </div>
      </section>

      <section className="scene scene--dense">
        <div className="inner">
          <p className="lead">이런 분들께 추천합니다</p>
          <ul className="list list--center">
            <li>부모님 칠순·팔순·구순을 앞두고 있다</li>
            <li>매년 같은 선물을 드리는 것이 고민이었다</li>
            <li>형제들과 함께 뜻깊은 일을 하고 싶다</li>
            <li>부모님의 이야기를 아직 제대로 들어본 적 없다</li>
          </ul>
        </div>
      </section>

      {/* ══ 4부 신뢰 ══ */}
      <section className="scene scene--alt scene--dense">
        <div className="inner inner--wide">
          <p className="beat">저희가 맞춰서 진행합니다.</p>
          <div className="steps">
            <div className="step"><span className="step-n">01</span><div><span className="step-t">상담</span><span className="step-d">가족과 먼저 이야기를 나눕니다.</span></div></div>
            <div className="step"><span className="step-n">02</span><div><span className="step-t">이야기 수집</span><span className="step-d">부모님께 가장 편한 방법으로 진행합니다.</span>
              <ul className="ways">
                <li><b>온라인 인터뷰</b> — 작가가 온라인으로 진행합니다</li>
                <li><b>자녀와의 대화 녹취</b> — 질문지와 가이드를 보내드립니다</li>
                <li><b>방문 인터뷰</b> — 지역에 따라 별도로 문의해 주세요</li>
              </ul>
            </div></div>
            <div className="step"><span className="step-n">03</span><div><span className="step-t">집필·구성</span><span className="step-d">흩어진 기억을 한 권의 이야기로 엮습니다.</span></div></div>
            <div className="step"><span className="step-n">04</span><div><span className="step-t">목소리·영상</span><span className="step-d">오디오북과 다큐멘터리를 제작합니다.</span></div></div>
            <div className="step"><span className="step-n">05</span><div><span className="step-t">전달</span><span className="step-d">완성본을 가족께 전해드립니다.</span></div></div>
          </div>
          <p className="lead">먼 곳에 계셔도,<br />거동이 어려우셔도 괜찮습니다.</p>
        </div>
      </section>

      <section className="scene">
        <div className="inner">
          <p className="lead">AI놀자 출판</p>
          <p className="sub">섬기고 사랑하며(자서전), 닻(시집),<br />그림자 정원(심리학) 외 다수</p>
          <div className="rule"></div>
          <p className="beat">기업 회장님의 자서전을<br />만들던 방식 그대로,<br /><em>가족의 이야기에 적용합니다.</em></p>
        </div>
      </section>

      <section className="scene scene--deep">
        <div className="inner">
          <p className="lead">정말 운이 좋게도<br />많은 시니어 분들의 이야기를<br />들을 기회가 생겼습니다.</p>
          <p className="lead">누구나 빛나던 시절이 있더라고요.</p>
          <p className="lead">안타까운건<br />기억이 점점 희미해지는 겁니다.</p>
          <div className="rule"></div>
          <p className="quote">그래서 말씀드립니다.<br />지금이라고.</p>
        </div>
      </section>

      {/* ══ 5부 가족 ══ */}
      <section className="scene scene--dense">
        <div className="inner">
          <p className="sub">기존 자서전 작업을 진행하는 데 <b>1년 6개월</b>이 걸렸습니다.<br />매번 출장비와 교정교열 작업, 그리고 디자인과 다큐멘터리 영상 작업까지.<br />죄송하지만 일반인이 감당하기에는 힘든 비용이었습니다.</p>
          <p className="sub">하지만 그 경험을 바탕으로<br />최적화 된 시스템을 구축했습니다.</p>
          <div className="rule"></div>
          <p className="lead">보통은 어떤가요?</p>
          <p className="sub">인터뷰 1회, 자서전 전문 작가 대필, 책 300~500권.<br />평균 시장 가격이 <b>1,000만원을 웃돕니다.</b></p>
          <p className="sub">책 500권 쌓아두고 뭐하실건가요?<br />사실 큰 의미가 없습니다.</p>
          <div className="rule"></div>
          <p className="sub">시장 조사를 해보니 간편하게 만들 수 있는 자서전 서비스도 있더군요.<br />그저 갖춰진 템플릿대로 녹음 파일을 살짝 다듬어 책으로 만들어 냅니다.<br />10만원대부터 100만원대까지. 어떤 퀄리티로 나오는지 감도 안 옵니다.</p>
          <p className="note">일반 대필 시세는 원고 1,000매 기준 1,000~1,500만원입니다.</p>
          <div className="rule"></div>
          <p className="lead">저희가 기획한 자서전은<br />앞서 말씀드린 그대로입니다.</p>
          <p className="sub">종이책과 원본 디지털 파일, 오디오북,<br />그리고 영상으로 만들어지는 다큐멘터리까지.</p>
          <p className="sub">하지만 시간은 아무리 줄여도 <b>8주</b>는 걸리더군요.<br />이번 추석 전, 다큐멘터리까지는 받아보실 수 있습니다.<br />다만 실물 종이책은 출력소 스케줄을 고려해야 하기 때문에<br />그 이후에 발송됩니다.</p>
        </div>
      </section>

      <section className="scene scene--dense">
        <div className="inner inner--wide">
          <p className="beat">형제들이 함께 준비하는 선물입니다.</p>
          <p className="lead">1년 6개월이 걸리던 일을<br /><span className="hl">여덟 주</span>로 줄였습니다.</p>
        </div>
      </section>

      <section className="scene scene--alt">
        <div className="inner">
          <p className="lead">부모님의 이야기 곁에<br />자녀들의 목소리도 함께 담깁니다.</p>
          <div className="rule"></div>
          <p className="beat">책 맨 앞장에는<br /><em>형제들의 이름이<br />나란히 새겨집니다.</em></p>
          <div className="rule"></div>
          <p className="lead">그 책은 친척들에게,<br />지인들에게 전해집니다.</p>
        </div>
      </section>

      {/* ══ 6부 가격 ══ */}
      <section className="scene scene--alt scene--dense">
        <div className="inner inner--wide">
          <div className="tiers">
            <div className="tier tier--lead">
              <span className="tier-name">정 본</span>
              <span className="tier-price">880만원</span>
              <ul>
                <li>이야기 수집 4회</li>
                <li>프리미엄 북커버 10권 + 일반 20권 · 전자책</li>
                <li>목소리 오디오북</li>
                <li>다큐멘터리 30분</li>
                <li>가족 인터뷰 — 자녀·손주 목소리 수록</li>
              </ul>
            </div>
            <div className="tier tier--sub">
              <span className="tier-name">기 본 형</span>
              <span className="tier-price">550만원</span>
              <ul>
                <li>이야기 수집 2회</li>
                <li>프리미엄 북커버 4권 + 일반 6권 · 전자책</li>
                <li>목소리 오디오북</li>
                <li>다큐멘터리 15분</li>
              </ul>
            </div>
          </div>
          <div className="split">
            <div><b>440만원</b><span>두자녀</span></div>
            <div><b>294만원</b><span>세자녀</span></div>
            <div><b>220만원</b><span>네자녀</span></div>
            <div><b>176만원</b><span>다섯자녀</span></div>
          </div>
          <p className="lead">전 과정 포함 · <span className="hl">추가 비용 없음</span></p>
          <p className="sub">이것 추가 얼마, 저것 추가 얼마.<br />이런저런 핑계로 출고 시점에<br />처음 말씀드린 금액과 전혀 다른 금액을 제시하는 일은<br />하지 않습니다.</p>
        </div>
      </section>

      <section className="scene scene--deep">
        <div className="inner">
          <p className="beat">지금 신청한 뒤 추석 상영은<br /><em>딱 10분까지만</em> 가능합니다</p>
          <div className="rule"></div>
          <p className="lead">모든 아웃풋에 대비해<br />적자까지 고려해가며<br />정말 최저 가격, 최고 퀄리티로<br />준비했습니다</p>
          <div className="rule"></div>
          <p className="sub">그렇기 때문에 이후,<br />가격이 인상될 수 있습니다</p>
        </div>
      </section>

      <section className="scene scene--dense">
        <div className="inner inner--wide">
          <p className="kicker">9월 25일 추석에 맞추려면</p>
          <div className="sched">
            <div className="sched-row"><span className="sched-when">8월 중</span><span className="sched-what">상담 · 계약</span></div>
            <div className="sched-row"><span className="sched-when">8월 말</span><span className="sched-what">이야기 수집</span></div>
            <div className="sched-row"><span className="sched-when">9월 중순</span><span className="sched-what">다큐멘터리 · 오디오북 완성</span></div>
            <div className="sched-row"><span className="sched-when">9월 25일</span><span className="sched-what">가족과 함께 상영</span></div>
          </div>
          <p className="note">종이책은 이후 순차적으로 발송해 드립니다.</p>
        </div>
      </section>

      <section className="scene scene--alt">
        <div className="inner">
          <p className="kicker">안심하고 시작하세요</p>
          <p className="lead">혹시 부모님께서<br />원하지 않으시면 어떡하나요.</p>
          <div className="rule"></div>
          <p className="beat">이야기 수집을<br />시작하기 전이라면<br /><em>전액 돌려드립니다.</em></p>
          <p className="sub">먼저 결제하시고,<br />천천히 말씀 나누셔도 됩니다.</p>
          <p className="note">이후 단계는 진행된 부분만 정산하여 환급해 드립니다.</p>
        </div>
      </section>
    </div>
  )
}
