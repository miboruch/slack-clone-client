import React, { useContext, useRef, useState } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Formik, Form } from 'formik';
import { Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';
import { useOutsideClick } from '../../../utils/customHooks';
import NamespaceSocketContext from '../../../providers/namespaceSocketContext';
import { ReactComponent as EmojiIcon } from '../../../assets/icons/emoji.svg';

const MessageInputWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const StyledTextArea = styled.input`
  width: 90%;
  height: 100%;
  font-size: 16px;
  border-radius: 10px;
  border: ${({ isDarkTheme }) => (isDarkTheme ? 'none' : '1px solid #aaa')};
  color: ${({ isDarkTheme }) => (isDarkTheme ? '#fff' : '#000')};
  background-color: ${({ isDarkTheme, theme }) =>
    isDarkTheme ? theme.color.inputBackgroundDark : theme.color.inputBackgroundLight};
  transition: background-color 0.3s ease;
  resize: none;
  font-family: ${({ theme }) => theme.font.family.futura};
  overflow: hidden;
  padding: 1rem;

  &:focus {
    outline: none;
  }
`;

const EmojiWrapper = styled.div`
  position: absolute;
  right: 1rem;
  top: -1.5rem;
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
  pointer-events: ${({ isOpen }) => (isOpen ? 'auto' : 'none')};
  transform: translateY(-100%);
  transition: opacity 0.5s ease, visibility 0.5s ease;
`;

const StyledForm = styled(Form)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const StyledEmojiIcon = styled(EmojiIcon)`
  width: 25px;
  height: 25px;
  margin: 0 1.5rem;
  cursor: pointer;
`;

const MessageInput = ({ isDarkTheme, currentRoomInfo, currentRoomName }) => {
  const { namespaceSocket } = useContext(NamespaceSocketContext);

  const emojiWrapperRef = useRef(null);
  const inputRef = useRef(null);
  const [isEmojiOpen, setEmojiOpen] = useState(false);

  const toggleEmoji = () => {
    setEmojiOpen(!isEmojiOpen);
  };

  useOutsideClick(emojiWrapperRef, isEmojiOpen, toggleEmoji);

  return (
    <MessageInputWrapper>
      <Formik
        initialValues={{ message: '' }}
        onSubmit={({ message }, { resetForm }) => {
          namespaceSocket.emit('send_message', { message: message, room: currentRoomName });
          resetForm();
        }}
      >
        {({ handleChange, handleBlur, values, setFieldValue }) => {
          const handleEmojiClick = event => {
            setFieldValue('message', values.message + event.native);
            toggleEmoji();
          };
          return (
            <>
              <StyledForm autocomplete='off'>
                <StyledTextArea
                  ref={inputRef}
                  placeholder={`Message #${currentRoomInfo.name}`}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isDarkTheme={isDarkTheme}
                  value={values.message}
                  name={'message'}
                />
                <StyledEmojiIcon onClick={() => toggleEmoji()} />
              </StyledForm>
              <EmojiWrapper isOpen={isEmojiOpen} ref={emojiWrapperRef}>
                <Picker onSelect={handleEmojiClick} theme={isDarkTheme ? 'dark' : 'light'} title='Emoji' />
              </EmojiWrapper>
            </>
          );
        }}
      </Formik>
    </MessageInputWrapper>
  );
};

const mapStateToProps = ({ toggleReducer: { isDarkTheme }, roomReducer: { currentRoomInfo, currentRoomName } }) => {
  return { isDarkTheme, currentRoomInfo, currentRoomName };
};

export default connect(mapStateToProps)(MessageInput);