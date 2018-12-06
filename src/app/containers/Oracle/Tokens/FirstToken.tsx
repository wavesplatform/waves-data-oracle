import * as React from 'react';
import { Row } from 'antd';
import { Link } from 'react-router-dom';


const FirstToken: React.StatelessComponent = () => {
    return <div>
        <Row>Icon</Row>
        <Row>Verify your first token</Row>
        <Row>Now verification of tokens is available to you. Click Add Token to continue.</Row>
        <Row>
            <Link to="/oracle/tokens/create"/>
        </Row>
    </div>;
};

export default FirstToken;
