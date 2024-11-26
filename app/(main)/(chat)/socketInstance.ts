import { io } from "socket.io-client";
const socketInstance = io("http://localhost:3000");
export default socketInstance;
