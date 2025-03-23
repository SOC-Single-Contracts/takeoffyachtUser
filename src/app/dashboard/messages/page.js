"use client";
import React, { useState, useEffect, useRef } from "react";
import { Plus, Send, Mic, Camera, Smile, Search, Heart, Bell, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarChat } from "@/components/ui/avatar";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, where, getDocs } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { sb } from "@/lib/sendBird";
import Image from "next/image";

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
  const router = useRouter();
  const [adminId, setAdminId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [newMessageAdded, setNewMessageAdded] = useState(false);
  const [sbChannel, setSbChannel] = useState(null);
  const [userChannels, setUserChannels] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const messageListQuery = useRef(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);




  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /// send message
  const handleSendMessage = async (e) => {
    // e.preventDefault();
    if (!newMessage.trim() || !sbChannel) return;

    try {
      const params = new sb.UserMessageParams();
      params.message = newMessage;
      params.customType = 'text';

      sbChannel.sendUserMessage(params, (message, error) => {
        if (error) {
          console.error('Error sending message:', error);
          return;
        }

        console.log("message", message)

        setMessages(prev => [...prev, {
          id: message.messageId,
          text: message.message,
          senderId: message.sender.userId,
          timestamp: message.createdAt,
          senderName: message.sender.nickname || message.sender.userId,
          type: 'text'

        }]);

        setNewMessage('');
        setNewMessageAdded(true);
      });
    } catch (error) {
      console.error('Error in message handling:', error);
    }
  };

  // Add function to handle image send
  const handleSendImage = async () => {
    if (!selectedImage || !sbChannel) return;

    try {
      const fileMessageParams = new sb.FileMessageParams();
      fileMessageParams.file = selectedImage;
      fileMessageParams.fileName = selectedImage.name;
      fileMessageParams.fileSize = selectedImage.size;
      fileMessageParams.mimeType = selectedImage.type;

      sbChannel.sendFileMessage(fileMessageParams, (fileMessage, error) => {
        if (error) {
          console.error('Error sending image:', error);
          return;
        }

        setMessages(prev => [...prev, {
          id: fileMessage.messageId,
          text: fileMessage.message || '',
          senderId: fileMessage.sender.userId,
          timestamp: fileMessage.createdAt,
          senderName: fileMessage.sender.nickname || fileMessage.sender.userId,
          type: 'image',
          url: fileMessage.url
        }]);

        // Clear preview and selected image
        setImagePreview(null);
        setSelectedImage(null);
      });
    } catch (error) {
      console.error('Error handling file:', error);
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
        const chatId = [session?.user?.userid, availableAdmin.id].sort().join('_');
        const chatRef = collection(db, 'chats');
        await addDoc(chatRef, {
          participants: [session?.user?.userid, availableAdmin.id],
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

  //// fetch all user save seperate admin and current user
  useEffect(() => {
    const connectToSendbird = async () => {
      if (!session?.user?.userid) return;
      setLoading(true);
  
      try {
        await sb.connect(JSON.stringify(session?.user?.userid), (user, error) => {
          if (error) {
            console.error("Connection failed:", error);
            return;
          } else {
            console.log("Connected as:", user);
          }
        });
  
        loadUserChannels(); // Load channels after connection
  
        // Create user query
        const userQuery = sb.createApplicationUserListQuery();
        userQuery.limit = 100; // Set max limit
  
        let allUsers = [];
        let hasMore = true;
  
        while (hasMore) {
          const users = await userQuery.next();
          
          if (!users || users.length === 0) {
            hasMore = false; // Stop if no more users
            break;
          }
  
          allUsers = [...allUsers, ...users];
  
          // Check if more users are available
          hasMore = userQuery.hasNext;
        }
  
        console.log("Fetched Users:", allUsers.length);
  
        const formattedUsers = allUsers.map(user => ({
          id: user.userId,
          name: user.nickname || user.userId,
          role: user.metaData?.role || 'User',
          avatar: user?.profileUrl || `https://api.dicebear.com/6.x/initials/svg?seed=${user.nickname}`,
          status: user.connectionStatus || 'offline',
          email: user.metaData?.email
        }));
  
        setParticipants(formattedUsers);
        setCurrentUser(sb.currentUser);
  
        // Set admin ID
        const getAdminId = formattedUsers.find(user => user?.id === "ADMIN_USER_ID");
        setAdminId(getAdminId?.id || null);
  
      } catch (error) {
        console.error("Error connecting to Sendbird:", error);
      }
      
      setLoading(false);
    };
  
    connectToSendbird();
  
    return () => {
      if (sb) {
        sb.disconnect();
      }
    };
  }, [session?.user?.userid]);
  

  /// create chatRoom on behalf of selectedChatID

  useEffect(() => {
    if (!selectedChat || !sb.currentUser) return;

    const setupChannel = async () => {
      try {
        const existingChannel = userChannels.find(channel =>
          channel.members.some(member => member.userId === selectedChat)
        );
        if (existingChannel) {
          setSbChannel(existingChannel.channel);
          await loadChannelMessages(existingChannel.channel, true);

          const channelHandler = new sb.ChannelHandler();
          channelHandler.onMessageReceived = (channel, message) => {
            setMessages(prev => [...prev, {
              id: message.messageId,
              text: message.message,
              senderId: message.sender.userId,
              timestamp: message.createdAt,
              senderName: message.sender.nickname || message.sender.userId,
              type: message.messageType === 'file' ? 'image' : 'text',
              url: message.url
            }]);
            setNewMessageAdded(true);
          };

          sb.addChannelHandler(`channel_${existingChannel.channel.url}`, channelHandler);
        } else {
          // Create new channel if it doesn't exist
          const params = {
            isDistinct: true,
            userIds: [selectedChat],
            isPublic: false,
          };

          sb.GroupChannel.createChannelWithUserIds(
            params.userIds,
            params.isDistinct,
            (channel, error) => {
              if (error) {
                console.error('Error creating channel:', error);
                return;
              }
              setSbChannel(channel);
              loadUserChannels(); // Reload channels after creating new one
            }
          );
        }
      } catch (error) {
        console.error('Error setting up Sendbird channel:', error);
      }
    };

    setupChannel();

    return () => {
      if (sbChannel) {
        sb.removeChannelHandler(`channel_${sbChannel.url}`);
      }
    };
  }, [selectedChat]);

  // Add this function to fetch all channels
  const loadUserChannels = () => {
    const channelListQuery = sb.GroupChannel.createMyGroupChannelListQuery();
    channelListQuery.includeEmpty = true;
    channelListQuery.limit = 100;
    channelListQuery.isDistinct = true;
    channelListQuery.order = 'latest_last_message'; // Sort by latest message

    channelListQuery.next((channels, error) => {
      if (error) {
        console.error('Error fetching channels:', error);
        return;
      }

      // Map channels to include last message and other details
      const processedChannels = channels.map(channel => {
        const otherMember = channel.members.find(member => member.userId !== sb.currentUser.userId);
        return {
          url: channel.url,
          name: otherMember?.nickname || otherMember?.userId || 'Unknown User',
          lastMessage: channel.lastMessage?.message || '',
          unreadMessageCount: channel.unreadMessageCount,
          members: channel.members,
          channel: channel // Store the full channel object
        };
      });

      setUserChannels(processedChannels);

      // If there's a selectedChat, load its messages
      if (selectedChat) {
        const currentChannel = channels.find(channel =>
          channel.members.some(member => member.userId === selectedChat)
        );
        if (currentChannel) {
          setSbChannel(currentChannel);
          loadChannelMessages(currentChannel);
        }
      }
    });
  };

  // Add this function to load channel messages
  const loadChannelMessages = async (channel, isInitial = true) => {
    if (isInitial) {
      messageListQuery.current = channel.createPreviousMessageListQuery();
      messageListQuery.current.limit = 20;
      messageListQuery.current.reverse = true;
    }

    if (!messageListQuery.current || !messageListQuery.current.hasMore) {
      setHasMore(false);
      return;
    }

    setIsLoadingMore(true);

    try {
      messageListQuery.current.load((messages, error) => {
        if (error) {
          console.error('Error fetching messages:', error);
          return;
        }

        const orderedMessages = messages
          .sort((a, b) => a.createdAt - b.createdAt)
          .map(msg => ({
            id: msg.messageId,
            text: msg.message,
            senderId: msg.sender.userId,
            timestamp: msg.createdAt,
            senderName: msg.sender.nickname || msg.sender.userId,
            type: msg.messageType === 'file' ? 'image' : 'text',
            url: msg.url
          }));

        setMessages(prev => {
          if (isInitial) {
            // Only scroll to bottom on initial load
            setTimeout(() => {
              if (messagesEndRef.current) {
                // console.log("Hello loading more")
                messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
              }
            }, 0);
            return orderedMessages;
          }
          // Don't scroll when loading previous messages
          return [...orderedMessages, ...prev];
        });

        setHasMore(messageListQuery.current.hasMore);
        setIsLoadingMore(false);
      });
    } catch (error) {
      console.error('Error loading messages:', error);
      setIsLoadingMore(false);
    }
  };

  // Update file selection handler to show preview
  const handleFileSelect = (e) => {
    console.log("file")
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    console.log("previewUrl h bahi", previewUrl, file)
    setImagePreview(previewUrl);
    setSelectedImage(file);
  };
  const clearImage = () => {
    setImagePreview(null);
    setSelectedImage(null);

    // Reset file input field
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  const handleSendChat = () => {

    if (selectedImage) {
      handleSendImage()
    }
    if (newMessage.trim()) {
      handleSendMessage()
    }
  }
  ///test
  // useEffect(() => {
  //   console.log("adminId,currentUser", "participants", adminId, currentUser, participants, session)
  // }, [adminId, currentUser, participants, session])

  // useEffect(() => {
  //   console.log(Boolean(selectedImage),Boolean(newMessage.trim()))
  // }, [selectedImage, newMessage])

  // useEffect(() => {
  //   console.log("session", session)
  // }, [session])

  //   useEffect(()=>{
  // console.log("messages",messages)
  //   },[messages])
  // useEffect(() => {
  //     console.log("filteredParticipants",filteredParticipants)
  //   }, [filteredParticipants])

  // useEffect(() => {
  //   console.log("selectedImage,imagePreview", selectedImage, imagePreview)
  // }, [selectedImage, imagePreview])
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
    <section className="px-2 py-4">
  <div className="xs:h-[calc(100vh-150px)] lg:h-[calc(100vh-150px)] bg-white dark:bg-[#1F1F1F] max-w-5xl mx-auto border-2 my-4 border-black/20 rounded-2xl flex flex-col lg:flex-row py-2 md:py-0">
    <aside className="w-full lg:w-1/4 border-b lg:border-r-2 border-black/20 overflow-y-auto">
      <div className="md:p-3 p-2">
        <div className="flex items-center mb-2 justify-between">
          <h2 className="text-sm sm:text-md md:text-xl font-bold">
            Messages( User {currentUser?.nickname && currentUser?.nickname?.trim() !== ""
              ? currentUser?.nickname
              : `Guest ${currentUser?.userId ? `${currentUser?.userId}` : ""}`} ) to Admin
          </h2>
        </div>
        <div className="space-y-2">
          {filteredParticipants.filter((participant) => participant.id == adminId)
            .map((participant) => (
              <div
                key={participant.id}
                onClick={() => setSelectedChat(participant.id)}
                className={`flex items-center mb-2 border-b-2 border-black-20 p-2 hover:bg-gray-100 transition-all duration-300 ease-in-out cursor-pointer hover:rounded-lg ${selectedChat === participant.id ? 'bg-gray-100 dark:bg-gray-800' : ''
                  }`}
              >
                <div className="relative">
                  <AvatarChat
                    src={participant?.avatar}
                    alt={participant?.name}
                    className="md:h-10 h-8 md:w-10 w-8"
                  />
                  <span
                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${participant.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                      }`}
                  />
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-sm md:text-xl">{participant.name}</p>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">{participant.role}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </aside>

    <div className="flex-1 flex flex-col">
      {selectedChat ? (
        <>
          <div className="flex items-center justify-between md:p-4 p-2 border-b">
            <div className="flex items-center md:space-x-4 space-x-1">
              <div className="relative">
                <AvatarChat
                  src={getSelectedParticipant()?.avatar}
                  alt={getSelectedParticipant()?.name}
                  className="md:h-10 h-8 md:w-10 w-8"
                />
                <span
                  className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${getSelectedParticipant()?.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                />
              </div>
              <div>
                <h3 className="font-semibold text-sm md:text-xl">{getSelectedParticipant()?.name}</h3>
                <p className="text-sm text-gray-600 md:text-gray-400">{getSelectedParticipant()?.status}</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 md:p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <p>No messages yet. Start the conversation!</p>
              </div>
            )}
            {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === session?.user?.userid ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[70%] ${message.senderId === session?.user?.userid
                ? 'bg-[#BEA355] text-white rounded-l-lg rounded-br-lg'
                : 'bg-gray-100 text-gray-800 rounded-r-lg rounded-bl-lg'
                } md:p-3 p-1 shadow-sm break-words`}
              >
                {message?.type === "text" ? <p className="text-xs md:text-sm">{message.text}</p> : message?.type === "image" ?
                  <img
                    src={message?.url}
                    alt="Preview"
                    className="max-h-60 rounded-lg w-full object-cover"
                  />
                  : ""}
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

          {imagePreview && (
            <div className="mb-4 relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-60 rounded-lg w-full object-cover"
              />
              <button
                onClick={clearImage}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          <form onSubmit={handleSendChat} className="border-t p-2 md:p-4">
            <div className="flex items-center md:space-x-2 space-x-1">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileSelect}
              />
              <Button
                variant="text"
                className="md:p-2 p-1"
                type="button"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="md:h-6 md:w-6" />
              </Button>
              <Input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 md:py-2 md:px-4 md:h-10 h-8 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#BEA355]"
              />
              <Button
                type="submit"
                disabled={!selectedImage && !newMessage.trim()}
                className="md:p-2 p-1 md:h-10 h-8 md:w-10 w-8 bg-[#BEA355] text-white rounded-full hover:bg-[#9a8544] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={(e) => {
                  e.preventDefault();
                  handleSendChat()
                }}
              >
                <Send className="md:h-6 md:w-6" />
              </Button>
            </div>
          </form>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center min-h-[200px]">
          <div className="text-center">
            <h3 className="md:text-xl text-md font-semibold text-gray-700 mb-2">Welcome to Messages</h3>
            <p className="md:text-sm text-xs text-gray-500">Select a conversation or start a new one</p>
          </div>
        </div>
      )}
    </div>
  </div>
</section>
  );
};

export default Chat;