# 🚀 Narrowcast Pro - Simpele Installatie voor Mac

## Wat is dit?

Narrowcast Pro is een programma waarmee je **meerdere Chromecasts tegelijk kunt bedienen**.

Je kunt content (websites, weer, klokken, video's) maken en naar je TV's sturen.

---

## ✅ Wat heb je nodig?

- Een Mac (macOS 10.13 of nieuwer)
- Een internetverbinding
- Een of meerdere Chromecasts op hetzelfde WiFi netwerk
- **10 minuten tijd**

**Je hoeft NIETS van programmeren te weten!**

---

## 📥 STAP 1: Download het Project

### Optie A: Met Download Knop (Makkelijkst)

1. Ga naar: https://github.com/wouterbrem/Narrowcasting
2. Klik op de groene **"Code"** knop (rechtsboven)
3. Klik op **"Download ZIP"**
4. De download start (ongeveer 50 MB)
5. Dubbelklik op het gedownloade **Narrowcasting-main.zip** bestand
6. Er verschijnt een map **Narrowcasting-main**

### Optie B: Met Terminal (Als je git hebt)

```bash
git clone https://github.com/wouterbrem/Narrowcasting.git
cd Narrowcasting
```

---

## 🎯 STAP 2: Start de Installatie

### Heel Simpel:

1. **Open de map** Narrowcasting-main (of Narrowcasting)
2. **Dubbelklik** op het bestand: **`START_HIER_MAC.command`**
3. **Wacht** terwijl het installeert (5-10 minuten)
4. **Klaar!** De app start automatisch

### Wat gebeurt er?

Het script doet dit automatisch:
- ✅ Checkt of Node.js is geïnstalleerd (installeert het zo nodig)
- ✅ Installeert alle benodigde onderdelen
- ✅ Bouwt de applicatie
- ✅ Start de applicatie
- ✅ Opent je browser naar http://localhost:3001

**Je hoeft NIETS te doen behalve dubbelklikken!**

---

## 🎉 STAP 3: Gebruik de App

Na installatie opent je browser automatisch en zie je:

```
╔════════════════════════════════════════════════╗
║ 🖥️ Narrowcast Pro                              ║
╠════════════════════════════════════════════════╣
║ Dashboard | Devices | Slides | Presentations  ║
╠════════════════════════════════════════════════╣
║                                                ║
║ 📺 Discovered Devices                          ║
║                                                ║
║ Je Chromecasts verschijnen hier automatisch!   ║
║                                                ║
╚════════════════════════════════════════════════╝
```

### Eerste Keer Gebruik:

**1. Chromecasts Checken**
- Je Chromecasts verschijnen automatisch in de lijst
- Niet zichtbaar? Zie "Problemen Oplossen" hieronder

**2. Eerste Slide Maken**
- Klik op **"Slides"** (bovenaan)
- Klik op **"Create Slide"**
- Kies **"Clock"** (simpelste optie)
- Vul een naam in: "Mijn Eerste Klok"
- Klik **"Create Slide"**

**3. Presentatie Maken**
- Klik op **"Presentations"** (bovenaan)
- Klik op **"Create Presentation"**
- Vul naam in: "Test Presentatie"
- Klik **"Add Slide"** en selecteer je klok
- Klik **"Create Presentation"**

**4. Casten naar TV!**
- Ga terug naar **"Dashboard"**
- Vink je Chromecast aan
- Selecteer je presentatie
- Klik **"Cast to Selected Devices"**
- 🎉 **Je ziet nu de klok op je TV!**

---

## 🔄 De App Later Opnieuw Starten

**Heel simpel:**

1. Dubbelklik opnieuw op **`START_HIER_MAC.command`**
2. De app start (veel sneller nu, ~10 seconden)
3. Browser opent automatisch

**Of vanaf de terminal:**
```bash
cd /pad/naar/Narrowcasting
npm start
```

---

## 🛑 De App Stoppen

In het terminal venster dat open is:
- Druk **Ctrl+C**
- Of sluit gewoon het terminal venster

---

## ❓ Problemen Oplossen

### Probleem: "Kan START_HIER_MAC.command niet openen"

**Oplossing:**
1. Rechtermuisklik op **START_HIER_MAC.command**
2. Klik **"Openen"**
3. Klik nogmaals **"Openen"** in de waarschuwing
4. Volgende keer kun je gewoon dubbelklikken

### Probleem: "Node.js niet gevonden"

**Oplossing:**
Het script probeert Node.js automatisch te installeren, maar als dat niet werkt:

1. Ga naar: https://nodejs.org
2. Download de **LTS versie** (groene knop)
3. Installeer het
4. Run **START_HIER_MAC.command** opnieuw

### Probleem: "Chromecasts niet zichtbaar"

**Check:**
- ✅ Zijn je Chromecasts aangezet?
- ✅ Zijn je Mac en Chromecasts op hetzelfde WiFi?
- ✅ Heb je netwerk toegang toegestaan toen gevraagd?

**Oplossing:**
1. Herstart de app (Ctrl+C en opnieuw starten)
2. Herstart je Chromecasts (stekker eruit, wachten, stekker erin)
3. Check je firewall instellingen:
   - **Systeem Voorkeuren** → **Beveiliging & Privacy** → **Firewall**
   - Klik **Firewalloptie's**
   - Zoek "Node" en zet op **"Sta binnenkomende verbindingen toe"**

### Probleem: "Port 3001 already in use"

**Oplossing:**
Er draait al een ander proces op poort 3001.

**Terminal commando:**
```bash
lsof -ti:3001 | xargs kill
```

Dan opnieuw starten.

### Probleem: Browser opent niet automatisch

**Oplossing:**
Open je browser handmatig en ga naar:
```
http://localhost:3001
```

Bookmark deze pagina voor makkelijke toegang!

---

## 💡 Tips

### Laat Terminal Open
Laat het terminal venster open terwijl je de app gebruikt. Sluit het alleen als je klaar bent.

### Bookmark de URL
Bookmark http://localhost:3001 in je browser voor snelle toegang.

### Check Logs
Als iets niet werkt, klik op **"Logs"** in de app om te zien wat er gebeurt.

### Auto-start bij Opstarten
Wil je dat Narrowcast Pro automatisch start bij opstarten van je Mac?
1. Ga naar **Systeem Voorkeuren** → **Gebruikers & Groepen**
2. Klik **Aanmeldobjecten**
3. Klik **+** en selecteer **START_HIER_MAC.command**

---

## 📁 Waar Staat Alles?

**De applicatie:**
```
~/Downloads/Narrowcasting-main/
```
(of waar je het hebt uitgepakt)

**Je content (slides, presentaties):**
```
~/Library/Application Support/Narrowcast Pro/data/
```

**Logs (voor troubleshooting):**
```
~/Library/Application Support/Narrowcast Pro/logs/
```

---

## 🆘 Hulp Nodig?

### Uitgebreide Documentatie
- **Complete installatie guide:** Open **INSTALL.md**
- **Snelstart gids:** Open **QUICK_START.md**
- **Volledige documentatie:** Open **README.md**

### Online Hulp
- **GitHub Issues:** https://github.com/wouterbrem/Narrowcasting/issues
- Klik "New Issue" en beschrijf je probleem

---

## 🎓 Wat Kun Je Allemaal?

### 9 Soorten Slides:
1. **Web Page** - Elke website
2. **YouTube** - YouTube video's
3. **Weather** - Weersvoorspelling
4. **RSS Feed** - Nieuwsfeeds
5. **Clock** - Klok met tijd/datum
6. **Image** - Afbeeldingen
7. **Social Media** - Social media feeds
8. **News** - Nieuws headlines
9. **Custom HTML** - Je eigen HTML

### Custom Branding:
- Upload je logo
- Stel kleuren in
- Voeg tekst overlay toe

### Presentaties:
- Combineer meerdere slides
- Stel duur per slide in
- Cast naar meerdere TV's tegelijk

---

## ✅ Checklist: Ben je Klaar?

- [ ] Project gedownload
- [ ] START_HIER_MAC.command gedubbelklikt
- [ ] Installatie voltooid (5-10 min)
- [ ] Browser geopend naar localhost:3001
- [ ] Chromecasts zichtbaar in Dashboard
- [ ] Eerste slide gemaakt
- [ ] Eerste presentatie gemaakt
- [ ] Succesvol gecast naar TV
- [ ] 🎉 **Klaar om te gebruiken!**

---

## 🚀 Volgende Stappen

Nu Narrowcast Pro werkt, kun je:

1. **Meer slides maken** - Probeer alle 9 types!
2. **Branding instellen** - Upload je logo
3. **Meerdere presentaties** - Maak verschillende shows
4. **Cast naar meerdere TV's** - Selecteer meerdere Chromecasts

**Veel plezier met Narrowcast Pro!** 🎉

---

**Nog vragen? Open een issue op GitHub of check de documentatie!**

**Versie:** 2.1.0
**Laatste update:** 2024-11-05
