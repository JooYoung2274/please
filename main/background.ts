import path from 'path';
import { app, ipcMain } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
import * as fs from 'fs';

const isProd = process.env.NODE_ENV === 'production';

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
  console.log(arg);

  if (arg.accessKey === '' || arg.secretKey === '') {
    evt.sender.send('reply', { status: 'fail' });
    return;
  }

  const dataFilePath = `${__dirname}/private_user_data.json`;
  const userData = JSON.stringify(arg, null, 2);

  fs.writeFileSync(dataFilePath, userData, 'utf8');
  evt.sender.send('reply', { status: 'success' });
});

ipcMain.on('getSavedFile', (evt, arg) => {
  const dataFilePath = `${__dirname}/private_user_data.json`;

  const userData = fs.readFileSync(dataFilePath, 'utf8');
  if (userData === '') {
    evt.sender.send('reply', { status: 'fail' });
    return;
  }
  evt.sender.send('reply', { status: 'success', userData: JSON.parse(userData) });
});
