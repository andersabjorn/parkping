# Bidra till ParkPing

Tack for att du vill bidra till ParkPing! Har ar riktlinjer for hur du gar tillvaga.

## Kom igang

1. Forka repot
2. Klona din fork: `git clone https://github.com/<ditt-namn>/parkping.git`
3. Installera beroenden: `npm install`
4. Skapa en ny branch: `git checkout -b feature/min-feature`

## Utvecklingsmiljo

### Krav
- Node.js (LTS-version)
- Android Studio med Android SDK
- Miljovariablerna `ANDROID_HOME` och `JAVA_HOME` satta korrekt

### Starta appen
```bash
npm start          # Starta Metro bundler
npm run android    # Bygg och kor pa Android-emulator
```

## Kodstandard

### TypeScript
- All ny kod ska vara TypeScript (.ts/.tsx)
- Undvik `any` - anvand korrekta typer
- Definiera typer i `src/types/index.ts` om de delas mellan filer

### Projektstruktur
- **UI-komponenter** i `src/` (eller `src/components/` vid behov)
- **Hooks** i `src/hooks/`
- **Services** i `src/services/`
- **Typer** i `src/types/`

### Namngivning
- Filer: PascalCase for services och komponenter (`SensorService.ts`), camelCase for hooks (`useParkingDetector.ts`)
- Variabler och funktioner: camelCase
- Typer och interfaces: PascalCase
- Konstanter: UPPER_SNAKE_CASE for konfigurationsvarden

### Stil
- Kor `npm run lint` innan du committar
- Folj befintlig kodstil i projektet
- Holl komponenter och funktioner fokuserade - en sak per funktion

## Arbetssatt

### Branches
- `main` - stabil kod
- `feature/<namn>` - nya funktioner
- `fix/<namn>` - buggfixar

### Commits
- Skriv tydliga commit-meddelanden pa engelska
- Borja med verb: "Add", "Fix", "Update", "Remove"
- Exempel: `Add vibration threshold configuration`

### Pull requests
1. Se till att appen bygger utan fel: `npx tsc --noEmit`
2. Se till att lint gar igenom: `npm run lint`
3. Testa pa emulator eller fysisk enhet
4. Beskriv vad andringen gor och varfor i PR-beskrivningen

## Viktigt att tanka pa

### Sensordata och batteri
- Var sparsam med sensoravlasningar - hog frekvens dranar batteri
- Anvand rimliga `distanceFilter` och `interval` for GPS
- Stoppa sensorer nar overvakning ar avstangd

### Bakgrundstjanster
- Android kraver foreground service notification for bakgrundskod
- Testa att appen fungerar bade i forgund och bakgrund
- Testa att appen aterhamtar sig efter att systemet dodat den

### Permissions
- Lagg till nya permissions i `android/app/src/main/AndroidManifest.xml`
- Be alltid om tillstand i runtime for kansliga permissions (plats, notiser)
- Hantera fallet dar anvandaren nekar tillstand

### Testning
- Emulator har begransad sensordata - testa GPS via Extended Controls
- For accelerometer och riktig parkeringsdetektering kravs fysisk enhet
- Anvand `DEV_CONFIG` (10 sek delay) for snabbare testning under utveckling

### Sakerhet
- Committa aldrig `.env`-filer eller nycklar
- Anvand `.gitignore` for kansliga filer
- `android/app/debug.keystore` ar bara for debug-byggen

## Rapportera buggar

Oppna ett issue med:
- Beskrivning av problemet
- Steg for att reproducera
- Forvantad vs faktisk beteende
- Enhet/emulator och Android-version
