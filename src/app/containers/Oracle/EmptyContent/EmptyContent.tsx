import * as React from 'react';
import {Link} from 'react-router-dom';
import {Layout} from 'antd';
import './emptyContent.less';

const {Content} = Layout;

export const EmptyContent: React.StatelessComponent<{ onClick: () => any }> = (props) => {

    return (
        <Layout className="empty-content-layout center">
            <Content className="content">
                <div className="flex flex-col flex-center-h centering">
                    <div className="oracle-icon margin3"></div>
                    <h1 className="margin3 basic800">Data about your Oracle was not found in the library</h1>
                    <Link className="ant-btn ant-btn-primary ant-btn-lg" to='/oracle/create' onClick={props.onClick}>
                        Create an oracle
                    </Link>
                </div>
            </Content>
        </Layout>
    );
};
