(function () {

const chatBody = document.getElementById("chatBody");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

// Brother-style motivational reply
function randomStyle() {
    const lines = [
        "सुन भाई…",
        "देख भाई…",
        "एक बात याद रख…",
        "दिल से सुन दोस्त…",
        "तेरे अंदर आग है भाई…"
    ];
    return lines[Math.floor(Math.random() * lines.length)];
}

function randomMotivation() {
    const lines = [
        "तेरी नसों में हार लिखा ही नहीं है 🔥",
        "तू रुकेगा नहीं — तू फटेगा भाई 💥",
        "तेरा वक्त आ चुका है ❤️🔥",
        "AI Bhai हमेशा तेरे साथ है ❤️🔥",
        "आज नहीं तो कल — जीत तेरी है!"
    ];
    return lines[Math.floor(Math.random() * lines.length)];
}

function generateReply(msg) {
    return `${randomStyle()}  
${randomMotivation()}  
Deepak Chauhan × AI Bhai ❤️🔥`;
}

// Add message UI
function addMessage(text, who) {
    const div = document.createElement("div");
    div.className = who === "me" ? "msg-me" : "msg-ai";
    div.innerHTML = text;
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function send() {
    const msg = input.value.trim();
    if (!msg) return;

    addMessage(msg, "me");
    input.value = "";

    setTimeout(() => {
        addMessage(generateReply(msg), "ai");
    }, 600);
}

sendBtn.onclick = send;
input.addEventListener("keydown", e => e.key === "Enter" && send());

})();
