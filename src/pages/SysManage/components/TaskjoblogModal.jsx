import React, { useState } from 'react';
import { connect } from 'dva';
import {
    Form,
    Modal,
    Descriptions
} from 'antd';

// 克隆子元素按钮，并添加事件
const withClick = (element, handleClick = () => { }) => {
    return <element.type {...element.props} onClick={handleClick} />;
};

function TaskjoblogModal(props) {
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
            <Modal
                title='任务详细'
                onCancel={() => handleCancel()}
                footer={null}
                visible={visible}
                width={700}
                centered
                maskClosable
                closable
            >
                <div style={{ marginLeft: 50, marginTop: 5 }}>
                    <Descriptions column={2}>
                        <Descriptions.Item label="任务编号">{record.jobId}</Descriptions.Item>
                        <Descriptions.Item label="任务分组">{record.jobGroup}</Descriptions.Item>
                        <Descriptions.Item label="任务名称">{record.jobName}</Descriptions.Item>
                        <Descriptions.Item label="创建时间">{record.createTime}</Descriptions.Item>
                        <Descriptions.Item label="cron表达式">{record.cronExpression}</Descriptions.Item>
                        <Descriptions.Item label="下次执行时间">{record.updateTime}</Descriptions.Item>
                        <Descriptions.Item label="调用目标方法" span={2}>{record.invokeTarget}</Descriptions.Item>
                        <Descriptions.Item label="任务状态" >{record.statusExt}</Descriptions.Item>
                        <Descriptions.Item label="是否并发">{record.concurrentExt}</Descriptions.Item>
                        <Descriptions.Item label="执行策略">{record.misfirePolicyExt}</Descriptions.Item>
                    </Descriptions>
                </div>
            </Modal>
        </>
    );
}
export default Form.create({})(
    connect()(TaskjoblogModal),
);
