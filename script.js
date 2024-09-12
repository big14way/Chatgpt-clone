const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const lightToggler = document.querySelector('#theme-btn')
const deleteButton = document.querySelector('#delete-btn');



let userText = null;
const API_KEY = "AIzaSyDDuFUzuJ4xkVRiAuEqzKtlOsPOsZTxmT4"
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`

const loadLocalStorageData = () => {
  const lightMode = (localStorage.getItem('themeColor') === 'light_mode');
  const savedChats = localStorage.getItem('savedChats')

  document.body.classList.toggle('light-mode', lightMode);
  lightToggler.innerText = lightMode ? 'dark_mode' : 'light_mode'

  chatContainer.innerHTML = savedChats || "";

}
loadLocalStorageData()



lightToggler.addEventListener('click', () => {
  document.body.classList.toggle('light-mode')

  localStorage.setItem('themeColor', document.body.classList.contains('light-mode') ? 'light_mode' : 'dark_mode')

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


const copyMessage = (copyIcon) => {
  try {
    const messageText = copyIcon.closest('.chat-content').querySelector('.text').innerText;

    navigator.clipboard.writeText(messageText).then(() => {
      showNotification('Copied to clipboard!', copyIcon); 

      setTimeout(() => copyIcon.innerText = 'content_copy', 1000);
    }).catch(err => {
      console.error('Error copying text: ', err);
      showNotification('Failed to copy text.', copyIcon);
    });
  } catch (err) {
    console.error('Error in copyMessage function: ', err);
  }
};

const showNotification = (message, copyIcon) => {
  const notification = document.createElement('div');
  notification.innerText = message;
  notification.classList.add('copy-notification');

  const iconRect = copyIcon.getBoundingClientRect();
  notification.style.position = 'absolute';
  notification.style.left = `${iconRect.left}px`;
  notification.style.top = `${iconRect.top - 30}px`; 

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 1000);
};



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
          <span class="copied material-symbols-outlined" onclick="copyMessage(this) ">content_copy</span>
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
    
    const apiResponse = data?.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*/g, '$1');
    // textElement.innerText = apiResponse



    showTypingEffect(apiResponse, textElement, incomingMessageDiv)

  } catch (error) {
    console.log(error)
  } finally {
    incomingMessageDiv.classList.remove('loading');
  }
  
}

const showTypingEffect = (text, textElement, incomingMessageDiv) => {
  const words = text.split(' ')
  let currentWordIndex = 0;

  const typingInterval = setInterval(() => {
    textElement.innerText += (currentWordIndex === 0 ? '' : ' ') + words[currentWordIndex++];
    // incomingMessageDiv.querySelector('.icon') .classList.add('hide')


    if (currentWordIndex === words.length) {
      clearInterval(typingInterval)
      // incomingMessageDiv.querySelector('.icon') .classList.remove('hide')
      localStorage.setItem('savedChats', chatContainer.innerHTML)
    }
  }, 75);
}

deleteButton.addEventListener("click", () => {
  //Remove the chats from local storage and call ladDataFromlocalsyorage function
  if(confirm("Are you sure you wwant to delete all the chats?")) {
    localStorage.removeItem("savedChats");
    loadLocalStorageData();
  }
})
// loadLocalStorageData

sendButton.addEventListener("click", handleOutgoingChat); 


