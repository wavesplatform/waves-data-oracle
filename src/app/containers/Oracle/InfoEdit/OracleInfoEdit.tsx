import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { RootState } from 'app/reducers';
import { Button, Icon, Layout, notification, Spin } from 'antd';
import '../../../components/imageUpload/edit-form.less';
import { EmptyContent } from '../EmptyContent/EmptyContent';
import { currentFee } from 'app/services/dataTransactionService';
import * as OracleData from '@waves/oracle-data';
import { FORM_FIELDS } from 'app/containers/Oracle/InfoEdit/oracleEditForm';
import { ORACLE_SAVE_STATUS, ORACLE_STATUS } from 'app/models';
import { Form } from 'app/components/form/Form2';
import { OracleInfoActions } from 'app/actions';
import { If } from 'app/components';
import { omit } from 'app/utils';
import { RightSider } from 'app/components/RightSide/RightSider';
import { RouteComponentProps } from 'react-router';
import * as AboutData from './info.json';


const { Content } = Layout;

@connect(
    (state: RootState): Pick<OracleInfo.IProps, 'user' & 'oracleInfo'> => {
        return { user: state.user, oracleInfo: state.oracleInfo };
    },
    (dispatch: Dispatch): Pick<OracleInfo.IProps, 'actions'> => ({
        actions: bindActionCreators(omit({ ...OracleInfoActions }, 'Type'), dispatch)
    })
)
export class OracleInfo extends React.Component<OracleInfo.IProps, OracleInfo.IState> {

    static defaultProps: Partial<OracleInfo.IProps> = {};

    state = {
        isValid: false,
        oracleInfo: Object.create(null),
        diff: Object.create(null),
        hideEmpty: false
    };

    render() {
        const disableSave = !Object.keys(this.state.diff).length || !this.state.isValid;
        const hideEmpty = this.state.hideEmpty;

        if (!hideEmpty && this.props.oracleInfo.status === ORACLE_STATUS.EMPTY) {
            return <EmptyContent onClick={() => this.setState({ hideEmpty: true })}/>;
        }

        const spinning = this.props.oracleInfo.saveStatus === ORACLE_SAVE_STATUS.LOADING;

        return (
            <Layout>
                <Content className="padding-layout">
                    <Spin className="formSpinner"
                          spinning={spinning}
                          indicator={<Icon type="loading" style={{ fontSize: 24 }} spin/>}
                    >
                        <h2 className='margin2'>Create an oracle</h2>

                        <Form fields={FORM_FIELDS}
                              values={{ ...this.state.oracleInfo, address: this.props.user.address }}
                              readonly={{ address: true }}
                              onChange={this._onChangeForm}/>

                        <div className='block basic400'>
                            <Fee {...this.state}/>
                        </div>

                        <div className="buttons-wrapper margin-top3">
                            <Button type="primary"
                                    htmlType="button"
                                    onClick={this._saveOracleHandler}
                                    disabled={disableSave}>Save</Button>
                        </div>

                        <If condition={this.props.oracleInfo.saveStatus === ORACLE_SAVE_STATUS.SERVER_ERROR}>
                            <span>Error!</span>
                        </If>
                    </Spin>
                </Content>
                <RightSider data={AboutData}/>
            </Layout>
        );
    }

    private _saveOracleHandler = () => {
        this.props.actions.saveOracleInfo({ diff: this.state.diff, oracleInfo: this.state.oracleInfo });
    };

    private _onChangeForm = (data: Form.IChange<OracleData.IProviderData>) => {
        this.setState({ oracleInfo: data.values, isValid: data.isValid });
    };

    static sendMessages(nextProps: OracleInfo.IProps) {
        const { saveStatus } = nextProps.oracleInfo;

        if (saveStatus === ORACLE_SAVE_STATUS.READY) {
            notification.success({
                message: 'Oracle data saved',
                key: saveStatus
            });

            nextProps.actions.setOracleSaveStatus(null);
        }

        if (saveStatus === ORACLE_SAVE_STATUS.SERVER_ERROR) {
            notification.error({
                message: 'Save Oracle data error',
                key: saveStatus
            });

            nextProps.actions.setOracleSaveStatus(null);
        }
    }

    static getDerivedStateFromProps(props: OracleInfo.IProps, state: OracleInfo.IState) {
        const { saveStatus } = props.oracleInfo;

        state = { ...state, saveStatus };

        if (!state.lastPropsStatus || props.oracleInfo.status !== state.lastPropsStatus) {
            state.lastPropsStatus = props.oracleInfo.status;
            state.oracleInfo = { ...state.oracleInfo, ...props.oracleInfo.content };
        }

        try {
            if (props.oracleInfo.status === ORACLE_STATUS.EMPTY) {
                state.diff = OracleData.getFields(state.oracleInfo as any);
            } else {
                state.diff = OracleData.getDifferenceByData(props.oracleInfo.content as any, state.oracleInfo);
            }
        } catch (e) {
            state.diff = Object.create(null);
        }
        
        OracleInfo.sendMessages(props);

        return state;
    }
}

const Fee: React.StatelessComponent<OracleInfo.IState> = params => {
    if (!params.isValid) {
        return <span>Fee 0 WAVES</span>;
    }

    try {
        const fee = params.diff.length ? Number(currentFee(params.diff)) / Math.pow(10, 8) : 0;
        return <span>Fee {fee} WAVES</span>;
    } catch (e) {
        return <span>Fee 0 WAVES</span>;
    }
};

export namespace OracleInfo {

    export interface IProps extends RouteComponentProps {
        user: RootState.UserState;
        actions: OracleInfoActions;
        oracleInfo: RootState.OracleInfoState;
    }

    export interface IState {
        isValid: boolean;
        oracleInfo: Partial<OracleData.IProviderData>;
        lastPropsStatus?: ORACLE_STATUS;
        diff: Array<OracleData.TDataTxField>;
        saveStatus?: ORACLE_SAVE_STATUS | null;
        hideEmpty?: boolean;
    }
}
