const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const lightToggler = document.querySelector('#theme-btn')


let userText = null;
const API_KEY = "AIzaSyDDuFUzuJ4xkVRiAuEqzKtlOsPOsZTxmT4"
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`

lightToggler.addEventListener('click', () => {
  document.body.classList.toggle('light-mode')
  lightToggler.innerHTML = document.body.classList.contains('light-mode') ? 'dark_mode' : 'light_mode'
})

const createElement = (html, ...classes) => {
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", ...classes);
    chatDiv.innerHTML = html;
    return chatDiv; 
}

const handleOutgoingChat = () => {
    userText = chatInput.value.trim(); 
    const html = `<div class="chat-content">
                            <div class="chat-details">
                              <img src="images/download.png" alt="download">
                              <p class="text"></p>
                            </div>
                          </div>`;
            
  const outgoingChatDiv = createElement(html, "outgoing");
  outgoingChatDiv.querySelector('.text').innerText = userText
  chatContainer.appendChild(outgoingChatDiv);

  chatInput.value = '';
  setTimeout(showLoadingAnime, 500)
}

const showLoadingAnime = () => {
  const html = `          
        <div class="chat-content">
          <div class="chat-details">
            <img src="images/user.png" alt="download">
            <p class="text"></p>
            <div class="typing-animation">
              <div class="typing-dot" style="--delay: 0.2s"></div>
              <div class="typing-dot" style="--delay: 0.3s"></div>
              <div class="typing-dot" style="--delay: 0.4s"></div>
            </div>
          </div>
          <span class="material-symbols-outlined">content_copy</span>
        </div>  `;

        
const incomingMessageDiv = createElement(html, "incoming", "loading");
chatContainer.appendChild(incomingMessageDiv);

generateAPIResponse(incomingMessageDiv)
}

const generateAPIResponse = async (incomingMessageDiv) => {
  const textElement = incomingMessageDiv.querySelector(".text")


  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [{text: userText}]
        }]
      })
    }); 
    const data = await response.json();
    
    const apiResponse = data?.candidates[0].content.parts[0].text;
    textElement.innerText = apiResponse

  } catch (error) {
    console.log(error)
  } finally {
    incomingMessageDiv.classList.remove('loading');
  }
  
}


sendButton.addEventListener("click", handleOutgoingChat); 


