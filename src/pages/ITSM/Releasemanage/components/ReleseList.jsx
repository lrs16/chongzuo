import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Input, Divider, Table, Row, Col, Button } from 'antd';
import { classifyList, releaseListsDownload } from '../services/api';

const InputGroup = Input.Group;

function getQueryVariable(variable) {
  const query = window.location.search.substring(1);
  const vars = query.split("&");
  for (let i = 0; i < vars.length; i += 1) {
    const pair = vars[i].split("=");
    if (pair[0] === variable) { return pair[1]; }
  }
  return (false);
}

function ReleseList(props) {
  const { dataSource, listmsg, statistics } = props;
  const [classify, setClassify] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 5 });

  const onSelectChange = (RowKeys, record) => {
    setSelectedRowKeys(RowKeys);
    setSelectedRecords(record);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  // 清单导出
  const handleDlownd = () => {
    let ids = []
    if (selectedRowKeys.length > 0) {
      ids = selectedRecords.map(item => {
        return item.id
      });
    } else {
      ids = dataSource.map(item => {
        return item.id
      });
    };
    releaseListsDownload({ listIds: ids.toString() }).then(res => {
      if (res) {
        const filename = `发布清单${moment().format('YYYY-MM-DD HH:mm')}.xlsx`;
        const blob = new Blob([res], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    })
  };

  // 分页
  const onShowSizeChange = (page, size) => {
    setPageinations({
      ...paginations,
      pageSize: size,
    });
  };

  const changePage = page => {
    setPageinations({
      ...paginations,
      current: page,
    });
  };

  const pagination = {
    showSizeChanger: true,
    onShowSizeChange: (page, size) => onShowSizeChange(page, size),
    current: paginations.current,
    pageSize: paginations.pageSize,
    pageSizeOptions: ['2', '5', '10', '20', '30', '40', '50'],
    total: dataSource.length,
    showTotal: total => `总共  ${total}  条记录`,
    onChange: page => changePage(page),
  };

  useEffect(() => {
    if (dataSource) {
      classifyList(getQueryVariable("taskId")).then(res => {
        if (res.code === 200) {
          setClassify(res.data.classifyList.dutyUnitListMsg);
        }
      })
    }
  }, [dataSource])

  const columns = [
    {
      title: '序号',
      dataIndex: 'key',
      key: 'key',
      width: 60,
      align: 'center',
      render: (text, record, index) => {
        return <>{`${index + 1}`}</>;
      },
    },
    {
      title: '功能类型',
      dataIndex: 'abilityType',
      key: 'abilityType',
      width: 150,
    },
    {
      title: '模块',
      dataIndex: 'module',
      key: 'module',
      width: 120,
    },
    {
      title: '功能名称',
      dataIndex: 'appName',
      key: 'appName',
      width: 150,
    },
    {
      title: '问题类型',
      dataIndex: 'problemType',
      key: 'problemType',
      width: 150,
    },
    {
      title: '测试内容及预期效果',
      dataIndex: 't5',
      key: 't5',
      width: 400,
      render: (text, record) => {
        return (
          <>
            <InputGroup compact>
              <span style={{ width: 70, textAlign: 'right' }}>功能菜单：</span>
              <span style={{ width: 310 }}>{record.testMenu}</span>
            </InputGroup>
            <Divider type='horizontal' style={{ margin: '6px 0' }} />
            <InputGroup compact>
              <span style={{ width: 70, textAlign: 'right' }}>预期效果：</span>
              <span style={{ width: 310 }}>{record.testResult}</span>
            </InputGroup>
            <Divider type='horizontal' style={{ margin: '6px 0' }} />
            <InputGroup compact>
              <span style={{ width: 70, textAlign: 'right' }}>验证步骤：</span>
              <span style={{ width: 310 }}>{record.testStep}</span>
            </InputGroup>
          </>
        );
      }
    },
    {
      title: '状态',
      dataIndex: 'verifyStatus',
      key: 'verifyStatus',
      align: 'center',
      width: 100,
    },
    {
      title: '开发人员',
      dataIndex: 'developer',
      key: 'developer',
      width: 100,
    },
    {
      title: '业务复核结果',
      dataIndex: 'passTest',
      key: 'passTest',
      align: 'center',
      width: 100,
    },
    {
      title: '业务负责人',
      dataIndex: 'responsible',
      key: 'responsible',
      align: 'center',
      width: 100,
    },
    {
      title: '业务复核人',
      dataIndex: 'operator',
      key: 'operator',
      align: 'center',
      width: 100,
    },
  ];

  const setTableHeight = () => {
    let height = 500;
    const clientHeight = window.document?.body?.clientHeight || 500;
    height = clientHeight - 400
    return height
  };

  return (
    <>
      {statistics === undefined && (<Row>
        <Col span={20}>
          <span >{listmsg ? Object.values(listmsg)[0] : Object.values(classify)[0]}</span>
        </Col>
        <Col span={4} style={{ textAlign: 'right' }}><Button type='primary' onClick={() => { handleDlownd() }}  >导出清单</Button></Col>
      </Row>
      )}
      <Table
        columns={columns}
        rowSelection={rowSelection}
        pagination={pagination}
        bordered
        size='middle'
        dataSource={dataSource}
        scroll={{ x: 1350, y: setTableHeight(), }}
        rowKey={(_, index) => index.toString()}
        style={{ marginTop: 12 }}
      />
    </>
  );
}

export default ReleseList;