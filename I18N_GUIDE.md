# Next.js i18n Routing với next-intl

Dự án này đã được cấu hình với **next-intl** để hỗ trợ đa ngôn ngữ (i18n routing).

## 🌍 Ngôn ngữ được hỗ trợ

- **English (en)** - Mặc định
- **Tiếng Việt (vi)**

## 📁 Cấu trúc dự án

```
d:\next
├── app/
│   └── [locale]/          # Thư mục động cho routing theo locale
│       ├── layout.tsx     # Layout với NextIntlClientProvider
│       ├── page.tsx       # Trang chủ
│       ├── about/         # Trang giới thiệu
│       └── providers.tsx  # HeroUI Provider
├── i18n/
│   ├── request.ts         # Cấu hình request cho next-intl
│   └── routing.ts         # Cấu hình routing và navigation
├── messages/
│   ├── en.json           # Bản dịch tiếng Anh
│   └── vi.json           # Bản dịch tiếng Việt
├── components/
│   └── LanguageSwitcher.tsx  # Component chuyển đổi ngôn ngữ
└── middleware.ts         # Middleware xử lý locale detection
```

## 🚀 Cách sử dụng

### 1. Truy cập ứng dụng

Ứng dụng sẽ tự động chuyển hướng đến locale mặc định:

- `http://localhost:3000` → `http://localhost:3000/en`
- Hoặc truy cập trực tiếp: `http://localhost:3000/vi`

### 2. Chuyển đổi ngôn ngữ

Sử dụng nút chuyển đổi ngôn ngữ ở góc trên bên phải của trang.

### 3. Thêm bản dịch mới

Chỉnh sửa file trong thư mục `messages/`:

**messages/en.json**
```json
{
  "HomePage": {
    "title": "Your title here"
  }
}
```

**messages/vi.json**
```json
{
  "HomePage": {
    "title": "Tiêu đề của bạn ở đây"
  }
}
```

### 4. Sử dụng translations trong component

```tsx
import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('HomePage');
  
  return <h1>{t('title')}</h1>;
}
```

### 5. Sử dụng Link với i18n

```tsx
import { Link } from '@/i18n/routing';

export default function MyComponent() {
  return <Link href="/about">About</Link>;
}
```

Link sẽ tự động thêm locale hiện tại vào URL.

### 6. Thêm route mới với pathname tùy chỉnh

Chỉnh sửa `i18n/routing.ts`:

```typescript
export const routing = defineRouting({
  locales: ['en', 'vi'],
  defaultLocale: 'en',
  pathnames: {
    '/': '/',
    '/about': {
      en: '/about',
      vi: '/gioi-thieu'  // URL tiếng Việt khác
    },
    '/products': {
      en: '/products',
      vi: '/san-pham'
    }
  }
});
```

## 🎨 Features

✅ Tự động detect locale từ browser  
✅ Middleware xử lý routing  
✅ Type-safe translations  
✅ SEO-friendly URLs  
✅ Language switcher component  
✅ Localized pathnames  
✅ Server & Client components support  

## 📚 Tài liệu

- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Next.js i18n Routing](https://nextjs.org/docs/app/building-your-application/routing/internationalization)

## 🛠️ Commands

```bash
# Development
pnpm dev

# Build
pnpm build

# Start production
pnpm start
```

## 🌟 Demo Pages

- **Home**: `/` hoặc `/[locale]`
- **About**: `/about` (EN) hoặc `/gioi-thieu` (VI)

Chúc bạn code vui vẻ! 🎉
