import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { chatLoading } from '../../../actions/chatActions';
import Spinner from '../../atoms/Spinner/Spinner';
import NamespaceSocketContext from '../../../providers/namespaceSocketContext';
import { setCurrentRoomName, setRoomInfo, setRoomMembers } from '../../../actions/roomActions';
import MessageInput from '../../molecules/MessageInput/MessageInput';

const StyledChatWrapper = styled.section`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: transparent;
  position: relative;
`;

const StyledParagraph = styled.p`
  color: inherit;
`;

const MessageInputWrapper = styled.section`
  width: 96%;
  height: 40px;
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
`;

const Chat = ({ isChatLoading, chatLoading, currentRoomName }) => {
  const { namespaceSocket } = useContext(NamespaceSocketContext);

  const [message, setMessage] = useState(['initial']);
  const [inputMessage, setInputMessage] = useState('');

  const handleChange = e => {
    setInputMessage(e.target.value);
  };

  useEffect(() => {
    if (namespaceSocket) {
      namespaceSocket.on('new_message', newMessage => {
        console.log(newMessage);
        setMessage(array => [...array, newMessage]);
      });
    }
  }, [namespaceSocket]);

  return (
    <StyledChatWrapper>
      <p>Chat Component</p>
      {/*While loading spinner, else messages*/}
      {/*MessageInputComponent*/}

      <StyledParagraph>
        {currentRoomName ? `You have joined to room ${currentRoomName}` : 'Welcome on the main page'}
      </StyledParagraph>
      {message.map((item, index) => (
        <StyledParagraph key={index}>{item}</StyledParagraph>
      ))}
      <input type='text' onChange={e => handleChange(e)} />
      <button
        onClick={() => {
          namespaceSocket.emit('send_message', { message: inputMessage, room: currentRoomName });
        }}
      >
        send
      </button>
      <MessageInputWrapper>
        <MessageInput />
      </MessageInputWrapper>
    </StyledChatWrapper>
  );
};

const mapStateToProps = ({ chatReducer: { isChatLoading }, roomReducer: { currentRoomName } }) => {
  return { isChatLoading, currentRoomName };
};

const mapDispatchToProps = dispatch => {
  return {
    chatLoading: isLoading => dispatch(chatLoading(isLoading)),
    setCurrentRoomName: roomName => dispatch(setCurrentRoomName(roomName)),
    setRoomMembers: members => dispatch(setRoomMembers(members)),
    setRoomInfo: roomInfo => dispatch(setRoomInfo(roomInfo))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
