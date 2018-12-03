import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { RootState } from 'app/reducers';
import { Upload, Icon, Input, Button } from 'antd';
import classNames from 'classnames';
import './edit-form.less';
import { currentFee, getOracleInfoDataFields, IOracleInfo } from 'app/services/dataTransactionService';
import { UploadFile } from 'antd/lib/upload/interface';
import { assocPath, equals, path } from 'ramda';
import { FORM } from 'app/containers/OracleInfo/edit/oracleEditForm';
import { ORACLE_STATUS } from 'app/models';

const ORACLE_INFO_KEYS = ['name', 'site', 'mail', 'logo', 'description'] as Array<keyof IOracleInfo>;

export namespace OracleInfo {
    export interface Props {
        user: RootState.UserState;
        assets: RootState.AssetsState;
        actions: null;
        oracleInfo: RootState.OracleInfoState;
    }
}

@connect(
    (state: RootState): Pick<OracleInfo.Props, 'user' & 'oracleInfo'> => {
        return { user: state.user, oracleInfo: state.oracleInfo };
    },
    (dispatch: Dispatch): Pick<OracleInfo.Props, 'actions'> => ({
        actions: null
    })
)
export class OracleInfo extends React.Component<OracleInfo.Props, TState> {

    static defaultProps: Partial<OracleInfo.Props> = {};

    state = {
        fileList: [],
        oracleInfo: Object.create(null),
        diff: Object.create(null)
    };

    handleChange = ({ fileList }: { fileList: Array<UploadFile> }) => {
        const logo = fileList.length ? fileList[0].thumbUrl : '';
        const oracleInfo = { ...this.state.oracleInfo, logo };
        this.setState({ fileList, oracleInfo });
    };

    render() {
        const className = classNames('border-round');

        const addLogoButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">Upload</div>
            </div>
        );

        return (
            <div>
                <h1>Create an oracle</h1>
                <div className="clearfix">
                    <Upload
                        className={className}
                        listType="picture-card"
                        fileList={this.state.fileList}
                        beforeUpload={() => false}
                        onChange={this.handleChange}
                        showUploadList={{ showPreviewIcon: false }}
                    >
                        {!this.state.fileList.length ? addLogoButton : null}
                    </Upload>
                </div>
                <div className={'row'}>
                    <span>Address</span>
                    <Input readOnly={true} value={this.props.user.address}/>
                </div>
                {FORM.map((item, index) => {
                    const Tag = item.tag;

                    const onChange = (event: Event) => {
                        const { value } = event.target as HTMLInputElement;
                        const info = assocPath(item.field.split('.'), value, this.state.oracleInfo);
                        this.setState({
                            oracleInfo: info
                        });

                    };

                    const value = path(item.field.split('.'), this.state.oracleInfo);

                    return (
                        <div key={index} className={'row'}>
                            <span>{item.title}</span>
                            <Tag value={value} onChange={onChange}/>
                        </div>
                    );
                })}

                <Fee {...this.state}/>

                <Button type="primary">Cancel</Button>
                <Button type="primary" disabled={!Object.keys(this.state.diff).length}>Save</Button>
            </div>
        );
    }

    static getDerivedStateFromProps(nextProps: OracleInfo.Props, nextState: TState) {
        if (!nextState.lastPropsStatus || nextProps.oracleInfo.status !== nextState.lastPropsStatus) {
            nextState.lastPropsStatus = nextProps.oracleInfo.status;
            ORACLE_INFO_KEYS.forEach(key => {
                nextState.oracleInfo[key] = nextProps.oracleInfo[key];
            });
            if (nextState.oracleInfo.logo) {
                nextState.fileList = [
                    {
                        uid: `t-${Date.now()}`,
                        thumbUrl: nextState.oracleInfo.logo
                    }
                ];
            }
        }

        ORACLE_INFO_KEYS.forEach(key => {
            if (equals(nextState.oracleInfo[key], nextProps.oracleInfo[key])) {
                delete nextState.diff[key];
            } else {
                nextState.diff[key] = nextState.oracleInfo[key];
            }
        });

        return nextState;
    }
}

const Fee: React.StatelessComponent<TState> = params => {
    const fields = getOracleInfoDataFields(params.diff);
    const fee = fields.length ? Number(currentFee(fields)) / Math.pow(10, 8) : 0;
    return <span>Fee {fee}</span>;
};

type TState = {
    oracleInfo: Partial<IOracleInfo>;
    fileList: Array<Partial<UploadFile>>;
    lastPropsStatus?: ORACLE_STATUS;
    diff: Partial<IOracleInfo>;
};
