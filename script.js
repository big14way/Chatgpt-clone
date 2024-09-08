const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");


let userText = null;

const createElement = (html, className) => {
    //create new div and apply chat, specified class and set html content of div
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = html;
    return chatDiv; //Return the created chat div
}

const handleOutgoingChat = () => {
    userText = chatInput.value.trim(); //get chatInput value and remove extra spaces
    const html = `<div class="chat-content">
                   <div class="chat-details">
                     <img src="images/download.png" alt="download">
                    <p>${userText}</p>
                  </div>
                </div>`;
   //create an outgoing chat div with user's message and append it to chat container             
  const outgoingChatDiv = createElement(html, "outgoing");
  chatContainer.appendChild(outgoingChatDiv);
}

sendButton.addEventListener("click", handleOutgoingChat); 