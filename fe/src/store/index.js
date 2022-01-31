import { createStoreon } from 'storeon';

import app from './modules/app';
import ui from './modules/ui';
import game from './modules/game';

export const store = createStoreon([app, ui, game]);
