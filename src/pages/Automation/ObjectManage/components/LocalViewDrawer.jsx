import React, { useState } from 'react';
import {
    Radio, Form, Input, Drawer
} from 'antd';

const { TextArea } = Input;
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

// 克隆子元素按钮，并添加事件
const withClick = (element, handleClick = () => { }) => {
    return <element.type {...element.props} onClick={handleClick} />;
};

function LocalViewDrawer(props) {
    const [visible, setVisible] = useState(false);
    const {
        children,
        record
    } = props;

    const handleCancel = () => {
        setVisible(false);
    };

    const handleopenClick = () => {
        setVisible(true);
    };

    return (
        <>
            {withClick(children, handleopenClick)}
            <Drawer
                title='脚本详情'
                onClose={() => handleCancel()}
                footer={null}
                visible={visible}
                width={1000}
                destroyOnClose
            >
                <Form {...formItemLayout}>
                    <Form.Item label="脚本名称" >
                        <Input defaultValue={record.scriptName} disabled />
                    </Form.Item>
                    <Form.Item label="脚本来源">
                        <Radio.Group value={record.scriptSource} disabled>
                            <Radio value='手动输入'>手动输入</Radio>
                            <Radio value='本地上传'>本地上传</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="脚本类型">
                        <Radio.Group value={record.scriptType} disabled>
                            <Radio value={record.scriptType}>{record.scriptType}</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="脚本内容">
                        <TextArea autoSize={{ minRows: 30 }} defaultValue={record.scriptCont} disabled />
                    </Form.Item>
                    <Form.Item label="脚本备注">
                        <TextArea autoSize={{ minRows: 3 }} defaultValue={record.scriptCont} disabled />
                    </Form.Item>
                    <Form.Item label="脚本文件大小">
                        <Input defaultValue={record.scriptArgs} disabled />
                    </Form.Item>
                    <Form.Item label="上传时间">
                        <Input defaultValue={record.director} disabled />
                    </Form.Item>
                    <Form.Item label="上传人">
                        <Input defaultValue={record.scriptSorts} disabled />
                    </Form.Item>
                </Form>
            </Drawer>
        </>
    );
}
export default Form.create({})(LocalViewDrawer);
