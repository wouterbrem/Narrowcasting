# 📦 Narrowcast Pro - Installatie Gids

**Versie 2.1.0** - Super simpele installatie in 3 stappen!

---

## 🍎 Mac Installatie (Aanbevolen Methode)

### Stap 1: Download
Download **Narrowcast Pro-2.1.0-mac.zip**

### Stap 2: Unzip
Dubbelklik op het gedownloade bestand om het uit te pakken

### Stap 3: Sleep naar Applications
```
┌─────────────────┐
│  Narrowcast Pro │  ──────►  📁 Applications
│      .app       │
└─────────────────┘
```

Sleep de **Narrowcast Pro.app** naar je **Applications** map

### Stap 4: Open de App
1. Ga naar Applications
2. **Rechtermuisknop** op Narrowcast Pro
3. Klik **"Open"** (eerste keer)
4. Klik nogmaals **"Open"** in de waarschuwing
5. Klaar! 🎉

**Let op:** Eerste keer moet je rechtermuisklik + "Open" gebruiken omdat de app niet gesigneerd is (dit is normaal!)

---

## 🪟 Windows Installatie

### Methode 1: Portable (Geen Installatie!)

**Simpelst!** Geen installatie nodig!

1. Download **Narrowcast-Pro-2.1.0-Portable.exe**
2. Dubbelklik om te starten
3. Klaar! 🎉

**Let op:** Windows Defender SmartScreen waarschuwing?
- Klik **"Meer informatie"**
- Klik **"Toch uitvoeren"**
- Dit is normaal voor niet-gesigneerde apps!

### Methode 2: Installer (Met Shortcuts)

Als je shortcuts op je bureaublad wilt:

1. Download **Narrowcast-Pro-Setup-2.1.0.exe**
2. Dubbelklik om installer te starten
3. Kies installatie locatie
4. Klik door de wizard
5. Klaar! 🎉

---

## 🔥 Eerste Keer Opstarten

### Wat gebeurt er?

1. **App start** → Je ziet het Narrowcast Pro window
2. **Browser opent** → http://localhost:3001
3. **Toestemming vragen** → Sta netwerktoegang toe!

### Netwerk Toestemming (Belangrijk!)

**Mac:**
```
┌──────────────────────────────────────────┐
│  "Node" wil inkomende netwerkverbindingen│
│   accepteren.                             │
│                                           │
│   [Weigeren]  [Toestaan]                 │
└──────────────────────────────────────────┘
```
**→ Klik "Toestaan"**

**Windows:**
```
┌──────────────────────────────────────────┐
│  Windows Defender Firewall                │
│  Node.js toegang geven?                   │
│                                           │
│  [Privénetwerken]  ✓                     │
│  [Openbare netwerken]  ✓                 │
│                                           │
│  [Toegang toestaan]                       │
└──────────────────────────────────────────┘
```
**→ Klik "Toegang toestaan"**

**Waarom?** Narrowcast Pro heeft netwerktoegang nodig om Chromecasts te vinden!

---

## ✅ Checklist: Alles Werkt!

Na installatie zou je moeten zien:

- [ ] ✅ App is gestart
- [ ] ✅ Browser is open op http://localhost:3001
- [ ] ✅ Dashboard is zichtbaar
- [ ] ✅ Chromecasts verschijnen automatisch (als je er hebt)

**Chromecasts niet zichtbaar?** Zie "Problemen Oplossen" hieronder.

---

## 🚀 Snelstart na Installatie

### 1. Maak je Eerste Slide
```
Dashboard → Slides → [Create Slide]
→ Kies "Clock" (simpelst)
→ Vul naam in
→ [Create Slide]
```

### 2. Maak je Eerste Presentatie
```
Dashboard → Presentations → [Create Presentation]
→ Vul naam in
→ [Add Slide] → Selecteer je Clock slide
→ [Create Presentation]
```

### 3. Cast naar je Display!
```
Dashboard
→ Vink Chromecast(s) aan
→ Selecteer je presentatie
→ [Cast to Selected Devices]
→ 🎉 Het werkt!
```

