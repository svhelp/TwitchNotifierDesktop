import { setAuthToken } from 'components/logic/slice';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from '../components/App';
import { store } from './store';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

window.electron.ipcRenderer.sendMessage('request_token', []);
window.electron.ipcRenderer.on('token_updated', (arg) => {
  if (!arg){
    return;
  }

  store.dispatch(setAuthToken(arg as string));
});
