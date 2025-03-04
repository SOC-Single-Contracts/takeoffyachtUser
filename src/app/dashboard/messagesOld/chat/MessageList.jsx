import { useEffect, useRef } from 'react';
import { format } from 'date-fns';
import MessageItem from './MessageItem';

function MessageList({ messages }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="messages">
      {messages.map((message) => (
        <MessageItem
          key={message.id}
          text={message.text}
          username={message.username}
          timestamp={format(message.timestamp, 'HH:mm')}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessageList;