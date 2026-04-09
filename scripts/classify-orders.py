"""
기존 583건 Order의 productName을 분석해 classrooms / books 필드에 일괄 분류.

매핑 (확정안):
- "백지 위의 바이브코더" → classrooms: [vibe-coding-advanced]
- "AI 바이브 코딩으로 만드는 '자동 수익'" → classrooms: [vibe-coding-101]
- "퍼스널 인텔리젠스" (단독/얼리버드) → books: [personal-intelligence]
- "불편한AI" → books: [uncomfortable-ai]
- "AI시대의 15가지 프롬프트 전략" → books: [prompt-15]
- "NOTEBOOKLM 학습용 프롬프트 가이드" → books: [notebooklm-guide]
- "AI놀자 1기 SNS 수익화", "챗GPT 3년 따라잡기" → 무시 (옛날 강의)

번들의 경우 두 항목 다 채움.
"""
import requests
import sys
import re

API_BASE = "https://ainolza.kr"
ADMIN_EMAIL = "rex39@naver.com"
ADMIN_PASSWORD = "rudghks39"


def classify(name: str) -> tuple[list[str], list[str]]:
    """productName 문자열을 classrooms, books 리스트로 변환."""
    if not name:
        return [], []
    classrooms: list[str] = []
    books: list[str] = []

    # 강의실
    if "백지 위의 바이브코더" in name or "심화 4주" in name:
        classrooms.append("vibe-coding-advanced")
    if "AI 바이브 코딩으로 만드는" in name and "자동 수익" in name:
        classrooms.append("vibe-coding-101")

    # 도서
    if "퍼스널 인텔리젠스" in name:
        books.append("personal-intelligence")
    if "불편한AI" in name or "불편한 AI" in name:
        books.append("uncomfortable-ai")
    if "프롬프트 전략" in name and "15가지" in name:
        books.append("prompt-15")
    if "NOTEBOOKLM" in name.upper() or "노트북LM" in name:
        books.append("notebooklm-guide")

    # 옛날 강의는 매핑 없음 (빈 리스트 반환)
    return classrooms, books


def main():
    dry_run = "--dry-run" in sys.argv

    # 1. 관리자 로그인
    print("🔐 관리자 로그인 중...")
    session = requests.Session()
    res = session.post(
        f"{API_BASE}/api/users/login",
        json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
        timeout=15,
    )
    if res.status_code != 200:
        print(f"❌ 로그인 실패: {res.status_code} {res.text[:200]}")
        sys.exit(1)
    print("✅ 로그인 성공")

    # 2. 모든 주문 가져오기
    print("📦 주문 전체 조회 중...")
    orders = []
    page = 1
    while True:
        res = session.get(
            f"{API_BASE}/api/orders",
            params={"limit": 200, "page": page, "depth": 0},
            timeout=30,
        )
        data = res.json()
        orders.extend(data.get("docs", []))
        if page >= data.get("totalPages", 1):
            break
        page += 1
    print(f"   → {len(orders)}건")

    # 3. 분류 + 업데이트
    cls_count = {"vibe-coding-101": 0, "vibe-coding-advanced": 0}
    book_count = {
        "personal-intelligence": 0,
        "uncomfortable-ai": 0,
        "prompt-15": 0,
        "notebooklm-guide": 0,
    }
    unmapped = {}  # productName -> count
    update_success = 0
    update_failed = 0
    failed_list = []

    for o in orders:
        name = o.get("productName") or ""
        classrooms, books = classify(name)

        for c in classrooms:
            cls_count[c] = cls_count.get(c, 0) + 1
        for b in books:
            book_count[b] = book_count.get(b, 0) + 1

        if not classrooms and not books:
            unmapped[name] = unmapped.get(name, 0) + 1
            continue  # 매핑 없는 건 업데이트 건너뜀

        if dry_run:
            continue

        # PATCH /api/orders/[id]
        try:
            res = session.patch(
                f"{API_BASE}/api/orders/{o['id']}",
                json={"classrooms": classrooms, "books": books},
                timeout=15,
            )
            if res.status_code in (200, 201):
                update_success += 1
                if update_success % 50 == 0:
                    print(f"  ... {update_success} updated")
            else:
                update_failed += 1
                failed_list.append(
                    {
                        "id": o["id"],
                        "orderNumber": o.get("orderNumber"),
                        "status": res.status_code,
                        "error": res.text[:200],
                    }
                )
        except Exception as e:
            update_failed += 1
            failed_list.append({"id": o["id"], "error": str(e)})

    # 4. 결과
    print()
    print("=" * 50)
    print("📋 분류 결과")
    print("=" * 50)
    print(f"  총 주문 수: {len(orders)}건")
    print()
    print("[강의실]")
    for k, v in cls_count.items():
        print(f"  {k}: {v}건")
    print()
    print("[도서]")
    for k, v in book_count.items():
        print(f"  {k}: {v}건")
    print()
    if unmapped:
        print(f"[매핑 없음] {sum(unmapped.values())}건")
        for name, cnt in sorted(unmapped.items(), key=lambda x: -x[1]):
            print(f"  {cnt}건 | {name[:80]}")
    print()
    if not dry_run:
        print(f"✅ 업데이트 성공: {update_success}")
        print(f"❌ 업데이트 실패: {update_failed}")
        if failed_list:
            import json
            with open("orders_classify_failed.json", "w", encoding="utf-8") as f:
                json.dump(failed_list, f, ensure_ascii=False, indent=2)
            print("   실패 목록: orders_classify_failed.json")


if __name__ == "__main__":
    main()
