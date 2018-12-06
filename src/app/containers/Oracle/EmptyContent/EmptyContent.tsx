import * as React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from 'antd';

const { Content } = Layout;

export const EmptyContent: React.StatelessComponent = (props) => {
    
    return (
        <Layout>
            <Content>
                <div>Data about your Oracle was not found in the library</div>
                <Link to='/oracle/create'>
                    Create oracle!
                </Link>
            </Content>
        </Layout>
    );
};

