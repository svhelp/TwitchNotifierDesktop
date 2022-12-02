import { setAuthToken } from 'components/logic/slice';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from '../components/App';
import { store } from './store';

const container = document.getElementById('root')!;
const root = createRoot(container);

const token = window.electron.store.get<string>('accessToken');
store.dispatch(setAuthToken(token));

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

// // calling IPC exposed from preload script
// window.electron.ipcRenderer.once('ipc-example', (arg) => {
//   // eslint-disable-next-line no-console
//   console.log(arg);
// });
// window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);
