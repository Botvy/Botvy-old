import React from 'react';
import Loader from 'react-loader-spinner';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { IRootState } from '../store/IRootState';

const StyledInitializator = styled.div`
    font-family: Helvetica, Arial, serif;
    width: 100vw;
    height: 100vh;
    background-color: #121212;
    flex-direction: column;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const StyledStep = styled.div`
    font-size: 2rem;
`;

const StyledError = styled(StyledStep)`
    color: ${props => props.theme.color.error};
`;

const StyledSubStep = styled.div`
    font-size: 1rem;
`;

interface IInitializatorProps {
    error?: string;
    step?: string;
    subStep?: string;
}

export const Initializator: React.FC<IInitializatorProps> = (props) => {
    return <StyledInitializator>
        <Loader type='Oval' color="#FFF" height={80} width={80}/>
        {props.step && <StyledStep>{props.step}</StyledStep>}
        {props.subStep && <StyledSubStep>{props.subStep}</StyledSubStep>}
        {props.error && <StyledError>Error: {props.error}</StyledError>}
    </StyledInitializator>;
};

const mapStateToProps = (state: IRootState): IInitializatorProps => ({
    error: state.initialization.error,
    step: state.initialization.step,
    subStep: state.initialization.subStep,
});

export default connect(mapStateToProps)(Initializator);
