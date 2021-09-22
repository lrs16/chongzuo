import React, { useState, useEffect} from 'react';
import { Table, Form, Alert, Badge, Popconfirm } from 'antd';

const colormap = new Map([
    ['停用', 'default'],
    ['在用', 'success'],
]);

function TaskObjectList1(props) {
    const {
        selectrowsData,
        GetRowskeysData,
        Noediting
    } = props;

    const [selectedrowsData, setselectedrowsData] = useState([]);

    useEffect(() => {
        if (selectrowsData && selectrowsData.length >= 1) {
            setselectedrowsData(selectrowsData);
        }
    }, [selectrowsData]);

    const handleDelete = id => {
        const deleteidrow = selectedrowsData.filter(item => item.id !== id);
        const deleteidrowkey = deleteidrow.map(item => item.id)
        setselectedrowsData(deleteidrow);
        GetRowskeysData(deleteidrowkey);
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
            width: 200,
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
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            fixed: 'right',
            width: 50,
            render: (text, record) =>
                selectrowsData.length >= 1 ? (
                    <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
                        <a style={{color: 'red'}}>移除</a>
                    </Popconfirm>
                ) : null,
        },
    ];

    return (
        <div style={{ marginLeft: 125 }}>
            {selectrowsData && selectrowsData.length >= 1 && (
                <><Alert message={`已选择【${selectedrowsData.length}】个agent`} style={{ marginBottom: 5 }} /><Table
                    dataSource={selectedrowsData}
                    columns={Noediting ? columns.filter(item => item.title !== '操作') : columns}
                    rowKey={record => record.id}
                    scroll={{ x: 1300 }}
                    pagination={false} /></>
            )}
        </div>
    );
}

export default Form.create({})(TaskObjectList1);