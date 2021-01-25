import React, { Component } from 'react';
import { Form, Input, Modal, InputNumber, Message } from 'antd';

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
    },
    colon: false,
};

const withClick = (element, handleClick = () => { }) => {
    return <element.type {...element.props} onClick={handleClick} />;
};

class DropdownValueAdd extends Component {
    state = {
        visible: false,
        inputValue: 'system'
    };

    handleopenClick = () => {
        this.handleInputValueBlur();
        const { parentId } = this.props;
        if (parentId) {
            this.setState({
                visible: true,
            });
        } else {
            Message.info('请选择上级编号！');
        }
        this.props.form.resetFields();
    };

    handleOk = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.handleCancel();
                this.props.onSumit(values);
                this.props.form.resetFields();
            }
        });
    };

    handleCancel = () => {
        this.setState({
            visible: false,
        });
        this.props.form.resetFields();
    };

    handleInputValueFous = () => { // 获取焦点
        this.props.form.setFieldsValue({ dictModule: '' });
    }

    handleInputValueBlur = () => { // 失去焦点
        this.props.form.validateFields((err, values) => {
            const { dictModule } = values;
            if (dictModule) {
                this.setState({ inputValue: dictModule });
            }
            // 失去焦点的时候，判断，输入的值
            // 输入的值为空，则值为system
            if (this.state.inputValue === '' || dictModule === '') {
                this.props.form.setFieldsValue({ dictModule: 'system' });
            }
        });
    }

    render() {
        const { visible } = this.state;
        const { children, title } = this.props;
        const { getFieldDecorator } = this.props.form;
        const required = true;
        return (
            <>
                {withClick(children, this.handleopenClick)}
                <Modal
                    title={title}
                    visible={visible}
                    centered
                    maskClosable={false}
                    onCancel={this.handleCancel}
                    onOk={this.handleOk}
                    width={650}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="字典模块">
                            {getFieldDecorator('dictModule', {
                                rules: [
                                    {
                                        required,
                                        message: '请输入',
                                    },
                                ],
                                initialValue: 'system',
                            })(<Input placeholder="请输入..." onFocus={() => this.handleInputValueFous()} onBlur={() => this.handleInputValueBlur()} allowClear />)}
                        </Form.Item>

                        <Form.Item label="字典类型">
                            {getFieldDecorator('dictType', {
                                initialValue: '',
                                rules: [{
                                    required: true,
                                    message: '请输入正确的字典类型',
                                    pattern: /^([A-Za-z\\.]{2,16})$/,
                                }],
                            })(<Input placeholder="请输入字母类型" allowClear />)}
                        </Form.Item>

                        <Form.Item label="字典代码">
                            {getFieldDecorator('dictCode', {
                                rules: [
                                    {
                                        required,
                                        message: '请输入',
                                    },
                                ],
                            })(<Input placeholder="请输入字典代码" allowClear />)}
                        </Form.Item>

                        <Form.Item label="字典名称">
                            {getFieldDecorator('dictName', {
                                rules: [
                                    {
                                        required,
                                        message: '请输入',
                                    },
                                ],
                            })(<Input placeholder="请输入字典名称" allowClear />)}
                        </Form.Item>

                        <Form.Item label="字典排序">
                            {getFieldDecorator('dictSort', {
                                initialValue: 0,
                            })(<InputNumber style={{ width: '100%' }} placeholder="请输入数字..." />)}
                        </Form.Item>

                        <Form.Item label="字典备注">
                            {getFieldDecorator('dictRemarks', {
                            })(<Input placeholder="请输入字典备注" allowClear />)}
                        </Form.Item>
                    </Form>
                </Modal>
            </>
        );
    }
}
DropdownValueAdd.defaultProps = {
    title: '添加字典',
    record: {
        dictModule: '',
        dictType: '',
        dictCode: '',
        dictName: '',
        dictSort: '',
        dictRemarks: '',
    },
};
export default Form.create()(DropdownValueAdd);
