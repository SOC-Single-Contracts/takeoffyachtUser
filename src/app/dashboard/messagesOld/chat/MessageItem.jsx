function MessageItem({ text, username, timestamp }) {
    return (
      <div className="message">
        <div className="message-content">
          <p>{text}</p>
          <small>{username} • {timestamp}</small>
        </div>
      </div>
    );
  }
  
  export default MessageItem;