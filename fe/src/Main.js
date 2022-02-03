import { useStoreon } from 'storeon/react';
import cx from 'classnames';
import { Spinner, Toast, Takeover } from './components/common';
import { Lobby, Room } from './components/views';



function Main() {
  const { app: { isLoading, isConnected }, ui: { takeover, notification } } = useStoreon('app', 'ui');
  const hasTakeover = Boolean(takeover);
  const hasNotification = Boolean(notification);
  return (
    <>
      <main className={cx({ 'centered': isLoading })}>
        {isLoading && <Spinner />}
        {(!isLoading && !isConnected) && <Lobby />}
        {(!isLoading && isConnected) && <Room />}
      </main>
      {hasTakeover && <Takeover {...takeover} />}
      {<Toast show={hasNotification} {...notification} />}
    </>
  );
}

export default Main;
