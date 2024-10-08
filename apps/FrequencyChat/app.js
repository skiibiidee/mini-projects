module.exports = ({app, io})=>{
  const path = require('path')
  const clients = {};
const fs = require('fs')
  app.get("/frequencychat",(req,res)=>{
    res.sendFile(path.join(__dirname,"index.html"))
  })

  app.get("/frequencychat/script.js",(req,res)=>{
    res.sendFile(path.join(__dirname,"script.js"))
  })

  app.get("/frequencychat/style.css",(req,res)=>{
    res.sendFile(path.join(__dirname,"style.css"))
  })

  io.of('/frequencychat').on("connection", (socket) => {
    clients[socket.id] = 50;
    socket.on("disconnect", () => {
      if (clients[socket.id]) delete clients[socket.id];
    });

    socket.on("change_frequency", (frequency) => {
      if(frequency){
        if(!isNaN(Number(frequency))){
          if(frequency<=400&&frequency>=50){
            clients[socket.id] = frequency;
            return
          }
        }
      }
      //error
    });

    socket.on("chat_message", (data) => {
      handleMessage(data.msg.slice(0, 1000), clients[socket.id]);
    });

  });

  function encodeText(text, strength) {
    if(strength==0)
    {
      return text
    }
    const buffer = Buffer.from(text, "utf-8");
    const resultBuffer = Buffer.alloc(buffer.length);

    for (let i = 0; i < buffer.length; i++) {
      resultBuffer[i] = buffer[i];
    }

    const strengthperc = Math.min(strength / 25,1);
    const bytestomessperc = Math.min(1,Math.sqrt(strengthperc)+((1/8)-Math.random()/4));
    const bitsstomess = Math.floor(bytestomessperc * buffer.length*8);

    for (let i = 0; i < bitsstomess; i++) {
      const randomindex = Math.floor(Math.random() * buffer.length);
      let byte = buffer[randomindex];

      const bitPosition = Math.floor(Math.random() * 8);
      byte ^= 1 << bitPosition;

      resultBuffer[randomindex] = byte;
    }

    return resultBuffer.toString("utf-8");
  }

  function handleMessage(message, frequency) {

    for (const id in clients) {
      const clientFrequency = clients[id];
      const diff = Math.abs(frequency - clientFrequency);
      const encodedtext = encodeText(message, diff);
      sendMessage(encodedtext, id, diff > 0);
    }
  }

  function sendMessage(message, id, noisy) {
    if (noisy) {
      return io.of('/frequencychat').to(id).emit("chat_message_noisy", message);
    }
    io.of('/frequencychat').to(id).emit("chat_message", message);
    }
}