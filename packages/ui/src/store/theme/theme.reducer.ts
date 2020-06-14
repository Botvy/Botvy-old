import { ITheme } from '@botvy/framework/dist/theming/ITheme';
import { AnyAction } from 'redux';

import { SET_THEME } from './theme.actions';

const initialState: ITheme = {
    color: {
        background: 'white',
        foreground: 'black',
        error: 'red',
    },
};

export const ThemeReducer = (
    state: ITheme | undefined,
    action: AnyAction,
): ITheme => {
    if (state === undefined) {
        return initialState;
    }

    switch (action.type) {
        case SET_THEME:
            return action.theme;
    }

    return state;
};
