# 🏗️ Build Instructies voor Narrowcast Pro

## Wat heb je nodig?

✅ **Node.js** (versie 16 of hoger) - [Download hier](https://nodejs.org/)  
✅ **Terminal** (komt standaard op Mac)  
✅ **10 minuten** ⏱️

---

## Stap 1: Open Terminal

1. Druk op **Cmd + Spatie**
2. Type: `terminal`
3. Druk op **Enter**

---

## Stap 2: Ga naar de project folder

```bash
cd ~/path/naar/Narrowcasting
```

**Voorbeeld:**
```bash
cd ~/Developer/Narrowcasting
# of
cd ~/Documents/Narrowcasting
```

**Tip:** Sleep de Narrowcasting folder naar het Terminal venster, dan wordt het pad automatisch ingevuld!

---

## Stap 3: Installeer dependencies (1x nodig)

```bash
npm install
cd client && npm install && cd ..
```

⏱️ Dit duurt ongeveer 2-5 minuten

---

## Stap 4: Bouw de Mac app

```bash
npm run dist:mac
```

⏱️ Dit duurt ongeveer 3-5 minuten

---

## 🎉 Klaar!

Je vindt de gebouwde app in de **dist/** folder:

```
Narrowcasting/
└── dist/
    ├── Narrowcast Pro-2.1.0-mac.zip    ← ZIP bestand (aanbevolen!)
    ├── Narrowcast Pro-2.1.0.dmg        ← DMG installer
    └── mac/
        └── Narrowcast Pro.app          ← Directe app
```

---

## Wat nu?

### Optie 1: Gebruik de ZIP (Simpelst!)

1. **Unzip** Narrowcast Pro-2.1.0-mac.zip
2. **Sleep** Narrowcast Pro.app naar Applications
3. **Rechtermuisknop** → Open
4. Klaar! 🎉

### Optie 2: Gebruik de DMG

1. **Dubbelklik** op Narrowcast Pro-2.1.0.dmg
2. **Sleep** het icoon naar Applications folder
3. **Rechtermuisknap** → Open
4. Klaar! 🎉

---

## ⚠️ Problemen?

### "npm: command not found"
➜ Node.js is niet geïnstalleerd. Download van https://nodejs.org/

### "Cannot find module 'electron'"
➜ Run eerst: `npm install`

### "Permission denied"
➜ Voeg `sudo` toe: `sudo npm install`

### Build duurt heel lang
➜ Dit is normaal! Electron is groot (100+ MB download)

---

## 🚀 Voor Windows bouwen

```bash
npm run dist:win
```

Dit creëert:
- `Narrowcast Pro-2.1.0-Portable.exe` (geen installatie nodig!)
- `Narrowcast Pro Setup 2.1.0.exe` (installer)

---

## 📊 Alle builds tegelijk

```bash
npm run dist:all
```

Bouwt Mac én Windows versies tegelijk.

---

## 💡 Tips

- **Eerste keer?** Het duurt langer omdat Electron gedownload moet worden
- **Al gebouwd?** Volgende builds gaan veel sneller
- **Disk space:** Zorg voor minimaal 500 MB vrije ruimte
- **Internet:** Snelle verbinding helpt (Electron is ~100 MB)

---

## 🔄 Opnieuw bouwen

Als je iets hebt aangepast in de code:

```bash
npm run dist:mac
```

De oude bestanden in `dist/` worden automatisch overschreven.

---

## 📦 Distributie

De ZIP en DMG bestanden in `dist/` kan je:
- ✅ Delen met anderen
- ✅ Uploaden naar een website
- ✅ Op een USB stick zetten
- ✅ Via email versturen (let op: DMG is ~120 MB!)

---

**Veel succes! 🎉**

Als je vast loopt, check dan INSTALL.md voor gebruikersinstructies.
