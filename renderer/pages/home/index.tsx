import electron from 'electron';

import React from 'react';

import Head from 'next/head';
import Link from 'next/link';
import Input from 'antd/lib/input/Input';
import { Layout, Button } from 'antd';

const ipcRenderer = electron.ipcRenderer;
const { Header, Content } = Layout;
function Home() {
  const test = () => {
    ipcRenderer.send('saveFile', '클라이언트가 보냄');
    ipcRenderer.on('reply', (evt, arg) => {
      console.log(arg);
    });
  };
  return (
    <React.Fragment>
      <Head>
        <title>테에스으트으</title>
      </Head>

      <Header>
        <Link href="/next">
          <a>1. key 등록</a>
        </Link>
      </Header>

      <Content>
        <Input placeholder="Basic usage" />
        <Button onClick={test}>테스트</Button>
      </Content>
    </React.Fragment>
  );
}

export default Home;
