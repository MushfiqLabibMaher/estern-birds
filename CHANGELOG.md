# Estern Birds — Version History

All changes to the website are recorded here.
Format: **version number · date · what changed**

---

## v3.0 — 2026-05-30 (b2fe8dd)
- Added `start.bat` — double-click to launch local server
- Added `save-version.bat` — double-click to save a version
- Added `versions.bat` — double-click to see version history
- Added `serve.json` — fixes directory listing issue

## v2.0 — 2026-05-30 (f0141b6)
- Split into two pages: `index.html` (homepage) and `birds.html` (all birds)
- Homepage now shows 3 featured birds + "View All Birds" button
- Added "How to Buy" steps section on homepage
- Removed home delivery — replaced with "Hand to Hand Sale Only" notice
- Added policy badges: 🤝 Hand to Hand · ✅ Healthy · ❌ No Delivery
- WhatsApp button added to every bird card and modal
- Modal now shows "Hand to hand sale only" note

## v1.0 — 2026-05-30 (35e6859)
- Initial launch of Estern Birds website
- Connected to Supabase — live bird data
- 6 birds seeded in database with prices
- Bird cards with price, fun fact, WhatsApp order button
- Modal detail view for each bird
- Animated hero with floating feathers
- Responsive design (mobile + desktop)
- WhatsApp contact: 01711667746

---

## How to Add a New Version Entry

After making changes, open this file and add a new block at the TOP:

```
## v4.0 — 2026-05-30
- Cloudinary video storage integrated (cloud name: 859984872331155)
- Added `video_url` column to Supabase birds table
- Bird cards show ▶ Video badge and "Watch & Details" button when video exists
- Modal plays Cloudinary video inline when available, falls back to image
- Video stops automatically when modal is closed
- Cloudinary credentials stored in .env.local
- To add a video: upload to Cloudinary, copy the public_id, paste into `video_url` in Supabase

## v3.1 — YYYY-MM-DD
- What you changed
- Another change
```

Then run `save-version.bat` and type the version number as the description.
