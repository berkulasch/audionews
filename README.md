# 📻 AudioHaber - Sesli Gazete Uygulaması

Türkiye'nin önde gelen gazetelerinden haberleri otomatik olarak çeken, yapay zeka ile seslendiren ve podcast gibi dinlemenizi sağlayan mobil uygulama.

## Özellikler

- **Otomatik Haber Çekme** - RSS feed'ler ve NewsAPI üzerinden saatlik güncelleme
- **AI Seslendirme** - OpenAI TTS ile otomatik ses üretimi
- **Kategoriler** - Siyaset, Ekonomi, Spor, Teknoloji, Dünya, Kültür
- **Audio Player** - Hız kontrolü, 15s ileri/geri, progress takibi
- **Favoriler & Geçmiş** - Firebase Auth ile kişisel deneyim
- **Arama** - Haber, kaynak ve konu bazlı arama

## Kurulum

### 1. Bağımlılıkları Kur

```bash
npm install
```

### 2. Firebase Projesi Oluştur

1. [Firebase Console](https://console.firebase.google.com)'a git
2. Yeni proje oluştur
3. **Authentication** → Email/Password'u etkinleştir
4. **Firestore** veritabanı oluştur (production mode)
5. **Storage** aktifleştir
6. **Functions** için Blaze planına geç (ücretsiz kota dahilinde)

### 3. Environment Variables

`.env.local` dosyasını Firebase config değerleriyle doldur:

```bash
cp .env.local.example .env.local
# Değerleri Firebase console'dan al ve doldur
```

### 4. Firebase'i Başlat

```bash
npx firebase-tools@latest login
npx firebase-tools@latest init
```

### 5. Cloud Functions Deploy

```bash
cd functions
npm install
cd ..
npx firebase-tools@latest deploy --only firestore:rules,storage,functions
```

### 6. API Keys

- **NewsAPI**: [newsapi.org](https://newsapi.org) - Ücretsiz plan: 100 istek/gün
- **OpenAI**: [platform.openai.com](https://platform.openai.com) - TTS için

Firebase Functions config:
```bash
npx firebase-tools@latest functions:config:set openai.key="YOUR_KEY"
npx firebase-tools@latest functions:config:set newsapi.key="YOUR_KEY"
```

### 7. Uygulamayı Çalıştır

```bash
# iOS Simulator
npm run ios

# Android Emulator
npm run android

# Expo Go (QR kod ile telefon)
npm start
```

