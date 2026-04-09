"""
user=null 인 고아 주문을 회원과 매칭한다.

매칭 규칙 (보수적):
1. 주문의 buyerEmail 의 @앞부분 + buyerName 이 회원의 (email 앞부분 + name) 과 정확히 일치
2. 한 명만 매칭되어야 함 (여러 명 → 수동 검토)

--dry-run 옵션: 실제 업데이트 없이 매칭 결과만 출력
"""
import requests
import sys
import json

API_BASE = "https://ainolza.kr"
ADMIN_EMAIL = "rex39@naver.com"
ADMIN_PASSWORD = "rudghks39"


def email_id(addr: str) -> str:
    if not addr or "@" not in addr:
        return ""
    return addr.split("@")[0].strip().lower()


def main():
    dry_run = "--dry-run" in sys.argv

    print("🔐 관리자 로그인 중...")
    session = requests.Session()
    res = session.post(
        f"{API_BASE}/api/users/login",
        json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
        timeout=15,
    )
    if res.status_code != 200:
        print(f"❌ 로그인 실패: {res.status_code}")
        sys.exit(1)
    print("✅ 로그인 성공")

    # 1. 모든 회원 조회 → (id_part, name) -> [user_id]  맵 구성
    print("👥 회원 목록 가져오는 중...")
    user_index: dict[tuple[str, str], list[dict]] = {}
    page = 1
    while True:
        res = session.get(
            f"{API_BASE}/api/users",
            params={"limit": 200, "page": page, "depth": 0},
            timeout=20,
        ).json()
        for u in res.get("docs", []):
            ep = email_id(u.get("email") or "")
            nm = (u.get("name") or "").strip()
            if not ep or not nm:
                continue
            key = (ep, nm)
            user_index.setdefault(key, []).append(u)
        if page >= res.get("totalPages", 1):
            break
        page += 1
    print(f"   → {sum(len(v) for v in user_index.values())}명 인덱싱")

    # 2. user=null 인 주문 모두 조회
    print("📦 고아 주문 조회 중...")
    orphan_orders = []
    page = 1
    while True:
        res = session.get(
            f"{API_BASE}/api/orders",
            params={
                "where[user][exists]": "false",
                "limit": 200,
                "page": page,
                "depth": 0,
            },
            timeout=20,
        ).json()
        orphan_orders.extend(res.get("docs", []))
        if page >= res.get("totalPages", 1):
            break
        page += 1
    print(f"   → {len(orphan_orders)}건")

    # 3. 매칭 시도
    matched = []
    multiple = []
    no_match = []

    for o in orphan_orders:
        be = o.get("buyerEmail") or ""
        bn = (o.get("buyerName") or "").strip()
        ep = email_id(be)
        if not ep or not bn:
            no_match.append(o)
            continue
        key = (ep, bn)
        candidates = user_index.get(key, [])
        if len(candidates) == 1:
            matched.append((o, candidates[0]))
        elif len(candidates) > 1:
            multiple.append((o, candidates))
        else:
            no_match.append(o)

    # 4. 결과 보고
    print()
    print("=" * 60)
    print(f"✅ 단일 매칭: {len(matched)}건")
    print(f"⚠️  다중 매칭 (수동 검토): {len(multiple)}건")
    print(f"❌ 매칭 없음: {len(no_match)}건")
    print("=" * 60)

    if matched:
        print("\n[단일 매칭]")
        for o, u in matched:
            print(f"  주문 {o['orderNumber']} ({o.get('buyerEmail')}) → 회원 {u['email']} (id={u['id']}, name={u.get('name')})")

    if multiple:
        print("\n[다중 매칭 - 수동 검토 필요]")
        for o, us in multiple:
            print(f"  주문 {o['orderNumber']}: {len(us)}명 후보")
            for u in us:
                print(f"    → {u['email']} (id={u['id']})")

    if no_match:
        print("\n[매칭 없음]")
        for o in no_match[:10]:
            print(f"  주문 {o['orderNumber']} | {o.get('buyerName')} | {o.get('buyerEmail')}")
        if len(no_match) > 10:
            print(f"  ... 외 {len(no_match) - 10}건")

    if dry_run:
        print("\n⚠️  DRY RUN — 실제 업데이트 안 함")
        return

    if not matched:
        print("\n업데이트할 매칭이 없습니다.")
        return

    print(f"\n👉 {len(matched)}건 업데이트 진행...")
    success = 0
    failed = 0
    failed_list = []
    for o, u in matched:
        try:
            r = session.patch(
                f"{API_BASE}/api/orders/{o['id']}",
                json={"user": u["id"]},
                timeout=15,
            )
            if r.status_code in (200, 201):
                success += 1
            else:
                failed += 1
                failed_list.append({"order": o["orderNumber"], "status": r.status_code, "error": r.text[:200]})
        except Exception as e:
            failed += 1
            failed_list.append({"order": o["orderNumber"], "error": str(e)})

    print(f"✅ 성공: {success}")
    print(f"❌ 실패: {failed}")
    if failed_list:
        with open("link_orphan_failed.json", "w", encoding="utf-8") as f:
            json.dump(failed_list, f, ensure_ascii=False, indent=2)
        print("   실패 목록: link_orphan_failed.json")


if __name__ == "__main__":
    main()
