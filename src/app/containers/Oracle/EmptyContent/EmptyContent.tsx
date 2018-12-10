import * as React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from 'antd';

const { Content } = Layout;

export const EmptyContent: React.StatelessComponent<{onClick: () => any}> = (props) => {
    
    return (
        <Layout style={{height: "100%", backgroundColor: "#fff"}}>
            <Content>
                <div>Data about your Oracle was not found in the library</div>
                <Link to='/oracle/create' onClick={props.onClick}>
                    Create oracle!
                </Link>
            </Content>
        </Layout>
    );
};

