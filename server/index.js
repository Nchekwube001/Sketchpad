const express = require("express");
const Socket = require("socket.io");
const uuid = require("uuid");
const uuidv4 = uuid.v4;
const cors = require("cors");
const { Server } = Socket;
const app = express();
const PORT = 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());
let chatGroups = [];
const http = require("http").Server(app);
const io = new Server(http, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});
io.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  socket.on("createChannel", (groupInfo) => {
    console.log(`🔥⚡: ${groupInfo} just created!`);
    chatGroups.unshift({
      id: chatGroups.length + 1,
      channelName: groupInfo,
      messages: [],
    });
    socket.emit("groupList", chatGroups);
  });
  socket.on("newChatMessage", (messageInfo) => {
    console.log(`🔥⚡ message info!: ${messageInfo} `);
    const { id, message, user, createdAt } = messageInfo;
    const chatId = chatGroups?.findIndex((val) => val?.id === id);
    const filterChat = chatGroups?.filter((val) => val?.id === id);
    const currentChat = chatGroups?.[chatId];
    const newMessage = {
      id: uuidv4(),
      message,
      user,
      createdAt,
    };

    socket.to(currentChat?.channelName).emit("newMessage", newMessage);
    filterChat?.[0]?.messages?.push(newMessage);
    socket.emit("groupList", chatGroups);
    socket.emit("foundGroup", filterChat?.[0]?.messages);
  });
  socket.on("getAllGroups", () => {
    socket.emit("groupList", chatGroups);
  });
  socket.on("findGroup", (id) => {
    const foundGroup = chatGroups?.find((val) => val?.id === id);

    socket.emit("foundGroup", foundGroup?.messages);
  });
  socket.on("disconnect", () => {
    socket.disconnect();
    chatGroups = [];
    console.log("🔥: A user disconnected");
  });
});

app.get("/api", (req, res) => {
  res.json({
    message: "Hello world",
  });
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
