# GSA02 QA/QC – วิธีทำเป็นแอป Android (APK)

## ไฟล์ในชุดนี้
| ไฟล์ | หน้าที่ |
|---|---|
| `index.html` | ตัวแอป |
| `manifest.json` | ชื่อแอป ไอคอน สีธีม (ทำให้ติดตั้งเป็นแอปได้) |
| `sw.js` | ทำให้แอปเปิดได้แม้ไม่มีเน็ต |
| `icons/` | ไอคอนแอป |
| `.nojekyll` | ไฟล์ว่าง จำเป็นสำหรับ GitHub Pages (ขั้นตอน C) |

---

## A. นำแอปขึ้นเว็บด้วย GitHub Pages (ฟรี)
1. สมัคร / เข้าสู่ระบบ https://github.com
2. กด **New repository** ตั้งชื่อเป็น **`<ชื่อผู้ใช้>.github.io`** (เช่น `gsa02qc.github.io`)
   - ต้องตั้งชื่อแบบนี้ ไม่งั้นแอป Android จะมีแถบ URL ด้านบน
   - เลือก **Public** แล้วกด Create
3. กด **Add file → Upload files** แล้วลากไฟล์ทั้งหมดในชุดนี้ (รวมโฟลเดอร์ `icons`) → **Commit changes**
4. ถ้าไม่เห็นไฟล์ `.nojekyll` ใน repo: กด **Add file → Create new file** ตั้งชื่อ `.nojekyll` ไม่ต้องใส่เนื้อหา → Commit
5. ไปที่ **Settings → Pages** → Source: **Deploy from a branch** → Branch: `main` / `(root)` → **Save**
6. รอ 1–2 นาที แอปจะอยู่ที่ `https://<ชื่อผู้ใช้>.github.io`
7. ลองเปิดลิงก์นี้ใน Chrome บนมือถือ Android ให้แน่ใจว่าใช้งานได้

> repo แบบ Public จะเห็นได้เฉพาะ **โค้ดแอป** – แบบแปลนและข้อมูลที่แจ้งเก็บอยู่ในมือถือแต่ละเครื่อง **ห้ามอัปโหลดแบบแปลนขึ้น repo**

## B. สร้างไฟล์ APK ด้วย PWABuilder
1. เปิด https://www.pwabuilder.com ใส่ลิงก์จากขั้น A → **Start**
2. กด **Package For Stores** → เลือก **Android** → **Generate Package**
3. ตั้งค่า (กด Options / All settings):
   - **Package ID:** เช่น `io.github.<ชื่อผู้ใช้>.gsa02qaqc` (ตั้งครั้งเดียว ห้ามเปลี่ยนภายหลัง)
   - **App name:** GSA02 QA/QC
   - **Signing key:** *Create new* แล้วจด **รหัสผ่าน** ไว้
4. ดาวน์โหลดไฟล์ zip ที่ได้ ข้างในมี:
   - `*.apk` → ใช้ลงเครื่องโดยตรง
   - `*.aab` → ใช้ขึ้น Google Play Store (ถ้าต้องการ)
   - `assetlinks.json` → ใช้ในขั้น C
   - `signing.keystore` + ไฟล์รหัสผ่าน → **เก็บไว้ให้ดี** ต้องใช้ทุกครั้งที่ออก APK เวอร์ชันใหม่

## C. ซ่อนแถบ URL ในแอป (ทำครั้งเดียว)
1. ใน GitHub repo กด **Add file → Create new file**
2. ตั้งชื่อไฟล์: `.well-known/assetlinks.json`
3. เปิดไฟล์ `assetlinks.json` จากขั้น B คัดลอกเนื้อหาทั้งหมดมาวาง → Commit
4. ตรวจที่ `https://<ชื่อผู้ใช้>.github.io/.well-known/assetlinks.json` ต้องเห็นเนื้อหาไฟล์

## D. ลงแอปในมือถือ Android
1. ส่งไฟล์ `.apk` ให้ทีม (ทาง LINE / Google Drive)
2. เปิดไฟล์บนมือถือ → อนุญาต **ติดตั้งแอปที่ไม่รู้จัก** สำหรับแอปที่ใช้เปิด (LINE / Drive / Files)
3. ถ้า Play Protect เตือน → **รายละเอียดเพิ่มเติม → ติดตั้งต่อ** (เพราะไม่ได้ลงผ่าน Play Store)
4. เปิดแอป → แท็บ **ตั้งค่า** ใส่ชื่อผู้ตรวจ → แท็บ **แบบแปลน** เพิ่มแบบ

## E. อัปเดตแอปภายหลัง
- แก้ไข `index.html` ใน GitHub แล้ว **เปลี่ยนเลข `VERSION` ใน `sw.js`** (เช่น `v1` → `v2`)
- มือถือทุกเครื่องจะได้เวอร์ชันใหม่เองเมื่อเปิดแอปตอนมีเน็ต **ไม่ต้องลง APK ใหม่**
- ต้องออก APK ใหม่ (ขั้น B ด้วย signing key เดิม) เฉพาะเมื่อเปลี่ยน **ชื่อแอป / ไอคอน / Package ID**
