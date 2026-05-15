import React, { useState, useRef, useEffect } from 'react';
import { Button, Container, Row, Col, Form, InputGroup, Badge, Image } from 'react-bootstrap';
import './chat.css';

const initialMessages = [
  { id: 1, sender: 'Owner', text: 'Hi! I saw your request and this room looks like a great fit.', time: '09:12 AM' },
  { id: 2, sender: 'Student', text: 'Thanks! Can you tell me more about the utilities and house rules?', time: '09:15 AM' }
];

function Chat() {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [studentConfirmed, setStudentConfirmed] = useState(false);
  const [ownerConfirmed, setOwnerConfirmed] = useState(false);
  const chatEndRef = useRef(null);
  const locked = !(studentConfirmed && ownerConfirmed);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim() || locked) return;
    const nextMessage = {
      id: messages.length + 1,
      sender: 'Owner',
      text: newMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, nextMessage]);
    setNewMessage('');
  };

  const propertyAddress = '123 Main St, City Center';

  return (
    <div className="chat-screen py-5">
      <Container>
        <div className="chat-header d-flex align-items-center justify-content-between gap-3 mb-4 p-3 shadow-sm rounded-4 bg-white">
          <div className="d-flex align-items-center gap-3">
            <Image
              src="https://via.placeholder.com/72"
              roundedCircle
              className="chat-profile-photo"
            />
            <div>
              <h2 className="mb-1">Anna Popescu</h2>
              <p className="mb-0 text-muted">Viewing property at <strong>{propertyAddress}</strong></p>
            </div>
          </div>
          <Badge bg={locked ? 'secondary' : 'success'} className="chat-status-badge">
            {locked ? 'Locked' : 'Unlocked'}
          </Badge>
        </div>

        <div className="chat-window shadow-sm rounded-4 position-relative overflow-hidden bg-white">
          {locked && (
            <div className="chat-locked-overlay d-flex flex-column justify-content-center align-items-center text-center p-4">
              <div className="overlay-box p-4 rounded-4">
                <h3>Chat will unlock once both sides confirm interest</h3>
              </div>
            </div>
          )}

          <div className="chat-messages p-4">
            {messages.map((message) => (
              <div key={message.id} className={`chat-message ${message.sender === 'Owner' ? 'owner-message' : 'student-message'}`}>
                <div className="message-meta d-flex justify-content-between align-items-start mb-2">
                  <span className="message-sender">{message.sender}</span>
                  <span className="message-time text-muted">{message.time}</span>
                </div>
                <div className="message-text">{message.text}</div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="chat-input-bar p-3 border-top bg-light">
            <Row className="g-2 align-items-center">
              <Col xs={12} lg={9}>
                <InputGroup>
                  <Form.Control
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={locked}
                  />
                </InputGroup>
              </Col>
              <Col xs={12} lg={3} className="d-grid">
                <Button variant="primary" onClick={handleSend} disabled={locked || !newMessage.trim()}>
                  Send
                </Button>
              </Col>
            </Row>
          </div>
        </div>

        <div className="chat-action-bar d-flex flex-wrap justify-content-end gap-2 mt-3">
          <Button variant={studentConfirmed ? 'success' : 'outline-secondary'} onClick={() => setStudentConfirmed(true)}>
            Confirm as Student
          </Button>
          <Button variant={ownerConfirmed ? 'success' : 'outline-secondary'} onClick={() => setOwnerConfirmed(true)}>
            Confirm as Owner
          </Button>
        </div>
      </Container>
    </div>
  );
}

export default Chat;
