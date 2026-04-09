"""
심화반(vibe-coding-advanced) 상세 이미지를 새로운 12장으로 교체.
- public/store/vibe-coding-advanced/ 폴더의 thumbnail + detail-1~12 를 R2(Media)에 업로드
- Products의 thumbnail / detailImages 갱신
"""
import requests
import sys
from pathlib import Path

API_BASE = "https://ainolza.kr"
ADMIN_EMAIL = "rex39@naver.com"
ADMIN_PASSWORD = "rudghks39"
BASE_DIR = Path(__file__).resolve().parent.parent
SRC_DIR = BASE_DIR / "public" / "store" / "vibe-coding-advanced"
SLUG = "vibe-coding-advanced"

def upload(session, file_path: Path, alt: str) -> int | None:
    if not file_path.exists():
        print(f"  ⚠️ 없음: {file_path}")
        return None
    with open(file_path, "rb") as f:
        files = {"file": (file_path.name, f, "image/png")}
        data = {"alt": alt}
        res = session.post(f"{API_BASE}/api/media", files=files, data=data, timeout=60)
    if res.status_code in (200, 201):
        return res.json().get("doc", {}).get("id")
    print(f"  ❌ {file_path.name}: {res.status_code} {res.text[:200]}")
    return None

def main():
    print("🔐 로그인...")
    s = requests.Session()
    r = s.post(f"{API_BASE}/api/users/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=15)
    if r.status_code != 200:
        print(f"❌ {r.status_code}")
        sys.exit(1)
    print("✅")

    # 1. 새 썸네일 + 12장 detail 업로드
    print("\n📦 이미지 업로드 중...")
    thumb_id = upload(s, SRC_DIR / "thumbnail.png", "심화반 썸네일")
    print(f"  thumbnail: id={thumb_id}")

    detail_ids = []
    for i in range(1, 13):
        img_id = upload(s, SRC_DIR / f"detail-{i}.png", f"심화반 상세 {i}")
        if img_id:
            detail_ids.append({"image": img_id})
            print(f"  detail-{i}: id={img_id}")

    # 2. Product 갱신
    print("\n📝 DB Products 갱신...")
    r = s.get(f"{API_BASE}/api/products", params={"where[slug][equals]": SLUG, "limit": 1}, timeout=15).json()
    pid = r["docs"][0]["id"]
    update = {}
    if thumb_id:
        update["thumbnail"] = thumb_id
    if detail_ids:
        update["detailImages"] = detail_ids
    pr = s.patch(f"{API_BASE}/api/products/{pid}", json=update, timeout=30)
    print(f"  PATCH {pid}: {pr.status_code}")

    # 3. 검증
    r = s.get(f"{API_BASE}/api/products", params={"where[slug][equals]": SLUG, "depth": 2, "limit": 1}, timeout=15).json()
    doc = r["docs"][0]
    thumb = doc.get("thumbnail")
    if isinstance(thumb, dict):
        print(f"\n✅ thumbnail: {thumb.get('url')}")
    print(f"✅ detailImages: {len(doc.get('detailImages') or [])}장")

if __name__ == "__main__":
    main()
