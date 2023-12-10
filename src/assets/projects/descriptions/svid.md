# What is sVid?

sVid is a desktop media player specifically designed around the use of subtitle tracks. Most media players support subtitles but no mainstream ones (as far as I'm aware) make it easy to syncronished badly timed subtitle tracks to audio. Furthermore, many will only support one format of subtitles (usually `.srt`) and sometimes will not display different text encodings properly out of the box.

sVid aims to support any subtitle format (`.srt`, `.ass`, `.vtt`), any OS and any text encoding straight out of the box. It also features a subtitle and audio visualization panel that allow you to drag or scroll subtitle to sync up with audio peaks, greatly reducing the time it takes to find the sweet spot with misaligned subtitles.

# Tech Stack

The app is built on <a href="https://www.electronjs.org/" target="_blank" rel="noreferrer">electron</a> with the front end written in svelte. It features a custom type-safe IPC layer to communicate with the main node process. The audio visualization relies of <a href="https://ffmpeg.org/" target="_blank" rel="noreferrer">ffmpeg</a> and <a href="https://github.com/bbc/audiowaveform" target="_blank" rel="noreferrer">audiowaveform</a> which come pre-packaged as binaries with sVid for performance.

Utilizing electron gives us cross-machine portability, lets us the best UI framework ever created, automatic text encoding detection, subtitle/video rendering out of the box, and still allows the use of performant binaries written in C.
