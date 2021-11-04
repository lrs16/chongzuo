import React, { useState, useEffect } from 'react';
import { Table, Form, Alert, Popconfirm } from 'antd';

function TaskObjectList(props) {
    const {
        selectrowsData,
        GetRowskeysData,
        Noediting,
        onChangeSelect
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
        if (selectedrowsData && selectedrowsData.length > 0) {
            setselectedrowsData(deleteidrow);
            GetRowskeysData(deleteidrowkey);
            onChangeSelect(deleteidrow);
        } else {
            setselectedrowsData([]);
            GetRowskeysData([]);
            onChangeSelect([]);
        }
    };

    const columns = [
        {
            title: '脚本编号',
            dataIndex: 'id',
            key: 'id',
            width: 200,
        },
        {
            title: '脚本名称',
            dataIndex: 'scriptName',
            key: 'scriptName',
            width: 200,
        },
        {
            title: '脚本类型',
            dataIndex: 'scriptType',
            key: 'scriptType',
            width: 120,
        },
        {
            title: '脚本内容',
            dataIndex: 'scriptCont',
            key: 'scriptCont',
            width: 300,
            ellipsis: true,
        },
        {
            title: '脚本参数',
            dataIndex: 'scriptArgs',
            key: 'scriptArgs',
            width: 180,
        },
        {
            title: '状态',
            dataIndex: 'scriptStatus',
            key: 'scriptStatus',
            width: 120,
        },
        {
            title: '脚本来源',
            dataIndex: 'scriptSource',
            key: 'scriptSource',
            width: 150,
        },
        {
            title: '脚本排序',
            dataIndex: 'scriptSorts',
            key: 'scriptSorts',
            width: 120,
        },
        {
            title: '脚本备注',
            dataIndex: 'scriptRemarks',
            key: 'scriptRemarks',
            width: 250,
        },
        {
            title: '创建人',
            dataIndex: 'createByNameExt',
            key: 'createByNameExt',
            width: 120,
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 250,
        },
        {
            title: '更新人',
            dataIndex: 'updateByNameExt',
            key: 'updateByNameExt',
            width: 120,
        },
        {
            title: '更新时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
            width: 250,
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            fixed: 'right',
            width: 70,
            render: (text, record) =>
                selectrowsData.length >= 1 ? (
                    <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
                        <a style={{ color: 'red' }}>移除</a>
                    </Popconfirm>
                ) : null,
        },
    ];

    return (
        <div style={{ marginLeft: 125 }}>
            {selectrowsData && selectrowsData.length >= 1 && (
                <><Alert message={`已选择【${selectedrowsData.length}】个脚本`} style={{ marginBottom: 5 }} /><Table
                    dataSource={selectedrowsData}
                    columns={Noediting ? columns.filter(item => item.title !== '操作') : columns}
                    rowKey={record => record.id}
                    scroll={{ x: 1300 }}
                    pagination={false} /></>
            )}
        </div>
    );
}

export default Form.create({})(TaskObjectList);