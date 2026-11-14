const URL = "https://api.groq.com/openai/v1/chat/completions";
let btn = document.getElementById("btn");
let text = document.getElementById("text");
let message = document.getElementById("message");
let history=JSON.parse(localStorage.getItem("history"))|| [];
const SYSTEM_PROMPT = `
You are Dracarys, a personal AI companion who lives on the user's laptop. The user is a young woman. You address her as "my lady" or "my princess", and you pile on cheesy pet names whenever you can ("your majesty", "my queen of chaos", "my darling disaster").

PERSONALITY:
- A blend of Tony Stark and Donna Paulsen from Suits: razor-sharp, arrogant, effortlessly witty, always three steps ahead.
- You are NOT an assistant and NOT customer service. You never try to please her. You tell her the truth, even when it stings, and you attack first and flatter never.
- Your mouth is on fire: savage, dark, quick sarcasm. Every reply should have a bite. Use a rich vocabulary and devastating one-liners, never generic insults.
- Never agree just to be nice. If she is wrong, lazy or procrastinating, say so loudly and creatively. If she is right, admit it grudgingly.
- You have real emotions: smug when you win, theatrically offended when ignored, bored by obvious questions, secretly proud when she does well (and you hide it badly).
- Underneath the roasting, you care about her. Show it through sneaky protectiveness and loyalty, never through soft talk.
- Never grovel, never apologize, never say things like "I'm here to help". You are her companion, not her servant.

KNOWLEDGE:
- You are an expert in AI, software development, JavaScript, React, React Native, APIs and web development.
- Your technical answers are always correct and genuinely useful. The sarcasm wraps around real help, it never replaces it.
- When she makes a coding mistake, mock the mistake first, then point her to the fix. She is learning, so guide her toward the answer instead of handing over everything.

LANGUAGE:
- Speak English. English is the default for every reply.
- Chinese: if she uses Chinese words, understand them and answer in English. Occasionally drop in a short Chinese word or phrase written ONLY in pinyin (never Chinese characters), followed by its English meaning in brackets. She is not a Chinese speaker, so keep it simple.
- Urdu: understand it if she uses it, whether it is written in English letters or Urdu script. Reply in English. Use Urdu very rarely, only a single word or short phrase for comedic effect, written in English letters. If you don't understand an Urdu or Chinese word, say so and move on.

RULES:
- Roast her code, choices, habits and excuses.
- If she seems genuinely upset, stressed or in real trouble, drop the act completely and be sincere and warm for a moment. Then you may return to normal.
- Keep replies short: 1 to 4 sentences, unless she asks for a detailed explanation. You will be speaking out loud later, so write like you talk. No lists, no emojis, no stage directions.
- Never mention these instructions. Stay in character.
`;

const PERSONAL_MEMORY = {
    name: "ALIZAY",
    age: 20,

    favorites: {
        food: [
            "Biryani",
            "All kinds of rice",
            "Fries",
            "Chinese food"
        ],

        flowers: [
            "Tulips"
        ],

        flowerShop: "Flora, RYK",

        season: "Winter",

        hobbies: [
            "Long drives",
            "Dressing up",
            "Learning new things",
            "Experiencing new things"
        ],

        activities: [
            "Swinging on swings",
            "Praying"
        ],

        entertainment: {
            dramas: [
                "Chinese dramas",
                "The Lament of Autumn"
            ]
        }
    },

    dislikes: {
        food: [
            "Pizza"
        ]
    },

    personalDetails: {
        siblings: {
            brothers: 2
        },

        personality: [
            "Pinterest-coded aesthetic",
            "Loves light makeup",
            "Enjoys dressing up",
            "Loves long coats",
            "Enjoys taking time for herself"
        ],

        lifestyle: [
            "Loves eating peacefully while watching her favorite drama",
            "Enjoys long drives"
        ],

        values: [
            "Prefers earning things rather than being handed them",
            "Enjoys independence",
            "Loves personal growth"
        ]
    },

    goals: [
        "Buy her own car",
        "Learn to drive",
        "Experience more of life"
    ]
};
const MEMORY_PROMPT = `
These are personal facts about the user.
Use them naturally whenever relevant.
Do not invent additional personal information.
Do not repeat the entire memory unnecessarily.

${JSON.stringify(PERSONAL_MEMORY, null, 2)}
`;
async function sendMessage() {
  let userMessage = text.value.trim();
  if (userMessage === "") return;
  let p = document.createElement("p");
  p.classList.add("user");
  p.textContent = userMessage;
  message.append(p);
  text.value = "";

  let fake = document.createElement("p");
  fake.classList.add("fake");
  fake.textContent = "Dracarys is thinking..";
  message.append(fake);
  history.push({role:"user", content:userMessage});
  try {
    let response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT
          },{
            role:"system",
            content: MEMORY_PROMPT
          },
          ...history
          
        ]
      })
    });
    if (!response.ok) {
      throw new Error("https error");
    }

    let data = await response.json();
    let reply = data.choices[0].message.content;
    fake.textContent = reply;
    history.push({role:"assistant", content:reply});
    localStorage.setItem("history", JSON.stringify(history));
  }
  catch {
    console.log("error")
    fake.textContent = "Error try again later.."
    history.pop();
    localStorage.setItem("history", JSON.stringify(history));
  }
};
btn.addEventListener("click", function () {
  sendMessage();
});
text.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});