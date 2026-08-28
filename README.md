# SOS Connect Admin

Web admin portal cho SOS Connect. Stack theo project rules: React, TypeScript, Vite, React Router, TanStack Query, Zustand, Axios, Ant Design, React Hook Form, Zod.

State server dùng TanStack Query. State UI (sidebar, session client) dùng Zustand — không dùng Redux vì rules cấm, trừ khi có lý do kiến trúc riêng.

## Chạy dự án

```bash
cp .env.example .env
npm install
npm run dev
```

Mở http://localhost:5173

Đăng nhập demo: `0900000001` / `admin123`

API hiện mock, mỗi request chờ 2 giây. TODO gắn NestJS sau.

## Cấu trúc

- `src/app` — router, layout, theme, config
- `src/features/*` — mỗi trang có `pages/` và `hooks/` logic riêng
- `src/components/ui` — CustomButton, CustomTextField
- `src/utils/validation.ts` — validate SĐT, tên, email...
- `src/utils/format.ts` — format ngày, SĐT, số
- `src/utils/status` — nhãn/màu trạng thái
- `src/app/theme/colors.ts` — palette dùng chung
