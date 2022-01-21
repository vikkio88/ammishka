import { useStoreon } from 'storeon/react';
import cx from 'classnames';
import { Spinner } from './components/common';
import { Lobby, Game } from './components/views';



function Main() {
  const { app: { isLoading, isConnected } } = useStoreon('app');
  return (
    <main className={cx({ 'centered': isLoading })}>
      {isLoading && <Spinner />}
      {(!isLoading && !isConnected) && <Lobby />}
      {(!isLoading && isConnected) && <Game />}
    </main>
  );
}

export default Main;
