
const socket = io('/frequencychat');
const frequencyInput = document.getElementById("frequencyInput");

const form = document.getElementById("chat-form");
const input = document.getElementById("messageInput");
const messages = document.getElementById("messages");
const rawcb = document.getElementById("rawcb");
const maxfreq = 400
const minfreq = 50
frequencyInput.addEventListener("change", (e) => {
  if (
    Math.floor(frequencyInput.value) > maxfreq ||
    Math.floor(frequencyInput.value) < minfreq
  ) {
    frequencyInput.value = Math.max(
      minfreq,
      Math.min(Math.floor(frequencyInput.value), maxfreq)
    );
  } else {
    if (frequencyInput % 1 != 0) {
      frequencyInput.value = Math.floor(frequencyInput.value);
    }
  }
  console.log(frequencyInput.value);
  socket.emit("change_frequency", frequencyInput.value);
});
form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (input.value) {
    socket.emit("chat_message", {
      msg: input.value,
    });
    input.value = "";
  }
});

socket.on("chat_message", function (msg) {
  const item = document.createElement("li");
  item.textContent = msg;
  item.classList.add("message")
  messages.appendChild(item);
  item.scrollIntoView(true);
});

socket.on("chat_message_noisy", (msg) => {
  if (rawcb.checked) {
    const item = document.createElement("li");
    item.textContent = msg;
    item.classList.add("message-noisy")
    messages.appendChild(item);
    item.scrollIntoView(true);
  }
});
frequencyInput.value = 50
