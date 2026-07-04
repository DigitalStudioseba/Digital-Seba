# Live TV Module — Scaffolding Only

**Status: Not implemented. Placeholder architecture only.**

This folder contains ONLY the folder structure, empty config files, and a
"Coming Soon" placeholder page. There is:

- No video player
- No stream URLs
- No playlists
- No external fetching or parsing of any third-party source
- No sample/demo channels

## Files

| File | Purpose |
|---|---|
| `live-tv/index.html` | Placeholder page matching the site's existing design. Shows "Coming Soon" until channels exist. |
| `live-tv/tv.css` | Empty scaffolding stylesheet, reserved for future channel grid / player styles. Uses only existing CSS variables from `assets/css/main.css`. |
| `config/channels.json` | Empty `{ "channels": [] }`. This will be the **only** file that needs editing to add channels in the future — no HTML/CSS/JS changes required. |
| `config/categories.json` | Empty `{ "categories": [] }`. Will hold channel category metadata once defined. |
| `assets/js/tv-config.js` | Reads `config/channels.json` only to detect whether any channels exist, and toggles the "Coming Soon" badge/nav label accordingly. Contains no player or streaming logic. |

## How to activate this module later

1. Add channel objects to `config/channels.json` (only with stream sources you hold rights to / are explicitly authorized to use).
2. Add matching category objects to `config/categories.json`.
3. Build out the channel grid, search/filter UI, and player inside `live-tv/index.html` (or a new `live-tv/player.html`) and `live-tv/tv.css` / a future `live-tv/tv.js`.
4. `tv-config.js` already detects non-empty `channels.json` and will flip the nav badge automatically — no other code needs to change for that part.

## Explicitly out of scope for this scaffolding

- No IPTV aggregation, playlist parsing, or channel sourcing of any kind.
- No stream playback logic (HLS.js, video.js, etc.) has been wired in.
- Nothing in this folder makes network requests to anything other than the two local JSON files listed above.
