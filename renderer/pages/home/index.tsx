import electron from 'electron';
import React, { useState } from 'react';
// import Link from 'next/link';
import Input from 'antd/lib/input/Input';
import { Layout, Button, Modal } from 'antd';

import axios from 'axios';
import { v4 } from 'uuid';
import { sign } from 'jsonwebtoken';
import Link from 'next/link';

const ipcRenderer = electron.ipcRenderer;
const { Header, Content } = Layout;

const isProd: boolean = process.env.NODE_ENV === 'production';

function Home() {
  const [accessKey, setAccessKey] = useState('');
  const [secretKey, setSecretKey] = useState('');

  const [modalVisible, setModalVisible] = useState(false);

  const [modalMessage, setModalMessage] = useState('');

  const handleAccessKeyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccessKey(e.target.value);
  };

  const handleSecretKeyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSecretKey(e.target.value);
  };

  const handleTest = () => {
    if (isProd) {
      window.location.href = 'app://./select.html';
    } else {
      window.location.href = '../select';
    }
  };

  const saveUserData = () => {
    ipcRenderer.send('saveFile', { accessKey, secretKey });
    ipcRenderer.on('reply', (evt, arg) => {
      if (arg.status === 'success') {
        setModalVisible(true);
        setModalMessage('저장 성공');
      } else {
        setModalVisible(true);
        setModalMessage('저장 실패');
      }
    });
  };

  return (
    <React.Fragment>
      <Header>
        <a className="text-white">1. key 등록</a>
      </Header>

      <Content>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Input
            style={{ marginTop: '5rem', width: '60%' }}
            placeholder="Access Key"
            value={accessKey}
            onChange={handleAccessKeyInputChange}
          />
          <Input
            style={{ marginTop: '1rem', width: '60%' }}
            placeholder="Secret Key"
            value={secretKey}
            onChange={handleSecretKeyInputChange}
          />
          <Button style={{ marginTop: '3rem', width: '60%' }} className="mt-4" onClick={saveUserData}>
            테스트
          </Button>
        </div>
        <div>
          <Modal
            title={modalMessage}
            open={modalVisible}
            onOk={() => {
              setModalVisible(false);
            }}
            onCancel={() => {
              setModalVisible(false);
            }}
          ></Modal>
        </div>
        <Button onClick={handleTest}>다음</Button>
      </Content>
    </React.Fragment>
  );
}

export default Home;
