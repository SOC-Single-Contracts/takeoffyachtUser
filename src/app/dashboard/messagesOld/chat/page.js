//////////////////////////////////// ui ///////////////////////////////////////

// "use client";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Separator } from "@/components/ui/separator";
// import { Dot, Plus, Send } from "lucide-react";
// import React, { useState } from "react";

// const Messages = () => {
//   const [participants, setParticipants] = useState([
//     {
//       id: 1,
//       name: "Anderson Vanhron",
//       role: "Junior Developer",
//       avatar: "https://github.com/shadcn.png",
//     },
//     {
//       id: 2,
//       name: "David Lee",
//       role: "Senior Developer",
//       avatar: "https://github.com/david.png",
//     },
//     {
//       id: 3,
//       name: "Sara Smith",
//       role: "Project Manager",
//       avatar: "https://github.com/sara.png",
//     },
//     {
//       id: 4,
//       name: "Anderson Vanhron",
//       role: "Junior Developer",
//       avatar: "https://github.com/shadcn.png",
//     },
//     {
//       id: 5,
//       name: "David Lee",
//       role: "Senior Developer",
//       avatar: "https://github.com/david.png",
//     },
//     {
//       id: 6,
//       name: "Sara Smith",
//       role: "Project Manager",
//       avatar: "https://github.com/sara.png",
//     },
//   ]);

//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       senderId: 1,
//       text: "Can be verified on any platform using docker",
//     },
//     {
//       id: 2,
//       senderId: 2,
//       text: "Your error message says permission denied, npm global installs must be given root privileges.",
//     },
//     {
//       id: 3,
//       senderId: 1,
//       text: "Command was run with root privileges. I'm sure about that.",
//     },
//     {
//       id: 4,
//       senderId: 2,
//       text: "Any updates on this issue? I'm getting the same error when trying to install devtools. Thanks",
//     },
//     {
//       id: 5,
//       senderId: 1,
//       text: "Command was run with root privileges. I'm sure about that.",
//     },
//     {
//       id: 6,
//       senderId: 2,
//       text: "Any updates on this issue? I'm getting the same error when trying to install devtools. Thanks",
//     },
//   ]);

//   return (
//     <section className="lg:h-[calc(100vh-350px)] container mx-auto border-2 my-4 border-gray-200 rounded-2xl flex flex-col lg:flex-row">
//       {/* Aside for Participants */}
//       <aside className="w-full lg:w-1/4 border-b lg:border-r-2 border-gray-200 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
//         <div className="p-3">
//           <div className="flex items-center mb-2 justify-between">
//             <h2 className="text-xl font-bold">Messages</h2>
//             <div>
//               {/* More Options Icon */}
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 viewBox="0 0 24 24"
//                 width="24"
//                 height="24"
//                 className="h-6 w-6"
//               >
//                 <path
//                   fill="#263238"
//                   fillOpacity=".6"
//                   d="M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 15z"
//                 ></path>
//               </svg>
//             </div>
//           </div>
//           <div className="p-2 space-y-4">
//             <Input
//               type="search"
//               placeholder="Search"
//               className="py-2 px-2 border border-gray-200 rounded-lg outline-none focus:ring-0 w-full"
//             />
//             <Button
//               type="button"
//               className="w-full h-10 capitalize flex items-center justify-center rounded-lg text-white transition duration-500 ease-in-out bg-[#BEA355] shadow-none"
//             >
//               <Plus className="w-5 h-5 mr-2" />
//               Start a new chat
//             </Button>
//           </div>
//           <div className="space-y-2">
//             {participants.map((participant) => (
//               <div
//                 key={participant.id}
//                 className="flex items-center mb-2 border-b-2 border-gray-200 p-2 hover:bg-gray-100 transition-all duration-300 ease-in-out cursor-pointer hover:rounded-lg"
//               >
//                 <Avatar>
//                   <AvatarImage
//                     src={participant.avatar}
//                     alt={`@${participant.name}`}
//                   />
//                   <AvatarFallback>
//                     {participant.name
//                       .split(" ")
//                       .map((n) => n[0])
//                       .join("")}
//                   </AvatarFallback>
//                 </Avatar>
//                 <div className="ml-3">
//                   <p className="font-semibold">{participant.name}</p>
//                   <p className="text-sm text-gray-600">{participant.role}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </aside>

