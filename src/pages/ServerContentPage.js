import React, { useEffect } from 'react';
import styled from 'styled-components';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import { setCurrentNamespace } from '../actions/namespaceActions';
import queryString from 'query-string';
import { setCurrentRoom } from '../actions/roomActions';
import { API_URL } from '../utils/helpers';
import RoomsTemplate from '../components/templates/RoomsTemplate/RoomsTemplate';
import NamespaceSocketContext from '../providers/namespaceSocketContext';

const StyledWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
  overflow: hidden;
  background: transparent;
  margin-left: 125px;

  ${({ theme }) => theme.mq.tablet} {
    margin-left: 0;
  }
`;

const StyledChatWrapper = styled.section`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;

  ${({ theme }) => theme.mq.tablet} {
    position: static;
  }
`;

const ServerContentPage = ({ match, location, setCurrentNamespace, setCurrentRoom, token }) => {
  const namespaceSocket = io(`${API_URL}/${match.params.id}`);

  useEffect(() => {
    namespaceSocket.on('connect', () => {
      console.log('connected to the namespace');
    });
    namespaceSocket.on('load_rooms', data => {
      console.log(data);
    });
    namespaceSocket.on('namespace_joined', namespaceID => {
      setCurrentNamespace(namespaceID);
    });
  }, []);

  useEffect(() => {
    const roomParams = queryString.parse(location.search);
    roomParams && setCurrentRoom(roomParams.room);
    /* socket -> if params exists,  */
  }, []);

  return (
    <NamespaceSocketContext.Provider value={{ namespaceSocket }}>
      <StyledWrapper>
        <RoomsTemplate />
        <StyledChatWrapper>
          <p>Choose room</p>
        </StyledChatWrapper>
      </StyledWrapper>
    </NamespaceSocketContext.Provider>
  );
};

const mapStateToProps = ({ authenticationReducer: { token } }) => {
  return { token };
};

const mapDispatchToProps = dispatch => {
  return {
    setCurrentNamespace: namespaceID => dispatch(setCurrentNamespace(namespaceID)),
    setCurrentRoom: roomID => dispatch(setCurrentRoom(roomID))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ServerContentPage);
