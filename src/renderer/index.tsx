import { setAuthToken } from './logic/slice';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './components/App';
import { store } from 'renderer/store';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

const onTokenUpdated = (token?: string) => {
  if (!token){
    return;
  }

  store.dispatch(setAuthToken(token));
}

window.electron.ipcRenderer.invoke('request_token', [])
  .then(arg => onTokenUpdated(arg as string));

window.electron.ipcRenderer
  .on('token_updated', arg => onTokenUpdated(arg as string));