//       {/* Chat Section */}
//       <div className="flex-1 flex flex-col">
//         <div className="flex-1 flex flex-col p-2 sm:p-3 justify-between h-full">
//           {/* Chat Header */}
//           <div className="flex sm:items-center justify-between py-2 border-b-2 border-gray-200">
//             <div className="relative flex items-center space-x-4">
//               <div className="relative">
//                 <span className="absolute text-green-500 left-[-5px] z-10 top-[-5px]">
//                   <Dot className="w-20 h-20" />
//                 </span>
//                 <Avatar>
//                   <AvatarImage
//                     src="https://github.com/shadcn.png"
//                     alt="@shadcn"
//                   />
//                   <AvatarFallback>CN</AvatarFallback>
//                 </Avatar>
//               </div>
//               <div className="flex flex-col leading-tight">
//                 <div className="text-md mt-1 flex items-center">
//                   <span className="text-gray-700 mr-3">Anderson Vanhron</span>
//                 </div>
//                 <span className="text-sm text-gray-600">Junior Developer</span>
//               </div>
//             </div>
//             <div className="flex items-center space-x-2">
//               {/* Action Buttons */}
//               <Button
//                 type="button"
//                 className="inline-flex items-center justify-center rounded-lg h-8 w-8 transition duration-500 ease-in-out text-gray-500 bg-transparent shadow-none hover:bg-gray-100 focus:outline-none"
//               >
//                 {/* Search Icon */}
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                   className="h-5 w-5"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                   />
//                 </svg>
//               </Button>
//               <Button
//                 type="button"
//                 className="inline-flex items-center justify-center rounded-lg h-8 w-8 transition duration-500 ease-in-out text-gray-500 bg-transparent shadow-none hover:bg-gray-100 focus:outline-none"
//               >
//                 {/* Heart Icon */}
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                   className="h-5 w-5"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
//                   />
//                 </svg>
//               </Button>
//               <Button
//                 type="button"
//                 className="inline-flex items-center justify-center rounded-lg h-8 w-8 transition duration-500 ease-in-out text-gray-500 bg-transparent shadow-none hover:bg-gray-100 focus:outline-none"
//               >
//                 {/* More Options Icon */}
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                   className="h-5 w-5"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
//                   />
//                 </svg>
//               </Button>
//             </div>
//           </div>

//           {/* Messages */}
//           <div
//             id="messages"
//             className="flex-1 flex flex-col space-y-4 p-2 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
//           >
//             {messages.map((message) => {
//               const sender = participants.find(
//                 (p) => p.id === message.senderId
//               );
//               const isOwnMessage = sender.id === 1;
//               return (
//                 <div
//                   key={message.id}
//                   className={`chat-message flex ${
//                     isOwnMessage ? "justify-end" : "justify-start"
//                   }`}
//                 >
//                   <div
//                     className={`flex items-end ${
//                       isOwnMessage ? "flex-row-reverse" : ""
//                     }`}
//                   >
//                     <Avatar>
//                       <AvatarImage
//                         src={sender.avatar}
//                         alt={`@${sender.name}`}
//                       />
//                       <AvatarFallback>
//                         {sender.name
//                           .split(" ")
//                           .map((n) => n[0])
//                           .join("")}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div className="flex flex-col space-y-1 text-xs max-w-xs mx-2 items-start">
//                       <div className="flex items-center justify-between w-full">
//                         {/* Sender Name */}
//                         <span className="text-gray-500 text-[11px]">
//                           {isOwnMessage ? "You" : sender.name}
//                         </span>
//                         {/* Timestamp */}
//                         <span className="text-gray-400 text-[10px]">
//                           {new Date(message.timestamp).toLocaleTimeString([], {
//                             hour: "2-digit",
//                             minute: "2-digit",
//                           })}
//                         </span>
//                       </div>
//                       {/* Message Text */}
//                       <div>
//                         <span
//                           className={`px-4 py-2 rounded-lg inline-block break-words ${
//                             isOwnMessage
//                               ? "rounded-br-none bg-[#BEA355] text-black"
//                               : "rounded-bl-none bg-[#F2F4F7] text-black"
//                           }`}
//                         >
//                           {message.text}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           {/* Input Field */}
//           <div className="border-t lg:border-t-2 border-gray-200 p-2 space-y-2 mb-1 sm:mb-0">
//             <Input
//               type="text"
//               placeholder="Write your message!"
//               className="w-full border-none active:border-none focus-visible:ring-transparent focus-visible:ring-0 focus-visible:shadow-none shadow-none active:ring-0 active:outline-none outline-none focus:outline-none focus:placeholder-gray-400 text-gray-600 ring-0 focus:ring-0 placeholder-gray-600 py-4 mb-4"
//             />
//             <Separator className="w-full" />
//             <div className="flex items-center justify-between mt-2">
//               <div className="flex items-center space-x-2">
//                 <Button
//                   type="button"
//                   className="inline-flex items-center justify-center bg-transparent shadow-none hover:bg-gray-100 h-8 w-8 transition duration-500 ease-in-out text-gray-500 focus:outline-none"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                     className="h-5 w-5 text-gray-600"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
//                     />
//                   </svg>
//                 </Button>
//                 <Button
//                   type="button"
//                   className="inline-flex items-center justify-center rounded-full bg-transparent shadow-none hover:bg-gray-100 h-8 w-8 transition duration-500 ease-in-out text-gray-500 focus:outline-none"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                     className="h-5 w-5 text-gray-600"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
//                     />
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
//                     />
//                   </svg>
//                 </Button>
//                 <Button
//                   type="button"
//                   className="inline-flex items-center justify-center rounded-full bg-transparent shadow-none hover:bg-gray-100 h-8 w-8 transition duration-500 ease-in-out text-gray-500 focus:outline-none"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                     className="h-5 w-5 text-gray-600"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                     />
//                   </svg>
//                 </Button>
//               </div>
//               <Button
//                 type="button"
//                 className="inline-flex items-center justify-center bg-transparent shadow-none hover:bg-gray-100 text-[#BEA355] focus:outline-none h-8 w-8 transition duration-500 ease-in-out"
//               >
//                 <Send className="w-6 h-6" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Messages;


