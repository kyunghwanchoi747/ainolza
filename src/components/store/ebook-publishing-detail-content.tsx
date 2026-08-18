/**
 * "내 이름으로 된 책 한 권" 전자책 정식 출간 과정 상품 상세페이지 본문.
 * design-handoff/ebook-publishing-class/ebook-publishing-class.편집용.html 디자인을 그대로 이식.
 * 자체 CSS 변수/scene 단위 스크롤 연출 체계라 Tailwind로 재작성하지 않고
 * 원본 <style> 블록을 이 컴포넌트 스코프로 그대로 옮김.
 * 이미지: public/ebook/1.png, public/ebook/2.jpg
 */
export function EbookPublishingDetailContent() {
  return (
    <div className="ebookPubRoot">
      <style>{`
.ebookPubRoot{
  --ink:#14161A;
  --paper:#FAF9F7;
  --paper-2:#F1EFEB;
  --seal:#1E4D5C;
  --seal-2:#2A6B7F;
  --gold:#C29224;
  --muted:#5F6570;
  --line:#DDD9D3;
  --on-deep:#EFEDE9;
  --on-deep-muted:#9AA0A8;

  --serif:"Noto Serif KR",NanumMyeongjo,"Nanum Myeongjo",Georgia,serif;
  --sans:"Pretendard","Noto Sans KR","Apple SD Gothic Neo","Malgun Gothic",system-ui,sans-serif;

  --s1:.5rem; --s2:1rem; --s3:1.4rem; --s4:2.2rem; --s5:3rem; --s6:5rem;
  --measure:34rem;

  background:var(--paper);color:var(--ink);
  font-family:var(--sans);font-size:17px;line-height:1.85;
  -webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;
  text-rendering:optimizeLegibility;word-break:keep-all;
}
.ebookPubRoot *{box-sizing:border-box}
.ebookPubRoot h1,.ebookPubRoot h2,.ebookPubRoot h3{font-family:var(--serif);margin:0;line-height:1.5;text-wrap:balance}
.ebookPubRoot h1,.ebookPubRoot h2,.ebookPubRoot h3,.ebookPubRoot .display,.ebookPubRoot .lead,.ebookPubRoot .beat,.ebookPubRoot .quote{font-weight:500}
.ebookPubRoot p{margin:0}

.ebookPubRoot .scene{
  min-height:62vh;display:flex;flex-direction:column;justify-content:center;
  align-items:center;padding:var(--s6) var(--s3);
  border-bottom:1px solid var(--line);text-align:center;
}
.ebookPubRoot .scene--breath{min-height:88vh;padding-block:calc(var(--s6) * 1.5)}
.ebookPubRoot .scene--dense{min-height:auto;padding-block:var(--s5)}
.ebookPubRoot .scene--alt{background:var(--paper-2)}
.ebookPubRoot .scene--deep{background:var(--ink);color:var(--on-deep);border-bottom-color:transparent}
.ebookPubRoot .scene--deep .sub,.ebookPubRoot .scene--deep .note,.ebookPubRoot .scene--deep .kicker{color:var(--on-deep-muted)}
.ebookPubRoot .scene--deep .rule{background:rgba(255,255,255,.18)}

.ebookPubRoot .inner{width:100%;max-width:var(--measure);display:flex;flex-direction:column;gap:var(--s3)}
.ebookPubRoot .inner--wide{max-width:54rem}

.ebookPubRoot .kicker{font-size:.74rem;letter-spacing:.22em;color:var(--muted)}
.ebookPubRoot .eyebrow{font-family:var(--serif);font-size:clamp(1.05rem,3vw,1.45rem);color:var(--muted);line-height:1.7}
.ebookPubRoot .display{font-family:var(--serif);font-size:clamp(1.9rem,5.2vw,3rem)}
.ebookPubRoot .display--xl{font-size:clamp(2.2rem,6.6vw,3.9rem);line-height:1.35}
.ebookPubRoot .lead{font-family:var(--serif);font-size:clamp(1.25rem,3vw,1.65rem);line-height:1.85}
.ebookPubRoot .beat{font-family:var(--serif);font-size:clamp(1.55rem,4.4vw,2.4rem);line-height:1.7}
.ebookPubRoot .quote{font-family:var(--serif);font-size:clamp(1.6rem,5vw,2.7rem);line-height:1.6}
.ebookPubRoot .sub{color:var(--muted);font-size:.98rem;line-height:1.9}
.ebookPubRoot .sub b{font-weight:700;color:var(--ink)}
.ebookPubRoot .scene--deep .sub b{color:var(--on-deep)}
.ebookPubRoot .note{font-size:.82rem;color:var(--muted)}
.ebookPubRoot .em{font-style:normal;color:var(--seal)}
.ebookPubRoot .scene--deep .em{color:var(--seal-2)}
.ebookPubRoot .hl{font-weight:700;background:linear-gradient(transparent 52%,rgba(194,146,36,.8) 52%,rgba(194,146,36,.8) 92%,transparent 92%);
  padding:0 .15em;box-decoration-break:clone;-webkit-box-decoration-break:clone}
.ebookPubRoot .mark{font-weight:700}
.ebookPubRoot .pop{color:var(--gold);font-weight:700}

.ebookPubRoot .rule{width:1px;height:var(--s5);background:var(--line);align-self:center}
.ebookPubRoot .rule--h{width:3rem;height:1px}

.ebookPubRoot .sealWrap{display:flex;flex-direction:column;align-items:center;gap:.6rem;align-self:center}
.ebookPubRoot .seal{width:76px;height:76px;background:var(--seal);color:#FDFBF8;border-radius:4px;
  display:grid;place-items:center;font-family:var(--serif);font-size:2.7rem;line-height:1;
  padding-bottom:.08em;box-shadow:inset 0 0 0 1px rgba(255,255,255,.22)}
.ebookPubRoot .sealLabel{font-family:var(--sans);font-size:.88rem;font-weight:500;
  letter-spacing:.34em;text-indent:.34em;color:var(--seal)}
.ebookPubRoot .scene--deep .seal{background:var(--seal-2);color:#0E1114}
.ebookPubRoot .scene--deep .sealLabel{color:var(--seal-2)}

.ebookPubRoot .list{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:var(--s2);text-align:left}
.ebookPubRoot .list li{padding-left:1.4rem;position:relative;line-height:1.8}
.ebookPubRoot .list li::before{content:"";position:absolute;left:0;top:.85em;width:.5rem;height:1px;background:var(--seal)}
.ebookPubRoot .list--center{text-align:center;align-items:center}
.ebookPubRoot .list--center li{padding-left:0}
.ebookPubRoot .list--center li::before{display:none}

.ebookPubRoot .table-wrap{width:100%;overflow-x:auto}
.ebookPubRoot table{border-collapse:collapse;width:100%;font-size:.93rem;text-align:left;font-variant-numeric:tabular-nums}
.ebookPubRoot th,.ebookPubRoot td{padding:.9rem .7rem;border-bottom:1px solid var(--line);vertical-align:top}
.ebookPubRoot thead th{font-weight:400;font-size:.72rem;letter-spacing:.14em;color:var(--muted);white-space:nowrap}
.ebookPubRoot tbody th{font-weight:400;font-family:var(--serif);font-size:1rem}
.ebookPubRoot .num{text-align:right;white-space:nowrap}
.ebookPubRoot tr.mine th,.ebookPubRoot tr.mine td{background:var(--paper-2);font-family:var(--serif);font-size:1.02rem}
.ebookPubRoot tr.mine th{color:var(--seal)}
.ebookPubRoot .yes{color:var(--seal);font-weight:700}
.ebookPubRoot .no{color:var(--muted);opacity:.5}
.ebookPubRoot sup{font-size:.7em;vertical-align:super}

.ebookPubRoot .weeks{display:flex;flex-direction:column;width:100%;text-align:left}
.ebookPubRoot .week{display:grid;grid-template-columns:4.2rem 1fr;gap:var(--s2);padding:var(--s3) 0;border-top:1px solid var(--line)}
.ebookPubRoot .week:last-child{border-bottom:1px solid var(--line)}
.ebookPubRoot .week-n{font-family:var(--serif);color:var(--seal);font-size:.95rem;letter-spacing:.06em;padding-top:.2rem}
.ebookPubRoot .week-t{font-family:var(--serif);font-size:1.25rem;display:block;margin-bottom:.5rem}
.ebookPubRoot .week ul{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:.4rem;font-size:.9rem;color:var(--muted)}
.ebookPubRoot .week ul li{padding-left:.9rem;position:relative;line-height:1.75}
.ebookPubRoot .week ul li::before{content:"·";position:absolute;left:.1rem;color:var(--seal)}
.ebookPubRoot .week ul li b{font-weight:700;color:var(--ink)}

.ebookPubRoot .prices{display:flex;flex-direction:column;width:100%;border-top:1px solid var(--line)}
.ebookPubRoot .price{display:grid;grid-template-columns:1fr auto;gap:var(--s2);padding:1.1rem .2rem;
  border-bottom:1px solid var(--line);align-items:baseline;text-align:left}
.ebookPubRoot .price--now{background:var(--paper-2);padding-inline:.8rem}
.ebookPubRoot .price-when{font-size:.92rem;color:var(--muted)}
.ebookPubRoot .price--now .price-when{color:var(--seal);font-family:var(--serif);font-size:1.05rem}
.ebookPubRoot .price-num{font-family:var(--serif);font-variant-numeric:tabular-nums;font-size:1.2rem;white-space:nowrap}
.ebookPubRoot .price--now .price-num{font-size:clamp(1.6rem,4.5vw,2.1rem);color:var(--seal)}
.ebookPubRoot .price--gone{opacity:.45;text-decoration:line-through}
.ebookPubRoot .price--next .price-when{color:var(--ink)}
.ebookPubRoot .price--next .price-num{color:var(--ink);font-size:1.45rem}
.ebookPubRoot .price-when b{font-weight:700;color:var(--ink)}
.ebookPubRoot .price--now .price-when b{color:var(--seal)}
.ebookPubRoot .price-when small{font-size:.78rem;color:var(--muted);display:inline-block;margin-top:.2rem}

.ebookPubRoot .spec{display:flex;flex-direction:column;width:100%;text-align:left;border-top:1px solid var(--line)}
.ebookPubRoot .spec div{display:flex;flex-wrap:wrap;justify-content:space-between;gap:.4rem;
  padding:.95rem 0;border-bottom:1px solid var(--line)}
.ebookPubRoot .spec b{font-family:var(--serif);font-weight:400;font-size:1.02rem}
.ebookPubRoot .spec span{font-size:.86rem;color:var(--muted)}

.ebookPubRoot .actions{display:flex;flex-wrap:wrap;gap:var(--s2);justify-content:center}
.ebookPubRoot .btn{font-family:var(--sans);font-size:.98rem;letter-spacing:.06em;padding:1.05rem 2.4rem;
  border:1px solid currentColor;text-decoration:none;display:inline-block;cursor:pointer;
  transition:background .25s,color .25s}
.ebookPubRoot .btn--primary{background:var(--seal);border-color:var(--seal);color:#FDFBF8}
.ebookPubRoot .btn--primary:hover{background:transparent;color:var(--seal)}
.ebookPubRoot .scene--deep .btn--primary{background:var(--seal-2);border-color:var(--seal-2);color:#0E1114}
.ebookPubRoot .scene--deep .btn--primary:hover{background:transparent;color:var(--seal-2)}
.ebookPubRoot .btn:focus-visible{outline:2px solid var(--seal);outline-offset:4px}

.ebookPubRoot .plate{width:100%;background:var(--paper-2);border:1px solid var(--line);aspect-ratio:16/9;
  display:grid;place-items:center;color:var(--muted);padding:var(--s2);text-align:center}
.ebookPubRoot .plate>*{display:block}
.ebookPubRoot .plate-no{font-family:var(--serif);font-size:1.4rem;font-weight:500;color:var(--seal);margin-bottom:.35rem}
.ebookPubRoot .plate-desc{font-size:.8rem;line-height:1.6}
.ebookPubRoot .plate--sq{aspect-ratio:4/3}
.ebookPubRoot .figure{width:100%;margin:0}
.ebookPubRoot .figure img{width:100%;height:auto;display:block}
.ebookPubRoot .figure--book{max-width:26rem;margin-inline:auto}

.ebookPubRoot .fill{border:1px dashed var(--seal);padding:var(--s3);font-size:.86rem;color:var(--seal);
  text-align:left;line-height:1.8}

.ebookPubRoot footer{padding:var(--s5) var(--s3);text-align:center;background:var(--ink);color:var(--on-deep-muted);
  font-size:.82rem;display:flex;flex-direction:column;gap:var(--s2);align-items:center}
.ebookPubRoot footer a{color:var(--on-deep);text-decoration:none;border-bottom:1px solid rgba(255,255,255,.25);padding-bottom:2px}

@media (max-width:560px){
  .ebookPubRoot{--s5:2rem;--s6:3rem}
  .ebookPubRoot .scene{min-height:auto;padding-block:var(--s6)}
  .ebookPubRoot .scene--breath{min-height:auto;padding-block:calc(var(--s6) * 1.4)}
  .ebookPubRoot .week{grid-template-columns:3.4rem 1fr}
}
@media (prefers-reduced-motion:reduce){.ebookPubRoot *{animation:none!important;transition:none!important}}
      `}</style>

      {/* 1부 · 후킹 */}
      <section className="scene scene--breath">
        <div className="inner">
          <p className="eyebrow">배경이 없어서 시작을 못 하고 계신가요</p>
          <h1 className="display display--xl">내 이름으로 된<br /><em className="em">책 한 권</em></h1>
          <div className="rule" />
          <p className="lead">4주 뒤,<br />국립중앙도서관에서<br />당신의 이름이 검색됩니다.</p>
          <div className="sealWrap">
            <span className="seal" aria-hidden="true">著</span>
            <span className="sealLabel">저자</span>
          </div>
        </div>
      </section>

      <section className="scene scene--alt">
        <div className="inner">
          <p className="lead">사업 실패로<br />낭떠러지에 떨어졌던 시절,<br />좋은 인연이 닿은 선생님 한 분이<br />저에게 이런 말씀을 하셨습니다.</p>
          <div className="rule" />
          <p className="beat">&ldquo;네가 AI를 잘 다루고<br />잘 가르치고 공부도 많이 했지만,<br /><span className="hl">표면적으로 드러난 결과물이 없다.</span><br /><br />그걸 가장 잘 드러낼 수 있는 게<br />바로 <em className="em">책</em>이다.&rdquo;</p>
          <div className="rule" />
          <p className="lead">사실이었습니다.<br />어딘가에 내세울 학벌도, 경력도 없었습니다.<br />성공과 실패, 도전에 대한 경험만으로는<br />사회에서 인정해주지 않으니까요.</p>
        </div>
      </section>

      <section className="scene">
        <div className="inner">
          <p className="lead">그 말을 듣고 쓴 책이<br />2023년에 나온 『불편한 AI』입니다.</p>
          <figure className="figure figure--book"><img src="/ebook/1.png" alt="불편한 AI 표지" /></figure>
          <p className="sub">그 뒤로 저는 강의를 할 때도, 메일을 보낼 때도,<br />유튜브에서도 늘 이 책 이야기로 시작합니다.</p>
          <div className="rule" />
          <p className="beat"><span className="hl">책은 그 자체로 신뢰가 됩니다.</span></p>
        </div>
      </section>

      {/* 2부 · 문제 제기 */}
      <section className="scene scene--deep scene--breath">
        <div className="inner">
          <p className="lead">그런데 시중의 전자책 강의를<br />전부 찾아봤습니다.</p>
          <div className="rule" />
          <p className="quote">대부분<br /><span className="pop">PDF 파일 한 권</span><br />만드는 법이었습니다.</p>
        </div>
      </section>

      <section className="scene scene--dense">
        <div className="inner inner--wide">
          <p className="kicker">실제 시장 가격</p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>강의</th><th className="num">가격</th>
                  <th className="num">ISBN</th><th className="num">도서관 등록</th><th className="num">서점 입점</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>고가 전자책 과정</th><td className="num">100만원대</td>
                  <td className="num no">—</td><td className="num no">—</td><td className="num no">—</td>
                </tr>
                <tr>
                  <th>평균 전자책 과정</th><td className="num">30만원대</td>
                  <td className="num no">—</td><td className="num no">—</td><td className="num no">—</td>
                </tr>
                <tr className="mine">
                  <th>AI놀자</th><td className="num">139,000원~</td>
                  <td className="num yes">O</td><td className="num yes">O</td><td className="num yes">O<sup>*</sup></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="note">2026년 8월 기준, 공개된 판매가를 조사한 결과입니다.<br /><sup>*</sup> 대형 서점 입점은 원하시는 분만 별도 계약으로 진행합니다.</p>
          <div className="rule" />
          <p className="beat">PDF 파일 하나에<br />왜 그 돈을 내야 하는지<br /><em className="em">저는 납득이 안 됐습니다.</em></p>
        </div>
      </section>

      {/* 3부 · 해법 */}
      <section className="scene scene--alt scene--breath">
        <div className="inner">
          <p className="beat">저는<br /><span className="hl">출판사를 가지고 있습니다.</span></p>
          <div className="rule" />
          <p className="lead">그래서 이 강의는<br />파일을 만드는 데서 끝나지 않습니다.</p>
        </div>
      </section>

      <section className="scene">
        <div className="inner inner--wide">
          <p className="kicker">이 강의가 끝나면</p>
          <div className="spec">
            <div><b>ISBN 정식 발급</b><span>국제표준도서번호</span></div>
            <div><b>국립중앙도서관 등록</b><span>영구 보존</span></div>
            <div><b>저자명 검색</b><span>이름으로 찾아집니다</span></div>
            <div><b>대형 서점 유통</b><span>선택 · 별도 계약</span></div>
          </div>
          <figure className="figure"><img src="/ebook/2.jpg" alt="국립중앙도서관 검색 결과" /></figure>
          <p className="beat">PDF 파일이 아니라<br /><em className="em">국가 기록에 남는 책</em>입니다.</p>
        </div>
      </section>

      <section className="scene scene--deep">
        <div className="inner">
          <p className="sub">ISBN은 개인이 발급받을 수 없습니다.<br />출판사 신고가 되어 있어야 하고,<br />발행자번호를 따로 배정받아야 합니다.</p>
          <div className="rule" />
          <p className="beat"><span className="hl">그 과정을 제가 대신합니다.</span></p>
          <p className="sub">원고만 완성하시면 됩니다.</p>
        </div>
      </section>

      {/* 4부 · 철학 */}
      <section className="scene scene--breath">
        <div className="inner">
          <p className="kicker">다만 한 가지는 지킵니다</p>
          <p className="beat">AI로 <span className="mark">딸깍</span> 만들어진 책은<br /><em className="em">쓰지 않습니다.</em></p>
          <div className="rule" />
          <p className="lead">AI가 60~70%,<br />나머지 <span className="hl">30% 이상은 반드시 당신 이야기</span>입니다.</p>
          <p className="sub">그렇게 나온 책은 팔릴지 몰라도<br />3년 뒤에 보면 창피합니다.<br />그런 작업은 하지 않습니다.</p>
          <div className="rule" />
          <p className="lead">AI를 시작한 초창기부터<br />저는 이 지점을 중요하게 생각했습니다.</p>
          <p className="sub">그래서 첫 번째 책 『불편한 AI』는<br />다소 부족한 점들이 보이긴 하지만<br /><b>지금 다시 돌아봐도 창피하지는 않습니다.</b><br /><br />여전히 지금도 필요하고<br />중요한 내용들이 들어 있습니다.</p>
        </div>
      </section>

      <section className="scene scene--alt">
        <div className="inner">
          <p className="lead">그래서 첫 주부터<br />끝까지 드리는 과제가 하나 있습니다.</p>
          <div className="rule" />
          <p className="beat">생각날 때마다<br /><em className="em">녹음하세요.</em></p>
          <p className="lead">운전하다가, 걷다가, 잠들기 전에.<br />정리하지 말고 그냥 말하듯이.<br />내 생각을 이야기하세요.</p>
          <div className="rule rule--h" />
          <p className="lead">처음부터 글로 쓰려고 하면 안 나옵니다.<br /><span className="pop">말로 하면 그냥 나옵니다.</span></p>
          <div className="rule rule--h" />
          <p className="lead">기억은 생각보다 빨리 흐려집니다.<br />어제 떠오른 그 이야기는<br />오늘이면 생각이 안 납니다.</p>
          <p className="sub">생각날 때마다 메모하고 녹음을 해야 합니다.<br /><br />그 녹음이 당신의 책에서<br /><b>AI가 흉내 낼 수 없는 부분</b>이 됩니다.</p>
        </div>
      </section>

      {/* 5부 · 커리큘럼 */}
      <section className="scene scene--dense">
        <div className="inner inner--wide">
          <p className="kicker">4주 커리큘럼</p>
          <p className="lead">주 1회 실시간 라이브</p>
          <div className="weeks">
            <div className="week">
              <span className="week-n">1주</span>
              <div>
                <span className="week-t">무엇을 쓸 것인가</span>
                <ul>
                  <li>배경 없는 사람에게 책이 하는 일</li>
                  <li>PDF 전자책과 정식 출간의 차이</li>
                  <li><b>쓸 게 없는 분</b> — 이키가이 네 질문으로 주제 찾기</li>
                  <li><b>쓸 게 있는 분</b> — 바로 자료 조사로</li>
                  <li>목차 설계 — 여기서 책의 절반이 정해집니다</li>
                </ul>
              </div>
            </div>
            <div className="week">
              <span className="week-n">2주</span>
              <div>
                <span className="week-t">초고 쓰기</span>
                <ul>
                  <li>딥리서치로 자료 긁어모으기</li>
                  <li>녹음·메모·자료를 <b>NotebookLM</b>에 모두 넣기</li>
                  <li>목차대로 초고 뽑아내기</li>
                  <li><b>AI 티 없애는 법</b> — 이 강의의 핵심</li>
                </ul>
              </div>
            </div>
            <div className="week">
              <span className="week-n">3주</span>
              <div>
                <span className="week-t">책의 형태로 만들기</span>
                <ul>
                  <li>교정교열 — <b>전용 프로그램 제공</b></li>
                  <li>제목 정하기 · 표지 만들기 (캔바)</li>
                  <li>소리 내어 읽으며 다듬기</li>
                  <li>원고 최종본 제출</li>
                </ul>
              </div>
            </div>
            <div className="week">
              <span className="week-n">4주</span>
              <div>
                <span className="week-t">진짜 출간, 그리고 다음</span>
                <ul>
                  <li>ISBN 발급과 국립중앙도서관 등록</li>
                  <li>대형 서점 유통 (선택)</li>
                  <li>내 책을 무기로 쓰는 법</li>
                  <li><b>자기 책을 낸 사람만 남의 책을 쓸 수 있습니다</b></li>
                </ul>
              </div>
            </div>
          </div>
          <p className="note">조판과 출간 절차는 제가 처리합니다. 원고에만 집중하시면 됩니다.</p>
        </div>
      </section>

      {/* 6부 · 대상 */}
      <section className="scene">
        <div className="inner">
          <p className="lead">이런 분들께 권합니다</p>
          <ul className="list list--center">
            <li>실력은 있는데 내세울 것이 없다</li>
            <li>퇴직했거나, 하던 일이 예전 같지 않다</li>
            <li>AI 때문에 내 자리가 흔들린다고 느낀다</li>
            <li>제2의 인생을 준비하고 있다</li>
            <li>언젠가 내 책을 내고 싶었다</li>
          </ul>
        </div>
      </section>

      {/* 7부 · 가격 */}
      <section className="scene scene--alt scene--dense">
        <div className="inner inner--wide">
          <p className="kicker">얼리버드</p>
          <p className="sub">저는 새 강의를 열 때 아주 낮은 가격으로 시작합니다.<br />바이브코딩 입문반도 지금은 119,000원이지만,<br />처음 저를 믿어주신 분들은 <b>39,000원</b>에 시작하셨습니다.<br /><br />시간이 지나면 값이 오르는 건<br />냉정하지만 당연한 일이라고 생각합니다.</p>
          <div className="prices">
            <div className="price price--now">
              <span className="price-when">슈퍼 얼리버드 · <b>8/18 하루</b><br /><small>기존 수강생 전용</small></span>
              <span className="price-num">139,000원</span>
            </div>
            <div className="price price--next">
              <span className="price-when">얼리버드 · <b>8/19 하루</b></span>
              <span className="price-num">169,000원</span>
            </div>
            <div className="price">
              <span className="price-when">8/20 ~ 8/31</span>
              <span className="price-num">순차 인상</span>
            </div>
            <div className="price price--gone">
              <span className="price-when">정가</span>
              <span className="price-num">390,000원</span>
            </div>
          </div>
          <p className="beat" style={{ marginTop: '.6rem' }}>8월 31일 마감까지<br /><span className="pop">매일 가격이 오릅니다.</span></p>
          <p className="note">ISBN 발급과 국립중앙도서관 등록 비용이 포함된 가격입니다.<br /><br />종이책 출간과 대형 서점 유통은 AI놀자 출판사 이름으로 나가고<br />판매 수익이 발생하기 때문에 별도 계약이 필요합니다.<br />이건 선택 사항입니다.</p>
        </div>
      </section>

      <section className="scene scene--deep">
        <div className="inner">
          <p className="kicker">일정</p>
          <div className="spec" style={{ borderTopColor: 'rgba(255,255,255,.15)' }}>
            <div style={{ borderBottomColor: 'rgba(255,255,255,.15)' }}><b>8월 18일</b><span>슈퍼 얼리버드 시작</span></div>
            <div style={{ borderBottomColor: 'rgba(255,255,255,.15)' }}><b>8월 31일</b><span>모집 마감</span></div>
            <div style={{ borderBottomColor: 'rgba(255,255,255,.15)' }}><b>9월 1일</b><span>강의 시작 (예정)</span></div>
            <div style={{ borderBottomColor: 'rgba(255,255,255,.15)' }}><b>4주 과정 종료</b><span></span></div>
          </div>
          <p className="sub">추석 연휴가 마지막 주에 걸립니다.<br />그 주는 원고를 마무리하는 기간으로 두었습니다.</p>
        </div>
      </section>

      {/* 8부 · 클로징 */}
      <section className="scene scene--breath">
        <div className="inner">
          <div className="sealWrap">
            <span className="seal" aria-hidden="true">著</span>
            <span className="sealLabel">저자</span>
          </div>
          <p className="quote">4주 뒤에는<br /><em className="em">작가</em>라고<br />말하실 수 있습니다.</p>
          <div className="actions">
            <a className="btn btn--primary" href="#apply">신청하기</a>
          </div>
        </div>
      </section>

      <footer id="apply">
        <p>AI놀자 출판</p>
        <p><a href="#apply">문의하기</a></p>
      </footer>
    </div>
  )
}
