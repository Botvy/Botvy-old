import React from 'react';
import { connect } from 'react-redux';
import { DefaultTheme, ThemeProvider } from 'styled-components';

import { IRootState } from '../store/IRootState';

export const ConnectedThemeProvider: React.FC<DefaultTheme> = (props) => (
    <ThemeProvider theme={props}>{props.children}</ThemeProvider>
);

const mapStateToProps = (state: IRootState): DefaultTheme => state.theme;

export default connect(mapStateToProps)(ConnectedThemeProvider);
