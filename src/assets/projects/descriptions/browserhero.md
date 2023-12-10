# What is browserhero?

BrowserHero is a port of the popular game <a href="https://clonehero.net/" target="_blank" rel="noreferrer">CloneHero</a> for the web. It is based on SvelteKit and features a high performance renderer for gameplay elements. It served as an oppurunity to work with old and otherwise poorly-documented file formats.

Unlike other GuitarHero-like games BrowserHero requires no downloading or visitation to external providers. Simply load the page, pick any song you can think of (we support searching <a href="https://chorus.fightthe.pw/" target="_blank" rel="noreferrer">Chorus</a>!) and start playing.

The backend is a hybrid of Vercel for the hosting the webapp and GCP for hosting the cached, processed song archives. It was a fun challenge to get these to play nicely together and avoid hitting Google Drive's rate limits! A song will only be downloaded from an external provider the first time any user runs it, after that we serve a cached, pre-processed version. This means eventually our servers will eventually store a BrowerHero-compatible version of every song available on Chorus.
