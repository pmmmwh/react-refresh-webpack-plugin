import Refresh from 'react-refresh/runtime';

let refreshTimeout: ReturnType<typeof setTimeout> | undefined = undefined;

const enqueueUpdate = () => {
  if (refreshTimeout === undefined) {
    refreshTimeout = setTimeout(() => {
      refreshTimeout = undefined;
      Refresh.performReactRefresh();
    }, 30);
  }
};

export default enqueueUpdate;
