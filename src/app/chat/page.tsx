'use client'
import { useState } from 'react';
import 'styles/chat.styles.css'

//Api keys
const openAIKey = process.env.NEXT_PUBLIC_OPENAI_KEY;

interface Message {
  text: string;
  sender: 'user' | 'openai';
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<string>('1 Behavior');
  const [chatIsLoading, setChatIsLoading] = useState<boolean>(false);
  
  //Create api request and manage response 
  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || chatIsLoading) return;
    setMessages([...messages, { text: newMessage, sender: 'user' }]);
    setNewMessage('');
    setChatIsLoading(true);
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openAIKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: 
          [{
            role: "user",
            content: `You are a Software Engineer,
                   You have been doing this task for 20 years, 
                   Your task is to generate ${selectedOption} using gherkin language for the following requirement: ${newMessage}`
          }],
          max_tokens: 1000,
        }),
      });
      const data = await response.json();
      setMessages((prevState) => [...prevState, { text: data.choices[0].message.content, sender: 'openai' }]);
      setChatIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  //Manage Enter key 
  const handleChatEnter = (event: any) => {
    if(event.key === "Enter"){handleSendMessage()}
  }

  //Clear Chat key 
  const handleClearChat = (event: any) => {
    setMessages([]);
  }

  //Manage Enter key 
  const handleSelectionChange = (event: any) => {
    setSelectedOption(event.target.value);
	}

  return (
		<div className="chat-container">
			<div className="chat-messages">
				{messages.map((message, index) => (
					<div key={index} className={`message ${message.sender}`}>
						{message.text}
					</div>
				))}
				{chatIsLoading && (
					<div className="loader">
						<div></div>
						<div></div>
						<div></div>
					</div>
				)}
			</div>
			<div className="chat-container">
				<div className="chat-prompt">
					<textarea
						id="user-input"
						placeholder={chatIsLoading ? "Processing" : "Request..."}
						value={newMessage}
						onChange={(e) => setNewMessage(e.target.value)}
						onKeyDown={handleChatEnter}
					></textarea>
					<select
          className='select'
          value={selectedOption}
          onChange={handleSelectionChange}
          >
						<option value="1 Behavior">1 Behavior</option>
						<option value="2 Behaviors">2 Behaviors</option>
						<option value="3 Behaviors">3 Behaviors</option>
            <option value="4 Behaviors">4 Behaviors</option>
            <option value="5 Behaviors">5 Behaviors</option>
					</select> 
					<button
						disabled={chatIsLoading}
						className="secondary-button"
						onClick={handleSendMessage}
					>
						Generate
					</button>
				</div>
			</div>
			<div className="chat-input">
				<button className="primary-button" onClick={handleClearChat}>
					Clear Chat
				</button>
			</div>
		</div>
	);
};
export default ChatPage;