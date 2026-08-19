# Mosaic Loop Site

Static GitHub Pages site (`VelvetRogue5/mosaicloop-site`) for **Mosaic Loop**, currently holding the iOS and Android privacy policies used for
App Store Connect and Google Play Console submission.

## Pages

- `index.html`: landing page linking to every document.
- `privacy.html`: iOS privacy policy (App Store Connect privacy policy URL).
- `terms-of-use.html`: iOS terms of use.
- `marketing.html`: App Store listing copy and submission notes.
- `android/privacy.html`: Android privacy policy (Google Play Console privacy policy URL).
- `android/terms-of-use.html`: Android terms of use.
- `android/marketing.html`: Google Play listing copy, Data safety draft, and submission notes.
- `support/index.html`: support page for both platforms (App Store Connect / Play Console support URL).

## GitHub Pages

In repository settings, enable GitHub Pages using `Deploy from a branch`, branch `main`, folder `/ (root)`.

- Home: `https://velvetrogue5.github.io/mosaicloop-site/`
- iOS privacy: `https://velvetrogue5.github.io/mosaicloop-site/privacy.html`
- iOS terms: `https://velvetrogue5.github.io/mosaicloop-site/terms-of-use.html`
- iOS marketing: `https://velvetrogue5.github.io/mosaicloop-site/marketing.html`
- Android privacy: `https://velvetrogue5.github.io/mosaicloop-site/android/privacy.html`
- Android terms: `https://velvetrogue5.github.io/mosaicloop-site/android/terms-of-use.html`
- Android marketing: `https://velvetrogue5.github.io/mosaicloop-site/android/marketing.html`
- Support: `https://velvetrogue5.github.io/mosaicloop-site/support/`

Where each URL goes:

| Field | URL |
| --- | --- |
| App Store Connect → App Privacy → Privacy Policy URL | `/privacy.html` |
| App Store Connect → App Information → Support URL | `/support/` |
| App Store Connect → App Information → Marketing URL (optional) | `/` |
| App Store Connect → License Agreement (if not using Apple's EULA) | `/terms-of-use.html` |
| Play Console → App content → Privacy policy | `/android/privacy.html` |
| Play Console → Store listing → Website | `/` |

The `marketing.html` and `android/marketing.html` pages are working documents for filling in the listing
forms, not pages the stores link to. Character counts next to each block are checked by the validator.

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
| Levels ship inside the app | 30 level files in the app bundle / APK assets; nothing is fetched at runtime |

Store declarations that match these pages: App Store **Data Not Collected**; Google Play Data safety
**no data collected, no data shared**.

## Level packs differ by platform

As of August 19, 2026 the two builds ship **different levels**, which is why the store copy is not shared:

- **Android** (`mosaicloop_android/app/src/main/assets/levels/`): a 12x2 two-color tutorial plus 29 animal and
  nature pictures (Whale, Koi Fish, Butterfly, Black Cat, Puppy, Fox, Panda, Peacock, Dragon, Unicorn, Seahorse,
  Parrot, Penguin, Elephant, Forest Deer, Jellyfish, Dragonfly, Owl, Tiger Cub, Cactus Bloom, Koi Pair, Moon
  Rabbit, Phoenix, Turtle Reef, Honey Bee, Peacock Fan, Rose, Snowman, Smiling Planet), boards growing 20x22 to
  26x28. Cells outside the picture render as recessed pegboard holes.
- **iOS** (`Data/resources.assets` in the Unity export): the original abstract mosaic pack, varied grid sizes
  (27x30, 29x29, 35x22, 38x23, 32x32 and so on).

If the picture pack is ported to iOS, rewrite `marketing.html` to match `android/marketing.html` and update the
Current Features section of `terms-of-use.html`.

Public privacy and support email: `velvet_rogue_5@proton.me`.

Bundle id / application id on both platforms: `ai.mosaicloop.game`.

Update the policies, the terms, the marketing copy, and the store declarations **before release** if the app
adds cloud saves, accounts, analytics, crash reporting, advertising (including wiring up the "continue"
button), attribution, remote configuration, **levels served from Firebase or any other remote host**, or any
other data collection. Serving levels remotely is the one already on the roadmap: it would add network access,
so both privacy policies and both store declarations must be revised before that ships. The validator only checks that the
pages are internally consistent; it cannot tell you the app changed.

## Local validation

```bash
node tools/validate-site.mjs
```
