# ParkPing - React Native App Plan

## Förutsättningar (Windows + Android)

### 1. Installera Node.js
- Ladda ner från https://nodejs.org (LTS-version)
- Verifiera: `node --version` och `npm --version`

### 2. Installera Android Studio
- Ladda ner från https://developer.android.com/studio
- Under installation, välj:
  - Android SDK
  - Android SDK Platform
  - Android Virtual Device (AVD)
- Efter installation, öppna SDK Manager och installera:
  - Android 13 (Tiramisu) eller Android 14
  - Intel HAXM (för emulator)

### 3. Sätt miljövariabler
```powershell
# Lägg till i systemvariabler:
ANDROID_HOME = C:\Users\<ditt-namn>\AppData\Local\Android\Sdk
Path += %ANDROID_HOME%\platform-tools
Path += %ANDROID_HOME%\emulator
```

### 4. Skapa Android-emulator
- Öppna Android Studio → AVD Manager
- Skapa ny virtuell enhet (t.ex. Pixel 6 med Android 13)

---

## Översikt
En React Native CLI-app som detekterar när användaren parkerat bilen genom att analysera rörelsedata, och skickar en lokal push-notis som påminnelse.

## Arkitektur

### Bibliotek som behövs
| Bibliotek | Syfte |
|-----------|-------|
| `react-native-sensors` | Accelerometerdata för att detektera vibrationer/rörelse |
| `@react-native-community/geolocation` | GPS för hastighetsdetektering |
| `react-native-push-notification` | Lokala push-notiser (iOS + Android) |
| `react-native-background-actions` | Bakgrundskörning när appen är minimerad |

### Detekteringslogik
```
KÖRNING → STILLASTÅENDE/GÅNG → NOTIS
   ↓              ↓                ↓
Hög hastighet   Låg hastighet    Efter 1 min
(>10 km/h)      (<5 km/h)        stillastående
+ vibrationer   + gångmönster
```

**States:**
1. `idle` - Övervakning av
2. `monitoring` - Väntar på körning
3. `driving` - Detekterat bilkörning
4. `possibly_parked` - Övergång detekterad, väntar 1 min
5. `parked` - Notis skickad

## Filstruktur
```
ParkPing/
├── src/
│   ├── App.tsx                    # Huvudkomponent med UI
│   ├── hooks/
│   │   └── useParkingDetector.ts  # Logik för parkeringsdetektering
│   ├── services/
│   │   ├── SensorService.ts       # Accelerometer + GPS hantering
│   │   ├── NotificationService.ts # Push-notis konfiguration
│   │   └── BackgroundService.ts   # Bakgrundskörning
│   └── types/
│       └── index.ts               # TypeScript-typer
├── android/                        # Android-specifik config
├── ios/                            # iOS-specifik config
└── index.js                        # Entry point
```

## Implementationssteg

### Steg 1: Skapa React Native-projekt
```bash
npx react-native init ParkPing --template react-native-template-typescript
```

### Steg 2: Installera beroenden
```bash
npm install react-native-sensors @react-native-community/geolocation react-native-push-notification react-native-background-actions
npm install --save-dev @types/react-native-push-notification
```

### Steg 3: Native-konfiguration (iOS)
- `cd ios && pod install`
- Info.plist: Lägg till permissions för location och notifications
- Aktivera Background Modes: Location updates, Background fetch

### Steg 4: Native-konfiguration (Android)
- AndroidManifest.xml: Permissions för location, vibration, foreground service
- Skapa notification channel för Android 8+

### Steg 5: Implementera services
1. **NotificationService.ts** - Konfigurera och skicka lokala notiser
2. **SensorService.ts** - Prenumerera på accelerometer + GPS
3. **BackgroundService.ts** - Hålla appen körande i bakgrunden

### Steg 6: Implementera detekteringslogik
- `useParkingDetector.ts` hook som:
  - Lyssnar på sensordata
  - Beräknar hastighet och vibrationsnivå
  - Hanterar state-övergångar
  - Triggar notis efter 1 min stillastående

### Steg 7: Bygga UI
- En stor toggle-knapp (on/off)
- Statustext som visar aktuellt state
- Minimal, ren design

## Viktiga koncept för nybörjare

### React Native CLI vs Expo
- **Expo**: Enklare att komma igång, men begränsad tillgång till native-moduler
- **React Native CLI**: Full kontroll, kan använda vilka native-bibliotek som helst
- Vi använder CLI för att få tillgång till bakgrundskörning och sensorer

### Native Linking
- React Native-bibliotek som använder native-kod (Java/Kotlin/Swift/ObjC) måste "länkas"
- Moderna RN (0.60+) gör detta automatiskt ("autolinking")
- iOS kräver `pod install` efter att lägga till bibliotek

### Hooks
- `useState` - Hantera state i funktionskomponenter
- `useEffect` - Köra sidoeffekter (t.ex. starta sensorer)
- Custom hooks (som `useParkingDetector`) kapslar in återanvändbar logik

### Bakgrundskörning
- iOS och Android begränsar vad appar får göra i bakgrunden
- Vi använder `react-native-background-actions` för att skapa en "foreground service"
- Användaren ser en notification när övervakning är aktiv

## Verifikation (Android-fokus)
1. Starta Android-emulator
2. Köra `npx react-native run-android`
3. Testa toggle on/off i UI
4. Verifiera att bakgrundsnotis visas när övervakning är på
5. Testa att minimera appen - övervakning ska fortsätta
6. För riktig parkeringsdetektering krävs fysisk enhet med GPS

**Tips för testning i emulator:**
- Emulator har begränsad sensordata
- Använd "Extended Controls" → "Location" för att simulera GPS-rörelse
- Sänk tidsgränsen temporärt (t.ex. 10 sek istället för 1 min) för snabbare testning

## Filer att skapa/modifiera
1. `src/App.tsx` - Huvud-UI
2. `src/hooks/useParkingDetector.ts` - Detekteringslogik
3. `src/services/SensorService.ts` - Sensorhantering
4. `src/services/NotificationService.ts` - Notis-service
5. `src/services/BackgroundService.ts` - Bakgrundsservice
6. `src/types/index.ts` - TypeScript-typer
7. `android/app/src/main/AndroidManifest.xml` - Permissions
8. `ios/ParkPing/Info.plist` - Permissions
