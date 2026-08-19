# Mosaic Loop Site

Static GitHub Pages site (`VelvetRogue5/mosaicloop-site`) for **Mosaic Loop**, currently holding the iOS and Android privacy policies used for
App Store Connect and Google Play Console submission.

## Pages

- `index.html`: landing page linking to both policies.
- `privacy.html`: iOS privacy policy (App Store Connect privacy policy URL).
- `android/privacy.html`: Android privacy policy (Google Play Console privacy policy URL).

## GitHub Pages

In repository settings, enable GitHub Pages using `Deploy from a branch`, branch `main`, folder `/ (root)`.

- Home: `https://velvetrogue5.github.io/mosaicloop-site/`
- iOS privacy: `https://velvetrogue5.github.io/mosaicloop-site/privacy.html`
- Android privacy: `https://velvetrogue5.github.io/mosaicloop-site/android/privacy.html`

Paste the iOS URL into App Store Connect → App Privacy → Privacy Policy URL, and the Android URL into
Play Console → App content → Privacy policy.

## Current privacy posture

The pages describe the app as reviewed on August 19, 2026:

| Claim | Source in the app |
| --- | --- |
| No account, no login | No account code or credential storage in either port |
| Local saves only | iOS `PlayerPrefs` / Android `SharedPreferences("MosaicLoop")`: current level, board state, buffer, status, completed color order, music/sound/vibrate |
| No network transfer | Android manifest declares no `INTERNET` permission; iOS links no networking or backend SDK |
| No ads | No ad SDK; the in-game "continue" button with a video icon is interface only and is not wired to any ad network |
| No analytics / attribution / crash reporting | No such SDK in `Libraries/`, `Data/Managed/`, or the Android Gradle dependencies |
| No IDFA / no ATT prompt | No `AdSupport` or `AppTrackingTransparency` framework, no ATT usage string |
| No advertising ID (Android) | No advertising-ID permission or Play Services dependency |
| iOS required-reason APIs | `UnityFramework/PrivacyInfo.xcprivacy`: user defaults, disk space, file timestamp, system boot time |
| Android permissions | `VIBRATE` only |
| Android backup | `android:allowBackup="true"`, so the local save can appear in the user's own Google backup |
| No purchases | No StoreKit and no Play Billing in the current build |

Store declarations that match these pages: App Store **Data Not Collected**; Google Play Data safety
**no data collected, no data shared**.

Public privacy and support email: `velvet_rogue_5@proton.me`.

Update the policies and the store declarations **before release** if the app adds cloud saves, accounts,
analytics, crash reporting, advertising (including wiring up the "continue" button), attribution, remote
configuration, or any other data collection.

## Local validation

```bash
node tools/validate-site.mjs
```