//////////////////////////////////// integrated ///////////////////////////////////////


// "use client";
// import React, { useState, useEffect } from "react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Dot, Plus, Send } from "lucide-react";
// import API, { API_BASE_URL } from "@/lib/api";
// import axios from "axios";

// const Messages = () => {
//   const [participants, setParticipants] = useState([]);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");

//   // Fetch initial participants and messages
//   const fetchMessages = async () => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/Chatbot/upload_message_or_file/?ID=3`);
//       setMessages(response.data.records);
//       // setParticipants(response.data.participants);
//     } catch (error) {
//       console.error("Failed to fetch messages", error);
//     }
//   };
//   useEffect(() => {
//     fetchMessages();
//   }, []);

//   // Handle sending a new message
//   const sendMessage = async () => {
//     if (!newMessage.trim()) return;
//     let formData = new FormData();
//       formData.append('ID', 3);
//       formData.append('question', newMessage)
//     try {
//       const response = await axios.post(`${API_BASE_URL}/Chatbot/upload_message_or_file/`, formData);
//       fetchMessages()
//       setMessages((prevMessages) => [...prevMessages, response.data.message]);
//       setNewMessage("");
//     } catch (error) {
//       console.error("Failed to send message", error);
//     }
//   };

//   return (
//     <section className="lg:h-[calc(100vh-350px)] container mx-auto border-2 my-4 border-gray-200 rounded-2xl flex flex-col lg:flex-row">
//       {/* Aside for Participants */}
//       {/* <aside className="w-full lg:w-1/4 border-b lg:border-r-2 border-gray-200 overflow-y-auto">
//         <div className="p-3">
//           <h2 className="text-xl font-bold mb-4">Participants</h2>
//           {participants.map((participant) => (
//             <div
//               key={participant.id}
//               className="flex items-center mb-2 border-b-2 border-gray-200 p-2"
//             >
//               <Avatar>
//                 <AvatarImage
//                   src={participant.avatar}
//                   alt={`@${participant.name}`}
//                 />
//                 <AvatarFallback>
//                   {participant.name
//                     .split(" ")
//                     .map((n) => n[0])
//                     .join("")}
//                 </AvatarFallback>
//               </Avatar>
//               <div className="ml-3">
//                 <p className="font-semibold">{participant.name}</p>
//                 <p className="text-sm text-gray-600">{participant.role}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </aside> */}

//       {/* Chat Section */}
//       <div className="flex-1 flex flex-col">
//         <div className="flex-1 p-3 overflow-y-auto">
//           {messages.map((message) => {
//             const sender = participants.find((p) => p.id === message.senderId);
//             const isOwnMessage = sender?.id === 1; // Assume 1 is the current user's ID
//             return (
//               <div
//                 key={message.id}
//                 className={`chat-message flex ${
//                   isOwnMessage ? "justify-end" : "justify-start"
//                 }`}
//               >
//                 <div
//                   className={`p-3 rounded-lg ${
//                     isOwnMessage
//                       ? "bg-blue-500 text-white"
//                       : "bg-gray-200 text-black"
//                   }`}
//                 >
//                   {message.content}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//         {/* Input Section */}
//         <div className="p-3 border-t-2 border-gray-200">
//           <div className="flex items-center">
//             <Input
//               type="text"
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//               placeholder="Type your message..."
//               className="flex-1"
//             />
//             <Button onClick={sendMessage} className="ml-2">
//               <Send className="w-5 h-5" />
//             </Button>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Messages;
