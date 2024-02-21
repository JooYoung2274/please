import electron from 'electron';

import React from 'react';
import '../styles/global.scss';
import Head from 'next/head';
import Link from 'next/link';
import Input from 'antd/lib/input/Input';
import { Layout, Button } from 'antd';
import Home from './home';

const ipcRenderer = electron.ipcRenderer;
const { Header, Content } = Layout;
function MyApp({ Component, pageProps }) {
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
      <Content>
        <Home></Home>
      </Content>
    </React.Fragment>
  );
}

export default MyApp;
