import { Button, Icon, Layout, Spin } from 'antd';
import { Form } from 'app/components/form/Form';
import { If } from 'app/components';
import * as React from 'react';
import { TOKEN_FORM_FIELDS } from 'app/containers/Oracle/Tokens/Edit/tokenForm';
import { RootState } from 'app/reducers';
import { currentFee, getAssetFields, IAssetInfo } from 'app/services/dataTransactionService';
import { RouteComponentProps } from 'react-router';
import { find, propEq } from 'ramda';


const { Content } = Layout;

export class TokenEdit extends React.Component<TokenEdit.IProps, TokenEdit.IState> {

    constructor(props: TokenEdit.IProps) {
        super(props);

        const { assetId } = props.match.params;
        const isNew = assetId === 'create';

        const asset = !isNew && find(propEq('id', assetId), this.props.tokens.content);

        if (!isNew && !asset) {
            throw new Error('Add 404 error!'); //TODO 404
        }

        this.state = {
            isNew,
            diff: Object.create(null),
            isValid: false,
            token: asset || Object.create(null)
        };
    }

    public render() {

        const spinning = false;
        const hasError = false;

        const { isValid } = this.state;

        return (
            <Layout style={{ backgroundColor: '#fff', height: '100%' }}>
                <Spin style={{ height: '100%' }}
                      spinning={spinning}
                      indicator={<Icon type="loading" style={{ fontSize: 24 }} spin/>}
                >
                    <Content style={{ margin: '20px', minWidth: '450px' }}>
                        <h1>Create an oracle</h1>

                        <Form fields={TOKEN_FORM_FIELDS}
                              values={{}}
                              readonly={{ name: true, id: true }}
                              onChange={this._onChangeForm}/>

                        <Fee {...this.state}/>

                        <Button type="primary">Cancel</Button>
                        <Button type="primary"
                                onClick={this._saveOracleHandler}
                                disabled={!isValid}>Save</Button>
                        <If condition={hasError}>
                            <span>Error!</span>
                        </If>
                    </Content>
                </Spin>
            </Layout>
        );
    }

    private _onChangeForm = () => {

    };

    private _saveOracleHandler = () => {

    };

}

const Fee: React.StatelessComponent<TokenEdit.IState> = params => {
    if (!params.isValid) {
        return <span>Fee 0 WAVES</span>;
    }

    const fields = getAssetFields({ ...params.diff, id: params.token.id || '' });
    try {
        const fee = fields.length ? Number(currentFee(fields)) / Math.pow(10, 8) : 0;
        return <span>Fee {fee} WAVES</span>;
    } catch (e) {
        return <span>Fee 0 WAVES</span>;
    }
};


export namespace TokenEdit {

    export interface IProps extends RouteComponentProps<{ assetId: string }> {
        tokens: RootState.TokensState;
    }

    export interface IState {
        isNew: boolean;
        isValid: boolean;
        token: Partial<IAssetInfo>;
        diff: Partial<IAssetInfo>;
    }
}
