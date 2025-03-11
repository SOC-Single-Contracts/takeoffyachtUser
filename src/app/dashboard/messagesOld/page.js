"use client";
import React, { useState, useEffect, useRef } from "react";
import { Plus, Send, Mic, Camera, Smile, Search, Heart, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, where, getDocs } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

const Chat = () => {
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const { data: session } = useSession();

  // Fetch all admin and support users
  useEffect(() => {
    const fetchParticipants = async () => {
      if (!session?.user?.userid) return;

      try {
        setLoading(true);
        const response = await fetch('https://api.takeoffyachts.com/yacht/all_user/');
        const data = await response.json();
        
        if (data.error_code === 'pass') {
          const admins = data.user.filter(user => user.user_type === 'ADM');
          const formattedAdmins = admins.map(admin => ({
            id: admin.ID,
            name: admin.Username,
            role: 'Support Admin',
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${admin.Username}`,
            status: 'online'
          }));
          setParticipants(formattedAdmins);
        }
      } catch (error) {
        console.error('Error fetching participants:', error);
        toast.error('Error', {
          description: 'Failed to load chat participants'
        });
        setError('Failed to load chat participants');
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [session?.user?.userid]);

  // Listen to real-time messages
  useEffect(() => {
    if (!session?.user?.userid || !selectedChat) return;

    const chatId = [session.user.userid, selectedChat].sort().join('_');
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    try {
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const newMessages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate().toISOString() || new Date().toISOString()
        }));
        setMessages(newMessages);
      }, (error) => {
        console.error('Error listening to messages:', error);
        toast.error('Chat Error', {
          description: 'Failed to connect to chat. Please refresh the page.'
        });
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Error setting up message listener:', error);
      setError('Failed to connect to chat');
    }
  }, [session?.user?.userid, selectedChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !session?.user?.userid || !selectedChat) return;

    const chatId = [session.user.userid, selectedChat].sort().join('_');
    const messagesRef = collection(db, 'chats', chatId, 'messages');

    try {
      await addDoc(messagesRef, {
        text: newMessage,
        senderId: session.user.userid,
        timestamp: serverTimestamp(),
        senderName: session.user.username || 'User',
        senderType: 'USER'
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Message Error', {
        description: 'Failed to send message. Please try again.'
      });
    }
  };

  const startNewChat = async () => {
    if (!session?.user?.userid) return;

    try {
      // Find an available admin
      const availableAdmin = participants[0]; // For now, just take the first admin
      if (availableAdmin) {
        setSelectedChat(availableAdmin.id);
        // Create a new chat document if it doesn't exist
        const chatId = [session.user.userid, availableAdmin.id].sort().join('_');
        const chatRef = collection(db, 'chats');
        await addDoc(chatRef, {
          participants: [session.user.userid, availableAdmin.id],
          createdAt: serverTimestamp()
        });
      } else {
        toast.error('No admin available', {
          description: 'Please try again later'
        });
      }
    } catch (error) {
      console.error('Error starting new chat:', error);
      toast.error('Error', {
        description: 'Failed to start new chat'
      });
    }
  };

  const filteredParticipants = participants.filter(participant =>
    participant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSelectedParticipant = () => {
    return participants.find(p => p.id === selectedChat);
  };

  if (!session?.user) {
    return (
      <section className="py-16 text-center">
        <div className="max-w-md mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
          <p className="text-gray-600 mb-6">
            Looks like you're not logged in. You need to be signed in to use the chat
          </p>
          <Button 
            onClick={() => router.push('/login')}
            className="bg-[#BEA355] hover:bg-[#a68f4b] text-white rounded-full"
          >
            Login to Continue
          </Button>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-350px)]">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded-lg w-64 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-350px)]">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-red-600 mb-2">Error</h3>
          <p className="text-gray-500">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-[#BEA355] hover:bg-[#9a8544]"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <section className="lg:h-[calc(100vh-350px)] bg-white dark:bg-[#1F1F1F] max-w-5xl mx-auto border-2 my-4 border-black/20 rounded-2xl flex flex-col lg:flex-row">
      {/* Aside for Participants */}
      <aside className="w-full lg:w-1/4 border-b lg:border-r-2 border-black/20 overflow-y-auto">
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
                className="pl-10 py-2 px-2 border border-black-20 rounded-lg outline-none focus:ring-2 focus:ring-[#BEA355] w-full"
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
                className={`flex items-center mb-2 border-b-2 border-black-20 p-2 hover:bg-gray-100 transition-all duration-300 ease-in-out cursor-pointer hover:rounded-lg ${
                  selectedChat === participant.id ? 'bg-gray-100 dark:bg-gray-800' : ''
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">{participant.role}</p>
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
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              )}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === session.user.userid ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] ${
                    message.senderId === session.user.userid 
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
                  variant="ghost" 
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
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="p-2 bg-[#BEA355] text-white rounded-full hover:bg-[#9a8544] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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