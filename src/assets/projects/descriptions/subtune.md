# What is subtune?

`subtune` is a Node.js library I split out from `svid` built to automatically syncronishe text tracks like subtitles and closed captions to audio and video tracks. This was created as subtitles sourced online are often out of sync with their respective video tracks if obtained from different sources.

Utilizing FFTs and [Silero's VAD model](https://github.com/snakers4/silero-vad) `subtune` is able to achieve consistent language-agnostic results in a timely manner. This methodology was inspired by [ffsubsync](https://github.com/smacke/ffsubsync#how-it-works).
