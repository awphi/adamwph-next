# What is micro-memfs?

`micro-memfs` is a tiny, niche library created for this site. I wanted the `Terminal` app on this site to emulate a real command line as accurately as possible so I started looking for a browser-compatible in-memory file system. They do exist (shoutout <a href="https://www.npmjs.com/package/memfs" target="_blank" rel="noreferrer">memfs</a>) but are very bulky or require annoying polyfills to work on browsers.

Thus I built something to fit my needs - a tiny, simple but powerful in-memory `fs` emulator. It's available on npm <a href="https://www.npmjs.com/package/micro-memfs" target="_blank" rel="noreferrer">here</a> if you're interested in having a look.
