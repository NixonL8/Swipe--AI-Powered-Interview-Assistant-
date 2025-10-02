import { Typography, Tag } from 'antd'
import type { ChatMessage } from '@/types'
import './message.css'

const { Text } = Typography

interface ChatMessagesProps {
  messages: ChatMessage[]
}

const senderLabel: Record<ChatMessage['sender'], string> = {
  assistant: 'Assistant',
  candidate: 'You',
  system: 'System',
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  return (
    <div className="chat-window">
      <ul className="chat-list">
        {messages.map((message) => (
          <li
            key={message.id}
            className={`chat-item chat-item--${message.sender}`}
          >
            <div className="chat-meta">
              <span className="chat-sender">{senderLabel[message.sender]}</span>
              <span className="chat-time">
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            <div className="chat-content">
              {message.kind === 'question' && (
                <div className="chat-tags">
                  <Tag color="blue" className="chat-tag">
                    Question
                  </Tag>
                </div>
              )}
              {message.kind === 'summary' && (
                <div className="chat-tags">
                  <Tag color="green" className="chat-tag">
                    Summary
                  </Tag>
                </div>
              )}
              <p className="chat-text">
                <Text>{message.content}</Text>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ChatMessages
