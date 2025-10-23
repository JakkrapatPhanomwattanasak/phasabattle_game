window.VOCAB_QUESTIONS = [
  {
    prompt: "คำว่า 'benefit' ใกล้เคียงกับความหมายใด?",
    choices: [
      {
        text: "advantage",
        correct: true,
        explain: "คำตอบถูกต้อง — benefit = สิ่งที่เป็นประโยชน์ หรือ advantage"
      },
      {
        text: "problem",
        correct: false,
        explain: "❌ ผิด — problem = ปัญหา ไม่ใช่สิ่งที่เป็นประโยชน์"
      },
      {
        text: "excuse",
        correct: false,
        explain: "❌ ผิด — excuse = ข้ออ้าง ไม่เกี่ยวกับประโยชน์"
      }
    ],
    reward: { correct: 18, wrong: 6 }
  },

  {
    prompt: "เลือกคำที่ตรงกับบริบท: ____ transportation (ขนส่งสาธารณะ)",
    choices: [
      {
        text: "public",
        correct: true,
        explain: "คำตอบถูกต้อง — public transportation หมายถึง ระบบขนส่งที่คนทั่วไปใช้ร่วมกัน เช่น รถเมล์ รถไฟ ฯลฯ"
      },
      {
        text: "popular",
        correct: false,
        explain: "❌ ผิด — popular แปลว่า เป็นที่นิยม ไม่ใช่ สาธารณะ"
      },
      {
        text: "publish",
        correct: false,
        explain: "❌ ผิด — publish แปลว่า ตีพิมพ์ หรือ เผยแพร่ ไม่เกี่ยวกับการขนส่ง"
      }
    ],
    reward: { correct: 18, wrong: 6 }
  }
];
