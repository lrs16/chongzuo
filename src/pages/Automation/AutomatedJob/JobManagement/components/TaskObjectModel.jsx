import React, { useState } from 'react';
import {
    Form,
    Modal,
    Table,
    Badge,
} from 'antd';

const colormap = new Map([
    ['离线', 'default'],
    ['在线', 'success'],
]);

// 克隆子元素按钮，并添加事件
const withClick = (element, handleClick = () => { }) => {
    return <element.type {...element.props} onClick={handleClick} />;
};

function TaskObjectModel(props) {
    const {
        children,
        dispatch,
    } = props;

    const { id } = props.record;
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState([]);

    const handleCancel = () => {
        setVisible(false);
    };

    const handleopenClick = () => {
        setVisible(true);
        dispatch({
            type: 'autotask/findtaskObjectList1',
            payload: {
                taskId: id,
                pageNum: 1,
                pageSize: 15,
            },
        }).then(res => {
            if (res.code === 200) {
                setData(res.data);
            }
        });
    };

    const columns = [
        {
            title: '区域',
            dataIndex: 'agentZone',
            key: 'agentZone',
            width: 120,
        },
        {
            title: '名称',
            dataIndex: 'agentName',
            key: 'agentName',
            width: 250,
            ellipsis: true,
        },
        {
            title: '设备IP',
            dataIndex: 'agentHost',
            key: 'agentHost',
            width: 200,
        },
        {
            title: '协议',
            dataIndex: 'agentHyper',
            key: 'agentHyper',
            width: 80,
        },
        {
            title: '端口',
            dataIndex: 'agentPort',
            key: 'agentPort',
            width: 80,
        },
        {
            title: '类型',
            dataIndex: 'agentType',
            key: 'agentType',
            width: 80,
        },
        {
            title: 'token',
            dataIndex: 'agentToken',
            key: 'agentToken',
            width: 120,
        },
        {
            title: '目录',
            dataIndex: 'agentDeploy',
            key: 'agentDeploy',
            width: 400,
            ellipsis: true,
        },
        {
            title: '状态',
            dataIndex: 'agentStatus',
            key: 'agentStatus',
            width: 80,
            render: (text, record) => (
                <span>
                    <Badge status={colormap.get(record.agentStatus)} text={text} />
                </span>
            ),
        },
        {
            title: '节点地址',
            dataIndex: 'nodeHost',
            key: 'nodeHost',
            width: 120,
        },
        {
            title: '节点端口',
            dataIndex: 'nodePort',
            key: 'nodePort',
            width: 120,
        },
        {
            title: '备注',
            dataIndex: 'agentRemarks',
            key: 'agentRemarks',
            width: 120,
        },
    ];

    return (
        <>
            {withClick(children, handleopenClick)}
            <Modal
                title='作业对象'
                onCancel={() => handleCancel()}
                footer={null}
                visible={visible}
                width="68%"
                centered
                maskClosable
                closable
            >
                <Table
                    dataSource={data.rows}
                    columns={columns}
                    scroll={{ x: 200 }}
                    rowKey={record => record.id}
                    pagination={false}
                />
            </Modal>
        </>
    );
}

export default Form.create({})(TaskObjectModel);