# 📡 5G NR Conformance Explorer — TS 38.101 Interactive Guide

**🔗 Live Demo: [https://jacobs-ting.github.io/5G-NR-Conformance-Test/](https://jacobs-ting.github.io/5G-NR-Conformance-Test/)**

> Understand 5G NR RF conformance requirements without expensive test equipment.

An interactive web-based tool that visualizes key TS 38.101 conformance test cases. Unlike static spec documents, this tool bridges the gap between 3GPP requirements and real-world circuit design. Users can adjust hardware parameters such as PA/LNA P1dB compression points and directly observe how component non-linearity impacts conformance test results.

Built for RF & hardware engineers who want to understand not just what the spec says, but **why it matters on the bench**.

---

## 🧪 Covered Test Cases (TS 38.101)

| Section | Test Item | What You Can Explore |
|---|---|---|
| 6.2 | Max Tx Output Power | UE Power Class by band (PC1/PC2/PC3) |
| 6.3.4 | Power Control | TPC step response in FDD/TDD, time domain Tx power |
| 6.4.2 | Error Vector Magnitude (EVM) | Constellation diagram vs SNR, regulatory limits by modulation |
| 6.4.2.3 | In-band Emission | LO leakage & IQ image limits, dynamic spectrum visualization |
| 6.5.2.2 | Spectrum Emission Mask (SEM) | Mask limits by channel bandwidth |
| 6.5.2.4 | ACLR | PA P1dB effect on spectral regrowth, Pass/Fail verdict |
| 7.3 | Reference Sensitivity | 2×2 / 4×4 MIMO sensitivity estimation by band & SCS |
| 7.4 | Maximum Input Level | LNA saturation effect on constellation & throughput |

---

## ⚡ Key Features

- **No test equipment needed** — Visualize conformance test behavior without R&S or Keysight instruments
- **Hardware-aware simulation** — Adjust PA/LNA P1dB compression points and observe real non-linearity effects on test results
- **Dynamic Pass/Fail verdict** — See compliance status update in real time as you change parameters
- **Spec + Circuit co-simulation** — Understand *why* each spec limit exists, not just the number
- **Pure front-end** — No installation required, runs entirely in the browser (HTML + CSS + JS)

---

## 🎯 Who Is This For

- RF engineers new to 5G NR conformance testing
- Hardware engineers preparing for lab bring-up or certification
- Wireless engineers who find 3GPP specs unreadable
- Students learning 5G PHY layer and RF system design

---

## 🛠️ Tech Stack

- Pure HTML + CSS + JavaScript
- No framework dependencies
- Deployable as a static site (GitHub Pages)

---

## 📖 Background

This tool was built by a 20-year RF engineer with hands-on experience in 5G NR product development and RF conformance testing. The simulated waveforms and spectral plots have been validated against real bench measurements (R&S CMW270), ensuring the models reflect realistic hardware behavior — not just theoretical approximations.

---

## 🚀 Related Projects

- **38.211 / 38.213 / 38.306 Interactive Guide** — TDD grid, slot configuration, and UE throughput calculator
- **mmWave Link Budget Simulator** — 64-element phased array simulation with 3D radiation pattern
- **SI Studio** — High-speed channel assessment with PAM4 eye diagram and TX FFE equalization

---

*Designed for RF & Hardware Engineers.*
