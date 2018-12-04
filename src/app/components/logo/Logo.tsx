import * as React from 'react';
import { UploadFile } from 'antd/es/upload/interface';
import { Icon, Upload } from 'antd';


export class Logo extends React.PureComponent<Logo.IProps, Logo.IState> {

    state = {
        fileList: [],
        errors: []
    };

    private _handleChange = ({ fileList }: { fileList: Array<UploadFile> }) => {
        if (!fileList.length) {
            this.props.onChange(null);
            this.setState({ fileList: [] });
            return null;
        }

        const errors = [this.props.validate(fileList[0].originFileObj as File)]
            .filter(Boolean) as Array<string>;

        if (errors.length) {
            this.setState({ errors });
            return null;
        }

        const reader = new FileReader();
        reader.onload = () => {
            this.props.onChange(reader.result as string);
        };
        reader.readAsDataURL(fileList[0].originFileObj as File);
        this.setState({ fileList });
    };

    public render() {
        const addLogoButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">Upload</div>
            </div>
        );

        return (
            <div className={'logo'}>
                <Upload
                    accept={'image/*'}
                    className={'border-round'}
                    listType="picture-card"
                    fileList={this.state.fileList}
                    beforeUpload={() => false}
                    onChange={this._handleChange}
                    showUploadList={{ showPreviewIcon: false }}
                >
                    {!this.state.fileList.length ? addLogoButton : null}
                </Upload>
            </div>
        );
    }

    static getDerivedStateFromProps(props: Logo.IProps, state: Logo.IState): Logo.IState {
        if (props.value) {
            state = {
                ...state, fileList: [
                    {
                        uid: `t-${Date.now()}`,
                        thumbUrl: props.value
                    }
                ]
            };
        }

        return state;
    }

    static validators: Logo.IValidators = {
        size: size => file => file.size > size ? 'Превышен максимальный размер картинки!' : null
    };

}

export namespace Logo {

    export interface IProps {
        onChange: ICallback<string | null, void>;
        validate: ICallback<File, string | null>;
        value: string | null;
    }

    export interface IState {
        fileList: Array<Partial<UploadFile>>;
        errors: Array<string>;
    }

    export interface IValidators {
        size(size: number): ICallback<File, string | null>;
    }

}
