import React, { useState, useEffect, useRef } from "react";
import { Dot, Plus, Send, Mic, Camera, Smile, Search, Heart, Bell } from "lucide-react";
import { Avatar, Button, Input } from "@material-tailwind/react";

const Chat = () => {
  const [participants, setParticipants] = useState([
    {
      id: 1,
      name: "Anderson Vanhron",
      role: "Junior Developer",
      avatar: "https://github.com/shadcn.png",
      status: "online"
    },
    {
      id: 2,
      name: "David Lee",
      role: "Senior Developer",
      avatar: "https://github.com/david.png",
      status: "offline"
    },
    {
      id: 3,
      name: "Sara Smith",
      role: "Project Manager",
      avatar: "https://github.com/sara.png",
      status: "online"
    },
  ]);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Load messages from localStorage
    const loadMessages = () => {
      const storedMessages = localStorage.getItem(`chat_messages_${selectedChat}`);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      } else {
        setMessages([]);
      }
    };

    if (selectedChat) {
      loadMessages();
    }
  }, [selectedChat]);

  useEffect(() => {
    // Save messages to localStorage whenever they change
    if (selectedChat && messages.length > 0) {
      localStorage.setItem(`chat_messages_${selectedChat}`, JSON.stringify(messages));
    }
  }, [messages, selectedChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    const newMsg = {
      id: Date.now(),
      text: newMessage,
      senderId: 1, // Current user ID
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');
  };

  const startNewChat = () => {
    const newChatId = Date.now();
    setSelectedChat(newChatId);
    setMessages([]);
  };

  const filteredParticipants = participants.filter(participant =>
    participant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSelectedParticipant = () => {
    return participants.find(p => p.id === selectedChat);
  };

  return (
    <section className="lg:h-[calc(100vh-350px)] container mx-auto border-2 my-4 border-gray-200 rounded-2xl flex flex-col lg:flex-row">
      {/* Aside for Participants */}
      <aside className="w-full lg:w-1/4 border-b lg:border-r-2 border-gray-200 overflow-y-auto">
        <div className="p-3">
          <div className="flex items-center mb-2 justify-between">
            <h2 className="text-xl font-bold">Messages</h2>
            <Plus className="h-6 w-6 cursor-pointer hover:text-[#BEA355] transition-colors" />
          </div>
          <div className="p-2 space-y-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations"
                className="pl-10 py-2 px-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#BEA355] w-full"
              />
            </div>
            <Button
              onClick={startNewChat}
              className="w-full h-10 capitalize flex items-center justify-center rounded-lg text-white transition duration-500 ease-in-out bg-[#BEA355] hover:bg-[#9a8544] shadow-none"
            >
              <Plus className="w-5 h-5 mr-2" />
              Start a new chat
            </Button>
          </div>
          <div className="space-y-2">
            {filteredParticipants.map((participant) => (
              <div
                key={participant.id}
                onClick={() => setSelectedChat(participant.id)}
                className={`flex items-center mb-2 border-b-2 border-gray-200 p-2 hover:bg-gray-100 transition-all duration-300 ease-in-out cursor-pointer hover:rounded-lg ${
                  selectedChat === participant.id ? 'bg-gray-100' : ''
                }`}
              >
                <div className="relative">
                  <Avatar
                    src={participant.avatar}
                    alt={participant.name}
                    className="h-10 w-10"
                  />
                  <span
                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                      participant.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                  />
                </div>
                <div className="ml-3">
                  <p className="font-semibold">{participant.name}</p>
                  <p className="text-sm text-gray-600">{participant.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Chat Section */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar
                    src={getSelectedParticipant()?.avatar}
                    alt={getSelectedParticipant()?.name}
                    className="h-10 w-10"
                  />
                  <span
                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                      getSelectedParticipant()?.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{getSelectedParticipant()?.name}</h3>
                  <p className="text-sm text-gray-600">{getSelectedParticipant()?.status}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="text" className="p-2">
                  <Search className="h-5 w-5" />
                </Button>
                <Button variant="text" className="p-2">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="text" className="p-2">
                  <Bell className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === 1 ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] ${
                    message.senderId === 1 
                      ? 'bg-[#BEA355] text-white rounded-l-lg rounded-br-lg' 
                      : 'bg-gray-100 text-gray-800 rounded-r-lg rounded-bl-lg'
                  } p-3 shadow-sm`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="border-t p-4">
              <div className="flex items-center space-x-2">
                <Button 
                  variant="text" 
                  className="p-2"
                  type="button"
                >
                  <Smile className="h-6 w-6" />
                </Button>
                <Input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 py-2 px-4 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#BEA355]"
                />
                <Button 
                  variant="text" 
                  className="p-2"
                  type="button"
                >
                  <Camera className="h-6 w-6" />
                </Button>
                <Button 
                  variant="text" 
                  className="p-2"
                  type="button"
                >
                  <Mic className="h-6 w-6" />
                </Button>
                <Button
                  type="submit"
                  className="p-2 bg-[#BEA355] text-white rounded-full hover:bg-[#9a8544] transition-colors"
                >
                  <Send className="h-6 w-6" />
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Welcome to Messages</h3>
              <p className="text-gray-500">Select a conversation or start a new one</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Chat;