---

## 🔧 Problemen Oplossen

### "App kan niet worden geopend" (Mac)

**Symptoom:**
```
"Narrowcast Pro.app" kan niet worden geopend omdat
het afkomstig is van een onbekende ontwikkelaar
```

**Oplossing:**
1. Ga naar **Systeemvoorkeuren**
2. → **Beveiliging en Privacy**
3. Klik onderaan **"Toch openen"**

**Of:**
1. **Rechtermuisknop** op de app
2. Klik **"Open"**
3. Klik nogmaals **"Open"**

Dit hoef je maar **één keer** te doen!

### SmartScreen Waarschuwing (Windows)

**Symptoom:**
```
Windows Defender SmartScreen heeft deze app geblokkeerd
```

**Oplossing:**
1. Klik **"Meer informatie"**
2. Klik **"Toch uitvoeren"**

Dit is normaal voor niet-gesigneerde apps!

### Chromecasts Niet Zichtbaar

**Check:**
- [ ] Zijn je Chromecasts aangezet?
- [ ] Zitten je computer EN Chromecasts op hetzelfde WiFi netwerk?
- [ ] Heb je netwerktoegang toegestaan?

**Firewall Check:**

**Mac:**
```
Systeemvoorkeuren → Beveiliging en Privacy
→ Firewall → Firewallvoorkeuren
→ Check: "Node" of "Narrowcast Pro" staat op TOEGESTAAN
```

**Windows:**
```
Windows Firewall → Een app toestaan
→ Zoek "Node.js"
→ Check: Zowel Privé als Openbaar aangevinkt
```

**Nog steeds niet?**
1. Herstart de app
2. Check de **Logs** pagina in de app
3. Kijk naar foutmeldingen

### Poort 3001 al in gebruik?

**Mac:**
```bash
lsof -ti:3001 | xargs kill
```

**Windows:**
1. Open Taakbeheer
2. Zoek "node" processen
3. Stop ze
4. Herstart app

---

## 📂 Waar Staat Alles?

### Logs (voor troubleshooting)
**Mac:**
```
~/Library/Application Support/Narrowcast Pro/logs/
```

**Windows:**
```
%APPDATA%\Narrowcast Pro\logs\
```

### User Data (slides, presentations, branding)
**Mac:**
```
~/Library/Application Support/Narrowcast Pro/data/
```

**Windows:**
```
%APPDATA%\Narrowcast Pro\data\
```

### Geüploade Bestanden (logo's)
**Mac:**
```
~/Library/Application Support/Narrowcast Pro/uploads/
```

**Windows:**
```
%APPDATA%\Narrowcast Pro\uploads\
```

**Tip:** Je kunt deze mappen openen vanuit de app:
```
Help menu → Open Logs Folder
```

---

## 🎨 Volgende Stappen

Nu je app werkt:

1. **📊 Maak meer slides** - Probeer alle 9 types!
   - Web pagina's
   - YouTube videos
   - Weer informatie
   - RSS feeds
   - Klok
   - Foto's
   - Social media
   - Nieuws
   - Custom HTML

2. **🎨 Pas branding aan**
   - Upload je logo
   - Stel je kleuren in
   - Voeg tekst overlay toe

3. **📽️ Bouw presentaties**
   - Combineer meerdere slides
   - Stel duur per slide in
   - Cast naar meerdere displays tegelijk!

---

## 📞 Hulp Nodig?

1. **Check de Logs** - Ga naar Logs pagina in de app
2. **Lees de README.md** - Uitgebreide documentatie
3. **Zie QUICK_START.md** - Snelle gids
4. **Check BUILD.md** - Als je zelf wilt builden

---

## 🔄 Update

Nieuwe versie beschikbaar?

1. Download nieuwe versie
2. Stop oude app
3. Vervang oude .app/.exe met nieuwe
4. Start nieuwe versie
5. Klaar!

Je data blijft behouden!

---

**Veel plezier met Narrowcast Pro!** 🎉

**Versie:** 2.1.0
**Support:** Check README.md voor meer info
