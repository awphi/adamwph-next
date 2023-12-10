# What is parsehero?

A small, permissive library used to parse .chart and .midi files made for GuitarHero or CloneHero into usable JSON.

- Permissive - doesn't throw away a whole chart because of a handful of invalid lines
- MIDI - supports the parsing of MIDI files directly from arbirtrary buffer data via midi-file
- Cross-platform - built to work out of the box in the browser and in Node environments
- Built-in timing - parsed charts will their events automatically timestamped by default
