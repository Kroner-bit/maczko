# Maczkó Tetőfedés & Bádogozás - Weboldal

Ez a projekt a **Maczkó Tetőfedés** hivatalos, modern és reszponzív bemutatkozó weboldala. A webhely célja, hogy professzionális képet fessen a vállalkozásról, bemutassa a széleskörű szolgáltatásokat, és egyszerű kapcsolatfelvételi lehetőséget biztosítson az ügyfelek számára.

## 🏠 Projekt Áttekintés

A weboldal egy egyoldalas (Single Page Application) megoldás, amely letisztult esztétikával, finom animációkkal és kétnyelvű (magyar és angol) támogatással rendelkezik.

### Főbb Funkciók

- **Kétnyelvűség (HU/EN):** Teljes körű fordítási rendszer a `LanguageContext` segítségével.
- **Modern UI/UX:** Egyedi Tailwind CSS téma, Space Grotesk és Inter betűtípusokkal.
- **Interaktív Elemek:** Animált szekciók és kártyák a `motion` (framer-motion) könyvtárral.
- **Szolgáltatások Bemutatása:** Részletes lista a tetőfedési, bádogozási és karbantartási munkákról.
- **Referencia Galéria:** Portfólió szekció a korábbi projektek vizuális bemutatására.
- **Kapcsolati űrlap:** Modern, validált űrlap az érdeklődők számára.

## 🛠 Technológiai Stack

- **Frontend:** React 19, TypeScript
- **Build Tool:** Vite
- **Stílus:** Tailwind CSS 4
- **Animációk:** Motion (framer-motion)
- **Ikonok:** Lucide React
- **Routing:** React Router DOM (v7)

## 📂 Struktúra

- `src/components/`: Az oldal egyes szekciói (Hero, Services, About, Portfolio, Contact, Footer).
- `src/LanguageContext.tsx`: A nyelvváltásért felelős kontextus és hook.
- `src/translations.ts`: A magyar és angol nyelvű szövegek központi tárolója.
- `src/index.css`: Globális stílusok és Tailwind téma konfiguráció.

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

## 📝 Megjegyzés

A weboldal úgy lett kialakítva, hogy tükrözze a Maczkó Tetőfedés értékeit: **minőség, precizitás és megbízhatóság**. A dizájn a földszínekre (barna, szürke, bézs) épít, utalva a természetes építőanyagokra és a szakma jellegére.

---
*Készült a Maczkó Tetőfedés megbízásából.*
