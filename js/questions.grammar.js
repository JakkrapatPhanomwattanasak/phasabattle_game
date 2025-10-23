window.GRAMMAR_QUESTIONS = [
  {
    prompt: "If I ____ enough time, I would learn Japanese.",
    choices: [
      {
        text: "have",
        correct: false,
        explain: "❌ ผิด — Second Conditional ใช้ past simple ใน if-clause (ไม่ใช่ have ปัจจุบัน)"
      },
      {
        text: "had",
        correct: true,
        explain: "คำตอบถูกต้อง — Second Conditional: If + past simple → would + V. → If I had enough time, I would learn Japanese."
      },
      {
        text: "will have",
        correct: false,
        explain: "❌ ผิด — ห้ามใช้ will ใน if-clause เพราะเป็นอนาคต"
      }
    ],
    reward: { correct: 25, wrong: 8 }
  },

  {
    prompt: "He has lived here ____ 2018.",
    choices: [
      {
        text: "for",
        correct: false,
        explain: "❌ ผิด — for ใช้กับ 'ระยะเวลา' เช่น for 3 years, ไม่ใช่กับจุดเวลา 2018"
      },
      {
        text: "since",
        correct: true,
        explain: "คำตอบถูกต้อง — since + จุดเวลา เช่น since 2018 → He has lived here since 2018."
      },
      {
        text: "from",
        correct: false,
        explain: "❌ ผิด — from ใช้กับ to/until เช่น from 2018 to 2020 ไม่ใช้เดี่ยว ๆ ใน Present Perfect"
      }
    ],
    reward: { correct: 20, wrong: 6 }
  },

  {
    prompt: "Choose the correct passive: People speak Thai in Thailand.",
    choices: [
      {
        text: "Thai is speaking in Thailand.",
        correct: false,
        explain: "❌ ผิด — is speaking = Present Continuous ไม่ใช่ Passive Voice"
      },
      {
        text: "Thai is spoken in Thailand.",
        correct: true,
        explain: "คำตอบถูกต้อง — Passive Voice = be + V3 → is spoken"
      },
      {
        text: "Thai was speaked in Thailand.",
        correct: false,
        explain: "❌ ผิด — กริยา speak รูป V3 คือ spoken ไม่ใช่ speaked"
      }
    ],
    reward: { correct: 25, wrong: 8 }
  }
];
