# TOUGE OVERDRIVE｜極速山嶺

[Play online / 公開遊玩](https://bd-cs1.github.io/touge-overdrive/)

An original, first-person, landscape mountain racing game. Three courses (dry dawn, wet midnight and fog), three fictional cars, seven AI rivals, race/time-attack modes, arcade driving assistance, drifting, collision damage, real rear-view camera and procedural Eurobeat/engine audio.

## Run and modify

The deployable site lives in `dist/`. Serve it over HTTP; ES modules do not run through `file://`. No external dependencies or runtime network requests are required.

```sh
python3 -m http.server 8080 --directory dist
npm test
npm run check
```

- `game.js`: lifecycle, HUD, keyboard/pointer input, records, fullscreen.
- `race.js`: fixed-step vehicle and AI simulation; vehicle configuration.
- `world.js`: track generation, original car models and scene geometry.
- `renderer.js`: WebGL GPU pipeline, atmospheric shader and rear camera.
- `software.js`: automatic Canvas 2D projection fallback with the same 3D track.
- `cockpit.js`: dashboard instruments, wheel, weather and windscreen wiper.
- `audio.js`: Web Audio engine, tyre noise and original 152 BPM synthesizer music.
- `style.css`, `index.html`: responsive menu, HUD, controls and dialogs.

## Controls

- WASD / arrows: steer, throttle, brake. Space: handbrake. R: reset car alignment.
- P / Esc: pause. M: toggle sound. F: fullscreen. Enter: start from garage.
- Mobile: landscape recommended; left/right buttons and brake/gas/handbrake support simultaneous pointers.
- Auto throttle and steering assistance are on by default. Brake overrides auto throttle.
- Changing focus or hiding the page pauses the race. Audio begins after a user gesture.

## Records and privacy

Best times are stored only in browser `localStorage` under `touge-records-v1`, separately by course, car and mode. Clearing browser storage removes records. There are no accounts, network multiplayer, analytics, remote scoreboards or backend services. Source is preserved in the Site's repository. Hosting identity is in `.openai/hosting.json`; preserve it on updates.

## Validation

`npm test` includes a regression test for the WebGL camera basis: left/right projection, upright views on slopes, rear-facing views, and steering/scene motion. This reproduces the original mirrored steering fault before the fix and passes after it. The physics suite checks geometry, braking in all weather, manual throttle, guardrail collisions, seven opponents, finish logic and a complete feedback-driven race on every course. Browser QA covered the Canvas fallback, menu, starting, timing, pause, rain, sound initialization, mobile landscape/portrait layouts and touch button interactions. The cloud QA browser did not provide WebGL; the GPU rendering path and real-device mobile performance require device validation.

## Scope

This is a lightweight browser racing simulation with stylized procedural 3D art, not a full tyre/suspension simulator. Car models and audio are original. AI is local; collisions use track-space bounds. There are no car brand licenses or borrowed film/anime music. Fullscreen/orientation support depends on the browser. The Canvas fallback trades detail and frame rate for compatibility and may run more slowly on weak devices.

## GitHub Pages publication

Public game: https://bd-cs1.github.io/touge-overdrive/

Repository visibility is public. Pages uses **GitHub Actions** as its source. `.github/workflows/static.yml` runs on pushes to `main` and can also be started manually. It runs `npm run check` and `npm test`, then uploads **only `dist/`** and deploys it to the `github-pages` environment. Changes to the source on `main` are automatically checked and published. Check Settings → Pages or the Actions run for deployment status. GitHub service incidents can delay queued workflows or status updates.

The root `index.html` is a convenience redirect for serving the repository locally; production serves `dist/index.html` directly from the uploaded artifact. Keep the relative paths in `dist/` so that the game works under the GitHub project subpath.
