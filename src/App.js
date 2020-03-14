import React, { useEffect, useState } from 'react';
import './App.css';
import io from 'socket.io-client';
import Layout from './components/templates/Layout';

const socketURL = 'http://localhost:9000';

const socket = io(socketURL);

function App() {
  const [namespaces, setNamespaces] = useState(null);
  useEffect(() => {
    socket.on('connect', () => {
      socket.emit('user_connected', {
        socketID: socket.id,
        username: socket.query.username
      });
      console.log(socket);
      socket.on('load_rooms', data => {
        console.log(data);
      });
      socket.on('load_namespaces', namespaces => {
        setNamespaces(namespaces);
        console.log(namespaces);
      });
      socket.on('namespace_created', namespace => {
        console.log(namespace);
      });
    });
  }, []);

  console.log(namespaces);

  return (
    <Layout>
      <div className='App'>
        <button
          onClick={() =>
            socket.emit('create_namespace', {
              name: 'Test namespace',
              ownerID: '1928',
              isPrivate: false,
              password: 'asd'
            })
          }
        >
          create namespace
        </button>
      </div>
    </Layout>
  );
}

export default App;
