import React, { useState, useEffect } from 'react';
import { Table, Form, Alert, Badge, Popconfirm } from 'antd';

const colormap = new Map([
    ['停用', 'default'],
    ['在用', 'success'],
]);

function SoftTaskObjectList(props) {
    const {
        selectrowsData,
        GetRowskeysData
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
            dataIndex: 'hostZoneId',
            key: 'hostZoneId',
            width: 200,
        },
        {
            title: '设备名称',
            dataIndex: 'hostName',
            key: 'hostName',
            width: 200,
            ellipsis: true,
        },
        {
            title: '设备IP',
            dataIndex: 'hostIp',
            key: 'hostIp',
            width: 200,
        },
        {
            title: '软件名称',
            dataIndex: 'softName',
            key: 'softName',
            width: 200,
            ellipsis: true,
        },
        {
            title: '软件端口',
            dataIndex: 'softPort',
            key: 'softPort',
            width: 120,
        },
        {
            title: '软件路径',
            dataIndex: 'softPath',
            key: 'softPath',
            width: 250,
            ellipsis: true,
        },
        {
            title: '软件版本号',
            dataIndex: 'softVersion',
            key: 'softVersion',
            width: 120,
        },
        {
            title: '软件状态',
            dataIndex: 'softStatus',
            key: 'softStatus',
            width: 120,
            render: (text, record) => (
                <span>
                    <Badge status={colormap.get(record.agentStatus)} text={text} />
                </span>
            ),
        },
        {
            title: '负责人',
            dataIndex: 'director',
            key: 'director',
            width: 120,
        },
        {
            title: '启动脚本路径',
            dataIndex: 'startupScriptPath',
            key: 'startupScriptPath',
            width: 250,
            ellipsis: true
        },
        {
            title: '停止脚本路径',
            dataIndex: 'stopScriptPath',
            key: 'stopScriptPath',
            width: 250,
            ellipsis: true
        },
        {
            title: '启动参数',
            dataIndex: 'startupScriptArgs',
            key: 'startupScriptArgs',
            width: 150,
        },
        {
            title: '停止参数',
            dataIndex: 'stopScriptArgs',
            key: 'stopScriptArgs',
            width: 150,
        },
        {
            title: '软件备注',
            dataIndex: 'softRemarks',
            key: 'softRemarks',
            width: 200,
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
                    columns={columns}
                    rowKey={record => record.id}
                    scroll={{ x: 1300 }}
                    pagination={false} /></>
            )}
        </div>
    );
}

export default Form.create({})(SoftTaskObjectList);