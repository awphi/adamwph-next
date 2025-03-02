# What is esp32-cambridge-transit?

`esp32-cambridge-transit` is a small project that powers a transit dashboard I have on my desk to see the next handful of trains and buses departing near me.

The project is composed of a few small packages:

- `/micro` - ESP32-compatible Arduino code for the microcontroller connected to an e-ink display
- `/api` - Small FastAPI-based aggregation API to provide a single, well-formatted endpoint for the ESP32 to fetch from for relevant data
