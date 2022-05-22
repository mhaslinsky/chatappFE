import { io } from "socket.io-client";
export const socketMain = io(`http://localhost:4000`);
// export const socketWarcraft = io(`http://localhost:4000/warcraft`);
// export const socketMemes = io(`http://localhost:4000/memes`);
// export const socketPolitics = io(`http://localhost:4000/politics`);
