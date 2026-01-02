# Catatan Keuangan Pribadi

Website catatan keuangan pribadi yang sederhana, aman, dan mudah digunakan (mobile-first).

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Firebase Firestore
- **Authentication**: Firebase Authentication
- **Styling**: Tailwind CSS + shadcn/ui
- **Font**: Google Sans Flex
- **Charts**: Recharts
- **Deployment**: Vercel

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

1. Buat project di [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Enable Authentication (Email/Password)
4. Copy konfigurasi Firebase ke `.env.local`

### 3. Setup Environment Variables

Rename `.env.local` dan isi dengan credentials Firebase Anda:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Deploy Firestore Security Rules

```bash
firebase deploy --only firestore:rules
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- ✅ Autentikasi (Email/Password)
- ✅ Dashboard dengan ringkasan keuangan
- ✅ Pencatatan transaksi (CRUD)
- ✅ Manajemen kategori
- ✅ Riwayat transaksi dengan filter
- ✅ Laporan & statistik (charts)
- ✅ Budget management
- ✅ Export data (CSV, PDF)
- ✅ Dark mode support
- ✅ Mobile-first responsive design

## Project Structure

```
catatan-keuangan/
├── app/              # Next.js App Router pages
├── components/       # React components
├── lib/             # Utilities & Firebase config
├── types/           # TypeScript type definitions
└── public/          # Static assets
```

## License

Private - Personal Use Only
