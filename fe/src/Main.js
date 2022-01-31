import { useStoreon } from 'storeon/react';
import cx from 'classnames';
import { Spinner } from './components/common';
import { Lobby, Game, Takeover } from './components/views';



function Main() {
  const { app: { isLoading, isConnected }, ui: { takeover } } = useStoreon('app', 'ui');
  const hasTakeover = Boolean(takeover);
  return (
    <>
      <main className={cx({ 'centered': isLoading })}>
        {isLoading && <Spinner />}
        {(!isLoading && !isConnected) && <Lobby />}
        {(!isLoading && isConnected) && <Game />}
      </main>
      {hasTakeover && <Takeover {...takeover} />}
    </>
  );
}

export default Main;
