"""
4개 상품을 Payload Products 컬렉션에 시드한다.
- public/store/{slug}/thumbnail.png + detail-N.png 을 Media 컬렉션에 업로드
- 업로드된 media id를 Products 의 thumbnail / detailImages 에 연결

1회용 스크립트.
"""
import requests
import sys
import os
from pathlib import Path

API_BASE = "https://ainolza.kr"
ADMIN_EMAIL = "rex39@naver.com"
ADMIN_PASSWORD = "rudghks39"
BASE_DIR = Path(__file__).resolve().parent.parent
PUBLIC_STORE = BASE_DIR / "public" / "store"

PRODUCTS = [
    {
        "slug": "vibe-coding-advanced",
        "productType": "class",
        "category": "강의",
        "title": "AI 바이브 코딩 [심화]\n백지 위의 바이브코더",
        "subtitle": "백지에서 시작하는 4주 심화 과정",
        "shortDescription": "코딩 0인 분도 4주만에 자기 사이트 운영",
        "price": 590000,
        "originalPrice": 990000,
        "actions": [
            {"label": "수강 신청하기", "url": "/programs/vibe-coding/enroll", "primary": True},
        ],
        "classroomSlug": "vibe-coding-advanced",
        "order": 1,
        "seoType": "Course",
        "detailImageCount": 4,
    },
    {
        "slug": "vibe-coding-101",
        "productType": "class",
        "category": "강의",
        "title": "AI 바이브 코딩 [입문]\n자동 수익 웹사이트 구축 실전",
        "subtitle": "코딩 0인 분도 4주만에 자기 사이트 운영",
        "shortDescription": "AI로 만드는 자동 수익 웹사이트 구축",
        "price": 390000,
        "originalPrice": 590000,
        "actions": [
            {"label": "수강 신청하기", "url": "/programs/vibe-coding/enroll", "primary": True},
        ],
        "classroomSlug": "vibe-coding-101",
        "order": 2,
        "seoType": "Course",
        "detailImageCount": 4,
    },
    {
        "slug": "uncomfortable-ai",
        "productType": "book",
        "category": "전자책 / 종이책",
        "title": "불편한 AI",
        "subtitle": "평범한 사람을 위한 AI 리터러시",
        "shortDescription": "Now or Never. 멈출 수 없는 변화 속에서",
        "priceLabel": "교보문고 판매 중",
        "actions": [
            {
                "label": "교보문고에서 보기",
                "url": "https://search.kyobobook.co.kr/search?keyword=%EB%B6%88%ED%8E%B8%ED%95%9C+AI+%EC%B5%9C%EA%B2%BD%ED%99%98",
                "primary": True,
                "external": True,
            },
        ],
        "order": 3,
        "seoType": "Book",
        "seoAuthor": "최경환",
        "detailImageCount": 1,
    },
    {
        "slug": "personal-intelligence",
        "productType": "ebook",
        "category": "전자책",
        "title": "퍼스널 인텔리전스",
        "subtitle": "Google Workspace × Gemini 활용서",
        "shortDescription": "실무자를 위한 AI 워크플로우 가이드",
        "priceLabel": "교보문고 판매 중",
        "actions": [
            {
                "label": "교보문고에서 보기",
                "url": "https://search.kyobobook.co.kr/search?keyword=%ED%8D%BC%EC%8A%A4%EB%84%90+%EC%9D%B8%ED%85%94%EB%A6%AC%EC%A0%84%EC%8A%A4",
                "primary": True,
                "external": True,
            },
        ],
        "order": 4,
        "seoType": "Book",
        "seoAuthor": "최경환",
        "detailImageCount": 9,
    },
]


def upload_media(session, file_path: Path, alt: str) -> int | None:
    """Media 컬렉션에 파일 업로드 후 id 반환."""
    if not file_path.exists():
        print(f"  ⚠️  파일 없음: {file_path}")
        return None
    with open(file_path, "rb") as f:
        files = {"file": (file_path.name, f, "image/png")}
        data = {"alt": alt}
        res = session.post(f"{API_BASE}/api/media", files=files, data=data, timeout=30)
    if res.status_code in (200, 201):
        doc = res.json().get("doc")
        return doc.get("id") if doc else None
    print(f"  ❌ 업로드 실패: {file_path.name} ({res.status_code} {res.text[:200]})")
    return None


def main():
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

    for p in PRODUCTS:
        slug = p["slug"]
        print()
        print(f"📦 {slug}")

        # 1. 썸네일 업로드
        thumb_path = PUBLIC_STORE / slug / "thumbnail.png"
        thumb_id = upload_media(session, thumb_path, f"{p['title']} 썸네일")
        print(f"  thumbnail: id={thumb_id}")

        # 2. 상세 이미지 업로드
        detail_image_objs = []
        count = p.pop("detailImageCount", 1)
        for i in range(1, count + 1):
            dpath = PUBLIC_STORE / slug / f"detail-{i}.png"
            img_id = upload_media(session, dpath, f"{p['title']} 상세 {i}")
            if img_id:
                detail_image_objs.append({"image": img_id})
                print(f"  detail-{i}: id={img_id}")

        # 3. 상품 생성
        product_data = dict(p)
        if thumb_id:
            product_data["thumbnail"] = thumb_id
        if detail_image_objs:
            product_data["detailImages"] = detail_image_objs

        # 기존 동일 slug 있으면 업데이트
        existing = session.get(
            f"{API_BASE}/api/products",
            params={"where[slug][equals]": slug, "limit": 1},
            timeout=15,
        ).json()
        if existing.get("totalDocs", 0) > 0:
            existing_id = existing["docs"][0]["id"]
            res = session.patch(
                f"{API_BASE}/api/products/{existing_id}",
                json=product_data,
                timeout=15,
            )
            print(f"  📝 update: {res.status_code}")
        else:
            res = session.post(
                f"{API_BASE}/api/products",
                json=product_data,
                timeout=15,
            )
            print(f"  ➕ create: {res.status_code}")
        if res.status_code not in (200, 201):
            print(f"     ❌ {res.text[:300]}")

    print()
    print("✅ 시드 완료")


if __name__ == "__main__":
    main()
