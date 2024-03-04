import path from 'path';
import { app, ipcMain } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
import * as fs from 'fs';
import axios from 'axios';

const isProd = process.env.NODE_ENV === 'production';

const currentPrice = {
  'KRW-BTC': 0,
  'KRW-ETH': 0,
  'KRW-XRP': 0,
};

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
  });

  // setInterval(async () => {
  //   const { data } = await axios.get('https://api.upbit.com/v1/ticker?markets=KRW-BTC,KRW-ETH,KRW-XRP');
  //   currentPrice['KRW-BTC'] = data[0].trade_price;
  //   currentPrice['KRW-ETH'] = data[1].trade_price;
  //   currentPrice['KRW-XRP'] = data[2].trade_price;
  // }, 1000);

  if (isProd) {
    await mainWindow.loadURL('app://./home');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on('window-all-closed', () => {
  app.quit();
});

ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`);
});

ipcMain.on('saveFile', (evt, arg) => {
  if (arg.accessKey === '' || arg.secretKey === '') {
    evt.sender.send('reply', { status: 'fail' });
    return;
  }

  const dataFilePath = `${__dirname}/private_user_data.json`;
  const userData = JSON.stringify(arg, null, 2);

  fs.writeFileSync(dataFilePath, userData, 'utf8');
  evt.sender.send('reply', { status: 'success' });
});

ipcMain.on('getSavedUserDataFile', (evt, arg) => {
  const dataFilePath = `${__dirname}/private_user_data.json`;

  const userData = fs.readFileSync(dataFilePath, 'utf8');
  if (userData === '') {
    evt.sender.send('reply', { status: 'fail' });
    return;
  }
  evt.sender.send('reply', { status: 'success', userData: JSON.parse(userData) });
});

ipcMain.on('orderFirst', (evt, arg) => {
  const dataFilePath = `${__dirname}/assets_data.json`;
  const assetsData = JSON.stringify(arg, null, 2);
  fs.writeFileSync(dataFilePath, assetsData, 'utf8');
});

ipcMain.on('getSavedAssetsDataFile', (evt, arg) => {
  const dataFilePath = `${__dirname}/assets_data.json`;
  const assetsData = fs.readFileSync(dataFilePath, 'utf8');

  if (assetsData === '') {
    evt.sender.send('assetsReturn', { status: 'fail' });
    return;
  }
  evt.sender.send('assetsReturn', { status: 'success', assetsData: JSON.parse(assetsData) });
});

ipcMain.on('getSavedReservationOrderDataFile', (evt, arg) => {
  const dataFilePath = `${__dirname}/reservation_order_data.json`;

  const reservationOrderData = fs.readFileSync(dataFilePath, 'utf8');
  if (reservationOrderData === '') {
    evt.sender.send('reservationOrderReturn', { status: 'fail' });
    return;
  }
  evt.sender.send('reservationOrderReturn', {
    status: 'success',
    reservationOrderData: JSON.parse(reservationOrderData),
  });
});

ipcMain.on('orderReservation', (evt, arg) => {
  const dataFilePath = `${__dirname}/reservation_order_data.json`;
  const reservationOrderData = JSON.stringify(arg, null, 2);
  fs.writeFileSync(dataFilePath, reservationOrderData, 'utf8');
});
