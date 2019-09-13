import Refresh from 'react-refresh/runtime';

function enqueueUpdate(): void {
  let refreshTimeout: ReturnType<typeof setTimeout> | undefined = undefined;

  function _execute() {
    if (refreshTimeout === undefined) {
      refreshTimeout = setTimeout(() => {
        refreshTimeout = undefined;
        Refresh.performReactRefresh();
      }, 30);
    }
  }

  return _execute();
}

export default enqueueUpdate;
