import React, { useState, useEffect, useRef } from 'react';
import styles from './ChatBox.module.scss';
import PropTypes from 'prop-types';

const ChatBox = ({ onClose }) => {
  const [input, setInput] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const conversationEndRef = useRef(null);
  const chatBoxRef = useRef(null);

  const scrollToBottom = () => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = input.trim();
    if (!message) return;
  
    setIsLoading(true);
  
    // Append user's message to the conversation
    setConversation((prev) => [...prev, `You: ${message}`]);
  
    setInput('');
  
    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: message }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }
  
      const { result } = await response.json();
      setConversation((prev) => [...prev, `AccountabilityGPT: ${result}`]);
    } catch (error) {
      console.error('Error:', error);
      setConversation((prev) => [...prev, `AccountabilityBot: Error processing your query`]);
    } finally {
      setIsLoading(false);
    }
  };  

  const handleCloseClick = () => {
    onClose(); // Trigger the passed onClose function from the ChatModal
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (chatBoxRef.current && !chatBoxRef.current.contains(event.target)) {
        onClose(); // Assuming onClose is the prop function to close the chat box
      }
    }
  
    // Add click event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Remove event listener on cleanup
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]); // Don't forget to add onClose to the dependency array if it's a prop
  

  return (
    <div className={styles.chatBox} ref={chatBoxRef}>    
      <div className={styles.header}>
        <h1 className={styles.heading}>How can I help you explore the data?</h1>
        <button onClick={handleCloseClick} className={styles.closeButton} aria-label="Close chat">✕</button>
      </div>
      <div className={styles.conversation}>
        {conversation.map((msg, index) => {
          const isUserMessage = msg.startsWith("You:");
          return (
            <div key={index} className={styles.messageWithDot}>
              <span className={`${styles.dot} ${isUserMessage ? styles.greenDot : styles.redDot}`}></span>
              <p className={styles.message}>{msg}</p>
            </div>
          );
        })}
        <div ref={conversationEndRef} />
      </div>
      <div className={styles.suggestionContainer}>
        <button className={styles.suggestion} onClick={() => handleSuggestionClick('What columns are available?')} disabled={isLoading}>What columns are available?</button>
        <button className={styles.suggestion} onClick={() => handleSuggestionClick('Which agencies are in this tables?')} disabled={isLoading}>Which agencies are in this tables?</button>
        <button className={styles.suggestion} onClick={() => handleSuggestionClick('What is the most common allegation for all agencies?')} disabled={isLoading}>What is the most common allegation for all agencies?</button>
        <button className={styles.suggestion} onClick={() => handleSuggestionClick('What is the most common action for all agencies?')} disabled={isLoading}>What is the most common action for all agencies?</button>
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Message AccountabilityGPT..."
          value={input}
          onChange={handleInputChange}
          className={styles.input}
          aria-label="Type your message here"
        />
        <button type="submit" className={styles.button} disabled={isLoading}>Send</button>
      </form>
    </div>
  );
};

ChatBox.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default ChatBox;
