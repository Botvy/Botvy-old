import { ITheme } from '@botvy/framework/dist/theming/ITheme';
import { AnyAction } from 'redux';

export const SET_BACKGROUNDCOLOR = 'botvy/theme/SET_BACKGROUNDCOLOR';
export const SET_THEME = 'botvy/theme/SET_THEME';

export const setBackgroundColor = (color: string): AnyAction => ({
    type: SET_BACKGROUNDCOLOR,
    color,
});

export const setTheme = (theme: ITheme): AnyAction => ({
    type: SET_THEME,
    theme,
});
