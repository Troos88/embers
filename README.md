# Ember

A small shared world for one family. Light a fire, feed it, meet Maren, plant a seed, come back tomorrow.

Every phone keeps the whole world. Phones that open the same family link
(`?f=<code>`) find each other directly (WebRTC via PeerJS) and sync their fires
while both are open. Nothing is stored on a server and no accounts are needed.

- `index.html` — the whole game
- `peerjs.min.js` — PeerJS 1.5.4, self-hosted
- `test/sync.mjs` — two-phone sync test (needs a local `peerjs` server on :9000 and a static server on :8080)

## Cozy Homes (`/cozy/`)

The house-building game set at the real home in Högsved, live at
https://troos88.github.io/embers/cozy/. Friends join by opening the link from
"Play with friends" (`?f=<room>`); phones connect directly through PeerJS, the
same way Ember does. Each phone keeps the world, and the newest change wins.
Built from the Cozy Homes sources into a single `cozy/index.html`; it reuses
`../peerjs.min.js`.
