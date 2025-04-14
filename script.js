const pseudo = localStorage.getItem("pseudo") || "Anonyme";
document.getElementById("username").textContent = pseudo;

const form = document.getElementById("chat-form");
const input = document.getElementById("message-input");
const chatBox = document.getElementById("chat-box");

// Fonction pour créer une bulle
function createMessageElement(sender, text) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.classList.add(sender === "bot" ? "bot" : "user");
  const emoji = localStorage.getItem("emoji") || "👤";
  div.textContent = sender === "bot" ? `🤖 Bot: ${text}` : `${emoji} ${pseudo}: ${text}`;  
  return div;
}

// Charger les anciens messages au démarrage
function loadMessages() {
  const messages = JSON.parse(localStorage.getItem("messages") || "[]");
  messages.forEach(({ sender, text }) => {
    const messageDiv = createMessageElement(sender, text);
    chatBox.appendChild(messageDiv);
  });
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Sauvegarder un message
function saveMessage(sender, text) {
  const messages = JSON.parse(localStorage.getItem("messages") || "[]");
  messages.push({ sender, text });
  localStorage.setItem("messages", JSON.stringify(messages));
}

// Gestion de l'envoi
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const msg = input.value.trim();
  if (msg !== "") {
    // Message utilisateur
    const userMsg = createMessageElement("user", msg);
    chatBox.appendChild(userMsg);
    saveMessage("user", msg);
    input.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;

    // Appel au serveur pour obtenir une réponse GPT
fetch("/api/gpt", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ message: msg })
})
  .then(response => response.json())
  .then(data => {
    const reply = data.reply;
    const botMsg = createMessageElement("bot", reply);
    chatBox.appendChild(botMsg);
    saveMessage("bot", reply);
    chatBox.scrollTop = chatBox.scrollHeight;
  })

  }
});

// Charger les messages au démarrage
loadMessages();
