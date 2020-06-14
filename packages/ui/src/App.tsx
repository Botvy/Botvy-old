import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import Initializator from './components/Initializator';
import { IRootState } from './store/IRootState';

const StyledApp = styled.div`
    font-family: Helvetica, Arial, serif;
    background-color: ${(props) => props.theme.color.background};
    color: ${(props) => props.theme.color.foreground};
    width: 100vw;
    height: 100vh;
`;

interface IAppProps {
    initializing: boolean;
}

export const App: React.FC<IAppProps> = (props) => {
    if (props.initializing) {
        return <Initializator/>;
    }

    return <StyledApp>Hello world!</StyledApp>;
};

const mapStateToProps = (state: IRootState): IAppProps => ({
    initializing: state.initialization.initializing,
});

export default connect(mapStateToProps)(App);
