import * as React from 'react';
import { Row, Col, Avatar, Divider } from 'antd';
import { TokenModel } from 'app/models';

export namespace TokensRow {
    export interface Props {
        token: TokenModel;
        onSelect: (tokenId: string) => void;
    }
}


const TokensRow: React.StatelessComponent<TokensRow.Props> = (props) => {

    const onSelect = () => props.onSelect(props.token.content.id);
    const { id, status, name, site, logo, ticker, description } = props.token.content;
    return (
        <Row onClick={onSelect} justify="space-between" type="flex" align="middle">
            <Divider/>

            <Col span={2}>
                <Avatar src={logo || ''} icon="picture" size={40}/>
            </Col>
            <Col span={5}>
                <div>{name}</div>
                <div>{id}</div>
            </Col>
            <Col span={4}>
                <div>{ticker}</div>
            </Col>
            <Col span={3}>
                <div>{status}</div>
            </Col>
            <Col span={4}>
                <div>{site}</div>
            </Col>
            <Col span={6}>
                <div>{description && description.en}</div>
            </Col>
        </Row>
    );
};

export default TokensRow;
