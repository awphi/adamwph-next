# What is quickplay?

QuickPlay is a skeleton project that I used to teach myself real-time client-server networking for games. Particularly, using predictive clients instead of relying on lockstep updates that can feel sluggish in fast-paced games.

It's a simple pong game that implements physics synchronisation with an authoritative server, from-scratch in Kotlin using <a href="https://libgdx.com/" target="_blank" rel="noreferrer">LibGDX</a>. The design of the networking was based on that of Valve's <a href="https://developer.valvesoftware.com/wiki/Source_Multiplayer_Networking" target="_blank" rel="noreferrer">Source engine</a>.
