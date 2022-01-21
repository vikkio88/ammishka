import { createStoreon } from 'storeon';

import app from './modules/app';
import game from './modules/game';

export const store = createStoreon([app, game]);
