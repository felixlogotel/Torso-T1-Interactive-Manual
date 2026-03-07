# Tutorial Video Hosting (Railway)

The tutorial page supports a configurable external video URL.

## How it works

- `src/App.jsx` builds tutorial links as `/tutorial.html?lang=fr|en`.
- If `VITE_TUTORIAL_VIDEO_URL` is set, the link also includes `&video=<encoded_url>`.
- `public/tutorial.html` reads this URL and loads the video from it.
- Fallback (local only): `/Torso%20T-1%20Interactive%20Manual.mp4`

## Railway setup

1. Host the `.mp4` on a public URL (Railway static service, object storage, CDN, etc.).
2. In Railway variables, set:
   - `VITE_TUTORIAL_VIDEO_URL=https://your-video-host/path/tutorial.mp4`
3. Trigger a deploy (or push to `main` if auto-deploy is enabled).

## Local dev

- Optional `.env.local`:
  - `VITE_TUTORIAL_VIDEO_URL=http://localhost:8080/tutorial.mp4`
- If not set, local fallback file is used if present in `public/`.
