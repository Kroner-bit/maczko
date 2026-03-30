# Maczkó Tetőfedés & Bádogozás - Weboldal és Admin Felület

Ez a projekt a **Maczkó Tetőfedés** hivatalos, modern és reszponzív bemutatkozó weboldala, kiegészítve egy teljes körű adminisztrációs felülettel az ügyfélmegkeresések kezelésére.

## 🏠 Projekt Áttekintés

A weboldal egy Single Page Application (SPA), amely letisztult esztétikával, finom animációkkal, kétnyelvű támogatással és egy biztonságos adminisztrációs panellel rendelkezik.

### Főbb Funkciók

- **Kétnyelvűség (HU/EN):** Teljes körű fordítási rendszer a `LanguageContext` segítségével.
- **Modern UI/UX:** Egyedi Tailwind CSS téma, Space Grotesk és Inter betűtípusokkal.
- **Interaktív Elemek:** Animált szekciók és kártyák a `motion` (motion/react) könyvtárral.
- **Kapcsolati űrlap:** Valós idejű adatmentés Firebase Firestore-ba.
- **Adminisztrációs Felület:** 
    - Biztonságos belépés Google fiókkal.
    - Beérkezett üzenetek listázása, részletes megtekintése és törlése.
    - **Gyorshívás:** Egy kattintással hívható telefonszámok mobilnézetben.
    - **Admin Kezelés:** Dinamikus adminisztrátori lista (adminok hozzáadása/törlése).
- **Egyedi Megerősítő Rendszer:** iFrame-barát egyedi modális ablakok és értesítések.

## 🛠 Technológiai Stack

- **Frontend:** React 19, TypeScript
- **Build Tool:** Vite
- **Backend/Adatbázis:** Firebase (Firestore, Authentication)
- **Stílus:** Tailwind CSS 4
- **Animációk:** Motion (motion/react)
- **Ikonok:** Lucide React
- **Routing:** React Router DOM (v7)

## 📂 Struktúra

- `src/components/`: Az oldal publikus szekciói (Hero, Services, About, Portfolio, Contact, Footer).
- `src/components/Admin.tsx`: Az adminisztrációs felület logikája és UI-ja.
- `src/components/Login.tsx`: Google alapú bejelentkezési felület.
- `src/LanguageContext.tsx`: A nyelvváltásért felelős kontextus és hook.
- `src/translations.ts`: A magyar és angol nyelvű szövegek központi tárolója.
- `src/firebase.ts`: Firebase SDK inicializálása és konfigurációja.
- `src/lib/firestore-errors.ts`: Standardizált hibaüzenet kezelés a Firestore műveletekhez.

## 🚀 Telepítés és Futtatás

1. **Függőségek telepítése:**
   ```bash
   npm install
   ```

2. **Fejlesztői szerver indítása:**
   ```bash
   npm run dev
   ```

3. **Build készítése:**
   ```bash
   npm run build
   ```

## 🌐 Telepítés (Deployment) - Fontos!

Ha az alkalmazást Netlify-re vagy más külső domainre telepíted, a Google bejelentkezés hibát dobhat (`auth/unauthorized-domain`).

**Megoldás:**
1. Nyisd meg a [Firebase Console](https://console.firebase.google.com/)-t.
2. Válaszd ki a projektet (`trade-444216`).
3. Menj az **Authentication** -> **Settings** -> **Authorized domains** fülre.
4. Add hozzá a Netlify-es címedet (pl. `maczkotetofedes.netlify.app`).

## 🔐 Adminisztráció

Az első adminisztrátor alapértelmezetten a `barni.kroner@gmail.com` email címmel tud belépni. Belépés után az **Adminok** fül alatt további email címeket lehet felhatalmazni az oldal kezelésére.

---
*Készült a Maczkó Tetőfedés megbízásából.*
