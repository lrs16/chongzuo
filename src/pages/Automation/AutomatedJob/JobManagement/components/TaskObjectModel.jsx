import React, { useState } from 'react';
import { connect } from 'dva';
import {
    Form,
    Modal,
    Table,
} from 'antd';

// 克隆子元素按钮，并添加事件
const withClick = (element, handleClick = () => { }) => {
    return <element.type {...element.props} onClick={handleClick} />;
};

function TaskObjectModel(props) {
    const {
        children,
        // dispatch,
        // record,
        // location,
        // findtaskObjectList,
    } = props;

    // console.log(findtaskObjectList)

    const [visible, setVisible] = useState(false);

    // 列表
    // const getlistdata = (page, size) => {
    //     dispatch({
    //         type: 'autotask/findtaskObjectList',
    //         payload: {
    //             taskId: record.id,
    //             pageNum: page,
    //             pageSize: size,
    //         },
    //     })
    // };

    // useEffect(() => {
    //     getlistdata(1,15);
    // }, [location]);

    const handleCancel = () => {
        setVisible(false);
    };

    const handleopenClick = () => {
        setVisible(true);
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
            width: 180,
        },
        {
            title: 'IP地址',
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
            width: 200,
            ellipsis: true,
        },
        {
            title: '状态',
            dataIndex: 'agentStatus',
            key: 'agentStatus',
            width: 80,
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
                width={1160}
                centered
                maskClosable
                closable
            >
                <Table
                    // dataSource={findtaskObjectList.rows}
                    // loading={loading}
                    columns={columns}
                    bordered
                    // rowKey={record => record.id}
                    pagination={false}
                />
            </Modal>
        </>
    );
}

export default Form.create({})(
    connect(({ autotask, loading }) => ({
        findtaskObjectList: autotask.findtaskObjectList,
        loading: loading.models.autotask,
    }))(TaskObjectModel),
);