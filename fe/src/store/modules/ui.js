import a from '../actions';
const INITIAL_UI_STATE = {
    ui: {
        error: null,
        takeover: null,
        notification: null
        // maybe move isLoading from app
    },
};

const ui = store => {
    store.on(a.INIT, () => ({ ...INITIAL_UI_STATE }));

    store.on(a.UI.TAKEOVER.SHOW, ({ ui }, { title = null, content, type = null, timeout = 3000 } = {}) => {
        setTimeout(() => store.dispatch(a.UI.TAKEOVER.HIDE), timeout);
        return {
            ui: {
                ...ui,
                takeover: {
                    title, content, type
                }
            }
        };
    });

    store.on(a.UI.TAKEOVER.HIDE, ({ ui }) => {
        return {
            ui: {
                ...ui,
                takeover: null
            }
        };
    });
};

export default ui;