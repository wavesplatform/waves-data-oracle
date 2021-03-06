import { Button, Icon, Layout, notification, Spin } from 'antd';
import { Form } from 'app/components/form/Form2';
import { If } from 'app/components';
import * as React from 'react';
import { getTokenFormFields } from 'app/containers/Oracle/Tokens/Edit/tokenForm';
import { RootState } from 'app/reducers';
import { currentFee } from 'app/services/dataTransactionService';
import { RouteComponentProps } from 'react-router';
import { find, pathEq } from 'ramda';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { omit } from 'app/utils';
import { OracleTokensActions } from 'app/actions';
import { RightSider } from 'app/components/RightSide/RightSider';
import * as InfoData from './info.json';
import { TOKEN_SAVE_STATUS } from 'app/models';
import * as OracleData from '@waves/oracle-data';

const { Content } = Layout;

@connect(
    (state: RootState): Pick<TokenEdit.IProps, 'user' & 'tokens' & 'nodeTokens'> => {
        return { user: state.user, tokens: state.tokens, nodeTokens: state.nodeTokens };
    },
    (dispatch: Dispatch): Pick<TokenEdit.IProps, 'actions'> => ({
        actions: bindActionCreators(omit({ ...OracleTokensActions }, 'Type'), dispatch)
    })
)
export class TokenEdit extends React.Component<TokenEdit.IProps, TokenEdit.IState> {

    private readonly asset: Partial<OracleData.TProviderAsset & { name: string }>;
    private goBackHandler = () => this.props.history.goBack();
    
    constructor(props: TokenEdit.IProps) {
        super(props);

        const { assetId } = props.match.params;
        const isNew = assetId === 'create';

        const { content } = !isNew && find(pathEq(['content', 'id'], assetId), props.tokens.content) || Object.create(null);

        this.asset = { ...content };

        this.state = {
            isValid: true,
            isNew,
            token: { ...content },
            diff: []
        };
    }

    public render() {
        const { tokens } = this.props;
        const spinning = tokens.saveStatus === TOKEN_SAVE_STATUS.LOADING;
        const hasError = false;
        const { server } = this.props.user;
        const { isValid, isNew } = this.state;

        const configData = { isNew, server, tokens, status: this.state.token.status  };
        
        return (
            <Layout>
                <Content className="padding-layout">
                    <Spin spinning={spinning}
                          indicator={<Icon type="loading" style={{ fontSize: 24 }} spin/>}>
                        <h2 className="margin2">{ isNew ? 'Create token info' : 'Edit token info' }</h2>

                        <Form fields={getTokenFormFields(configData) as any}
                              values={this.state.token}
                              readonly={{ name: true, id: !isNew }}
                              onChange={this._onChangeForm}/>

                        <div className='block margin-top3 basic400'>
                        <Fee {...this.state}/>
                            </div>

                        <div className="buttons-wrapper margin-top3">
                            <Button type="ghost"
                                    onClick={this.goBackHandler}>Cancel</Button>
                            <Button type="primary"
                                    onClick={this._saveTokenHandler}
                                    disabled={!isValid || this.state.diff.length === 0}>Save</Button>
                        </div>
                        <If condition={hasError}>
                            <span>Error!</span>
                        </If>
                    </Spin>
                </Content>
                <RightSider data={InfoData}/>
            </Layout>
        );
    }

    private _onChangeForm = (data: Form.IChange<Partial<OracleData.TProviderAsset & { name?: string }>>) => {
        let diff = [] as any;
        if (!this.state.isNew) {
            diff = OracleData.getDifferenceByData(this.asset as any, data.values);
        } else {
            diff = OracleData.getFields(data.values as any);
        }
        
        const { isValid } = data;
        
        this.setState({ token: data.values, diff, isValid });
    };
    
    private _saveTokenHandler = () => {
        this.props.actions.saveToken({ diff: this.state.diff, token: this.state.token });
    };
    
    static sendMessages(nextProps: TokenEdit.IProps) {
        const { saveStatus } = nextProps.tokens;
        
        if (saveStatus === TOKEN_SAVE_STATUS.READY) {
            notification.success({
                message: 'Token data saved',
                key: saveStatus
            });
    
            nextProps.actions.setSaveTokenStatus(null);
        }
    
        if (saveStatus === TOKEN_SAVE_STATUS.SERVER_ERROR) {
            notification.error({
                message: 'Save Token data error',
                key: saveStatus
            });
    
            nextProps.actions.setSaveTokenStatus(null);
        }
    }

    static getDerivedStateFromProps(props: TokenEdit.IProps, state: TokenEdit.IState) {
    
        if (state.token.id && !props.nodeTokens[state.token.id]) {
            props.actions.getTokenName(state.token.id);
            state.token.name = '';
        } else if (state.token.id && props.nodeTokens[state.token.id]) {
            state.token.name = props.nodeTokens[state.token.id].name;
        } else {
            state.token.name = '';
        }
        
        TokenEdit.sendMessages(props);
        
        return state;
    }
}

const Fee: React.StatelessComponent<TokenEdit.IState> = params => {
    if (!params.isValid || !params.token) {
        return <span>Fee 0 WAVES</span>;
    }

    try {
        const fee = params.diff.length ? Number(currentFee(params.diff)) / Math.pow(10, 8) : 0;
        return <span>Fee {fee} WAVES</span>;
    } catch (e) {
        return <span>Fee 0 WAVES</span>;
    }
};


export namespace TokenEdit {

    export interface IProps extends RouteComponentProps<{ assetId: string }> {
        tokens: RootState.TokensState;
        user: RootState.UserState;
        actions: OracleTokensActions;
        nodeTokens: RootState.NodeTokensState;
    }

    export interface IState {
        isNew: boolean;
        isValid: boolean;
        token: Partial<OracleData.TProviderAsset & { name?: string }>;
        diff: Array<OracleData.TDataTxField>;
    }
}
