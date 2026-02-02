const chat = document.getElementById("chat");
const input = document.getElementById("userInput");
const typingIndicator = document.getElementById("typingIndicator");
const sendBtn = document.getElementById("sendBtn");

// Backend API endpoint
const API_ENDPOINT = "http://localhost:5000/chat";

// Chat memory (keep last 50 messages)
let memory = [];

sendBtn.addEventListener("click", ()=>sendMessage());
input.addEventListener("keypress", e=>{
  if(e.key==="Enter") sendMessage();
});

async function sendMessage(){
  const userMessage = input.value.trim();
  if(!userMessage) return;

  addMessage(userMessage,"user");
  memory.push({role:"user", content:userMessage});
  if(memory.length>50) memory.shift();

  input.value="";
  typingIndicator.style.display = "block";

  try{
    const response = await fetch(API_ENDPOINT,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({prompt:userMessage})
    });

    const data = await response.json();
    const botReply = data.text || "AI did not respond.";
    memory.push({role:"assistant", content:botReply});
    await simulateTyping(botReply);

  }catch(err){
    console.error(err);
    await simulateTyping("Error: Cannot reach AI server 😢");
  }
}

function addMessage(msg,sender){
  const div = document.createElement("div");
  div.classList.add("message", sender);
  div.innerText = msg;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

async function simulateTyping(reply){
  const botDiv = document.createElement("div");
  botDiv.classList.add("message","bot");
  chat.appendChild(botDiv);

  for(let i=0;i<reply.length;i++){
    botDiv.innerText += reply.charAt(i);
    chat.scrollTop = chat.scrollHeight;
    await new Promise(r=>setTimeout(r,10));
  }

  typingIndicator.style.display="none";
  chat.scrollTop = chat.scrollHeight;
}
