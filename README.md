<h1 align="center">🌌 WHAT IF — AI Scenario Consequence Simulator</h1>

<p align="center">
  <em>A futuristic glass-UI web application that predicts the consequences of any “What If…” scenario using AI.</em>
</p>

<p align="center">
  <strong>React • Vite • TypeScript • Tailwind • Shadcn • Three.js • Gemini / Claude</strong>
</p>

<br/>

<!-- Badges -->
<p align="center">
  <img src="https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Vite-Fast-purple?style=for-the-badge&logo=vite" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-blue?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/TailwindCSS-Glass_UI-38bdf8?style=for-the-badge&logo=tailwindcss" />
  <img src="https://img.shields.io/badge/3D-Three.js-black?style=for-the-badge&logo=three.js" />
  <img src="https://img.shields.io/badge/AI-Gemini/Claude-orange?style=for-the-badge&logo=google" />
</p>

<br/>

---

# ✨ Overview

**WHAT IF** is an intelligent scenario simulator.  
You type any hypothetical situation — and the app instantly returns:

✅ Realistic consequences  
✅ Risk levels & impact  
✅ Mitigation advice  
✅ Safer alternatives  
✅ Confidence score  
✅ Timeframe (short/mid/long term)  

All presented inside a **glassmorphism UI** with a **subtle animated 3D background**.

<br/>

---

# 🧠 Features

### ✅ AI-Powered “What If” Generator  
Uses Gemini or Claude to create structured JSON with:

- summary  
- overall risk  
- confidence  
- timeframe  
- consequences (with likelihood, impact, mitigation)  
- alternatives  
- disclaimer  

### ✅ Glassmorphism User Interface  
- Frosted translucent panels  
- Soft shadows  
- Smooth gradients  
- Fully responsive layout  

### ✅ Lightweight 3D Background (Three.js)
- Low-poly animated shape  
- Subtle, minimal, non-distracting  
- Extremely low GPU load 

<br/>

---

# 🛠 Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 18** | UI Framework |
| **Vite** | Lightning-fast dev environment |
| **TypeScript** | Strict typing |
| **Tailwind CSS** | Styling |
| **shadcn-ui** | Reusable UI components |
| **React Three Fiber + Drei** | 3D rendering |
| **Gemini / Claude** | AI consequence generation |

<br/>

---

# 📦 Installation

```bash
git clone (https://github.com/prathamesh-uttam-patil/whatIf.git)
cd <whatIf>
npm install
npm run dev

App runs at:
http://localhost:5173


🔧 Environment Setup
Create .env:
VITE_GEMINI_API_KEY=😒😒


🧪 API Usage
Endpoint

POST /api/whatif

Request Example
{
  "query": "What if I move abroad?",
  "tone": "balanced",
  "scope": "personal"
}


📁 Project Structure
src/
  components/
  pages/
  App.tsx
  main.tsx
public/
vite.config.ts
tailwind.config.cjs
README.md


🚀 Roadmap
 Save & view past scenarios
 Compare two “what-if” paths side-by-side
 Export result sets as PDF
 Shareable scenario links
 Native mobile app version


🤝 Contributing
Contributions, suggestions, and PRs are welcome!


📄 License
MIT © Prathamesh Patil


⭐ Support
If you like this project, consider giving it a star ⭐ on GitHub.
