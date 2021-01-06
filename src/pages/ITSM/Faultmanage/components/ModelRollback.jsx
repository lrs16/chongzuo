import React, { useState } from 'react';
import {
    Modal,
    Form,
    Input,
    Row,
    Col
} from 'antd';

const { TextArea } = Input;

const withClick = (element, handleClick = () => { }) => {
    return <element.type {...element.props} onClick={handleClick} />;
}
function ModelRollback(props) {
    const [visible, setVisible] = useState(false);
    const required = true;
    const {
        form: { getFieldDecorator, validateFields, resetFields },
        title,
        children,
    } = props;

    const handleopenClick = () => {
        setVisible(true);
    }


    const handleCancel = () => {
        setVisible(false);
    }

    const handleOk = () => {
        validateFields((err, values) => {
            if (!err) {
                handleCancel();
                props.rollbackSubmit(values);
                resetFields();
            }
        })
    }




    return (
        <>
            {withClick(children, handleopenClick)}
            <Modal
                visible={visible}
                maskClosable={false}
                width={650}
                title={title}
                checkable
                onCancel={handleCancel}
                onOk={handleOk}
            >
                <Row gutter={16}>
                    <Form>
                        <Col span={24}>
                            <Form.Item label='回退意见'>
                                {
                                    getFieldDecorator('rollbackOpinion', {
                                        rules: [
                                            {
                                                required,
                                                message: '请说明回退原因'
                                            }
                                        ]
                                    })(<TextArea rows={8} />)
                                }

                            </Form.Item>
                        </Col>
                    </Form>
                </Row>

            </Modal>

        </>
    )
}

export default Form.create()(ModelRollback)
