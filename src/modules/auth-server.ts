
import path from 'path';
import express from 'express';
import { updateAccessToken } from './token-storage';
import { IAppContainer } from '../interfaces';

const log = (message: string) => {
    console.log(`***Auth service: ${message}`);
}

const updateNotifierToken = (appContainer: IAppContainer, token: string) => {
  if (!appContainer.notifier){
    return;
  }
  
  log("Notifier token updated.");

  appContainer.notifier.updateToken(token);
}

const updateWindowToken = (appContainer: IAppContainer, token: string) => {
  if (!appContainer.mainWindow){
    return;
  }

  log("Window token updated.");

  appContainer.mainWindow.webContents.send("token_updated", token);
  appContainer.mainWindow.focus();
}

export const startServer = (appContainer: IAppContainer) => {
  log("Starting server.");

  const isDebug =
    process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

  const expressServer = express();

  expressServer.use(express.static(path.resolve(__dirname, '../renderer')));
  
  if (isDebug){
    var cors = require('cors');
  
    expressServer.use(cors({
      origin: 'http://localhost:1212'
    }));
  
    expressServer.get('/auth*', (_req, _res) => {
      _res.redirect('http://localhost:1212/auth.html');
    });
  }
  
  expressServer.get('/access_gathered', (_req, _res) => {
    _res.status(200);
    _res.send();
  
    console.log("Got access token");
  
    const token = _req.query.access_token as string;
    
    updateAccessToken(token);
  
    updateNotifierToken(appContainer, token);
    updateWindowToken(appContainer, token);
  });
  
  expressServer.listen(1213);

  log("Server started.");
}