import React from 'react';
import { Card, Table } from 'antd';

function SoftwareInfoList(props) {
    // const { } = props;
    const columns = [
        {
            title: '区域',
            dataIndex: 'hostZoneId',
            key: 'hostZoneId',
            width: 120,
        },
        {
            title: '主机名称',
            dataIndex: 'hostName',
            key: 'hostName',
            width: 180,
        },
        {
            title: '主机IP',
            dataIndex: 'hostIp',
            key: 'hostIp',
            width: 200,
        },
        {
            title: '软件名称',
            dataIndex: 'softName',
            key: 'softName',
            width: 180,
        },
        {
            title: '软件端口',
            dataIndex: 'softPort',
            key: 'softPort',
            width: 180,
        },
        {
            title: '软件路径',
            dataIndex: 'softPath',
            key: 'softPath',
            width: 180,
        },
        {
            title: '软件版本号',
            dataIndex: 'softVersion',
            key: 'softVersion',
            width: 180,
        },
        {
            title: '软件状态',
            dataIndex: 'softStatus',
            key: 'softStatus',
            width: 180,
            // render: (text, record) => (
            //     <span>
            //         <Badge status={colormap.get(record.softStatus)} text={text} />
            //     </span>
            // ),
        },
        {
            title: '负责人',
            dataIndex: 'director',
            key: 'director',
            width: 80,
        },
        {
            title: '软件排序',
            dataIndex: 'softSorts',
            key: 'softSorts',
            width: 120,
        },

        {
            title: '启动脚本路径',
            dataIndex: 'startupScriptPath',
            key: 'startupScriptPath',
            width: 200,
        },
        {
            title: '停止脚本路径',
            dataIndex: 'stopScriptPath',
            key: 'stopScriptPath',
            width: 200,
        },
        {
            title: '启动参数',
            dataIndex: 'startupScriptArgs',
            key: 'startupScriptArgs',
            width: 120,
        },
        {
            title: '停止参数',
            dataIndex: 'stopScriptArgs',
            key: 'stopScriptArgs',
            width: 180,
        },
        {
            title: '是否巡检',
            dataIndex: 'monitor',
            key: 'monitor',
            width: 120,
        },
        {
            title: '是否监控',
            dataIndex: 'patrolInspection',
            key: 'patrolInspection',
            width: 120,
        },
        {
            title: '软件备注',
            dataIndex: 'softRemarks',
            key: 'softRemarks',
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
        }
    ];
    return (
        <Card style={{ height: 'calc(100vh - 300px)' }}>
            <Table
                columns={columns}
                // bordered={false}
                pagination={false}
                // dataSource={)
                rowKey={record => record.id} />
        </Card>
    );
}

export default SoftwareInfoList;