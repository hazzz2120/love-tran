# Lyric Web V1 — Live Server

Đây là bản website thuần HTML/CSS/JavaScript, không có `run_server.bat`.

## Chạy bằng VS Code Live Server

1. Mở thư mục này bằng VS Code.
2. Cài extension **Live Server** (Ritwick Dey) nếu chưa có.
3. Chuột phải vào `index.html` → **Open with Live Server**.
4. Trang sẽ mở tại `http://127.0.0.1:5500/...`
5. Bấm **BẮT ĐẦU**.

## Cấu trúc

- `index.html` — giao diện.
- `style.css` — vũ trụ nhiều màu + animation.
- `app.js` — đồng bộ lyric theo `video.currentTime`.
- `lyrics.json` — timestamp từng từ.
- `song.mp4` — file nhạc/video gốc.

## Mốc dừng đặc biệt

Player dừng khi hết `line_index = 24`, sau đó hiện:

♥
Trân

Mốc dừng được tính từ timestamp `end` của từ cuối line 24 trong `lyrics.json`, không hard-code thời gian.

## Khi upload lên web

Giữ nguyên các file và đường dẫn tương đối. Có thể deploy thư mục này lên GitHub Pages, Vercel, Netlify hoặc host tĩnh bất kỳ có HTTPS.
