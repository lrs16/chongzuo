import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Table, Input, Radio, Divider, Row, Col, Button, message, Popconfirm } from 'antd';
import debounce from 'lodash/debounce';
import { releaseListEdit, classifyList, releaseListsDownload, } from '../services/api'
import styles from '../index.less';

const { TextArea } = Input;
const InputGroup = Input.Group;
const RadioGroup = Radio.Group;

const typemap = new Map([
  ['业务验证', '业务验证人'],
  ['业务复核', '业务复核人'],
  ['发布验证', '操作人员'],
])

function getQueryVariable(variable) {
  const query = window.location.search.substring(1);
  const vars = query.split("&");
  for (let i = 0; i < vars.length; i += 1) {
    const pair = vars[i].split("=");
    if (pair[0] === variable) { return pair[1]; }
  }
  return (false);
}

function BusinessEditTable(props) {
  const { title, dataSource, type, ChangeValue, loading, isEdit, listmsg, getSelectedRecords } = props;
  const [data, setData] = useState([]);
  const [classify, setClassify] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 5 });
  const [visible, setVisible] = useState(false);
  const [result, setResult] = useState({});
  const [rowKey, setRowKey] = useState(0)

  useEffect(() => {
    if (dataSource && dataSource.length > 0) {
      const newData = dataSource.map((item, index) => ({
        ...item,
        editable: false,
        key: (index + 1).toString(),
      }));
      setData(newData);
      classifyList(getQueryVariable("taskId")).then(res => {
        if (res.code === 200) {
          setClassify(res.data.classifyList.dutyUnitListMsg);
        }
      })
    };
    if (dataSource && dataSource.length === 0) {
      setData(dataSource);
    };
  }, [dataSource]);

  useEffect(() => {
    if (loading) {
      setSelectedRowKeys([]);
      setSelectedRecords([]);
    }
  }, [loading])

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        const morepop = document.getElementsByClassName('ant-popover');
        if (morepop[0]) { morepop[0].style.display = 'none' }
      }, 50)
    }
  }, [visible])

  // 获取行
  const getRowByKey = (key, newData) => {
    return (newData || data).filter(item => item.key === key)[0];
  };
  // 更新表单信息
  const handleFieldChange = (e, fieldName, key) => {
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData);
    if (target) {
      target[fieldName] = e;
      target.operator = sessionStorage.getItem('userName');
      if (type === '发布验证') {
        setData(newData);
        ChangeValue(newData);
      } else {
        setData(newData);
        releaseListEdit(target).then(res => {
          if (res.code === 200) {
            if (fieldName === 'passTest') {
              ChangeValue({ status: true, target });
            };
          } else {
            message.error(res.msg || '操作失败');
            setData(newData);
          }
        });
      }
    }
  };

  const getAreaMember = (val) => {
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(val.key, newData);
    if (target) {
      target[val.fieldName] = val.e;
      target.operator = sessionStorage.getItem('userName');
      setData(newData);
      releaseListEdit(target).then(res => {
        if (res.code !== 200) {
          message.error(res.msg || '操作失败');
          setData(data);
        }
      })
    }
  }

  const callAreaAjax = debounce(getAreaMember, 500);

  const handleAreaChange = (e, fieldName, key) => {
    callAreaAjax({ e, fieldName, key })
  };

  const onSelectChange = (RowKeys, record) => {
    setSelectedRowKeys(RowKeys);
    setSelectedRecords(record);
    if (getSelectedRecords) {
      getSelectedRecords(record);
    }
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
      ids = data.map(item => {
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
      current: 1,
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
    total: data.length,
    showTotal: total => `总共  ${total}  条记录`,
    onChange: page => changePage(page),
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'key',
      key: 'key',
      width: 50,
      align: 'center',
      // render: (text, record, index) => {
      //   return <>{`${index + 1}`}</>;
      // },
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
              <div style={{ position: 'relative' }}>
                <div style={{ width: 70, textAlign: 'right', position: 'absolute', left: 0, top: 0 }}>功能菜单：</div>
                <div style={{ marginLeft: 70 }} dangerouslySetInnerHTML={{ __html: record.testMenu?.replace(/[\n]/g, '<br/>') }} />
              </div>
            </InputGroup>
            <Divider type='horizontal' style={{ margin: '6px 0' }} />
            <InputGroup compact>
              <div style={{ position: 'relative' }}>
                <div style={{ width: 70, textAlign: 'right', position: 'absolute', left: 0, top: 0 }}>预期效果：</div>
                <div style={{ marginLeft: 70 }} dangerouslySetInnerHTML={{ __html: record.testResult?.replace(/[\n]/g, '<br/>') }} />
              </div>
            </InputGroup>
            <Divider type='horizontal' style={{ margin: '6px 0' }} />
            {record.repoList === 'Y' && record.testResultExt && (
              <>
                <InputGroup compact>
                  <div style={{ position: 'relative' }}>
                    <div style={{ width: 70, textAlign: 'right', position: 'absolute', left: 0, top: 0 }}>补充内容：</div>
                    <div style={{ marginLeft: 70 }} dangerouslySetInnerHTML={{ __html: record.testResultExt?.replace(/[\n]/g, '<br/>') }} />
                  </div>
                </InputGroup>
                <Divider type='horizontal' style={{ margin: '6px 0' }} />
              </>
            )}
            <InputGroup compact>
              <div style={{ position: 'relative' }}>
                <div style={{ width: 70, textAlign: 'right', position: 'absolute', left: 0, top: 0 }}>验证步骤：</div>
                <div style={{ marginLeft: 70 }} dangerouslySetInnerHTML={{ __html: record.testStep?.replace(/[\n]/g, '<br/>') }} />
              </div>
            </InputGroup>
          </>
        );
      }
    },
    {
      title: '状态',
      dataIndex: 'verifyStatus',
      key: 'verifyStatus',
      width: 100,
    },
    {
      title: '业务负责人',
      dataIndex: 'responsible',
      key: 'responsible',
      align: 'center',
      width: 120,
    },
    {
      title: '开发人员',
      dataIndex: 'developer',
      key: 'developer',
      width: 100,
    },
    {
      title: `${type}人`,
      dataIndex: 'operator',
      key: 'operator',
      align: 'center',
      width: 100,
    },
    {
      title: `${type}结果`,
      dataIndex: 'passTest',
      key: 'passTest',
      fixed: 'right',
      width: 120,
      render: (text, record) => {
        return (
          <>
            {isEdit ? (
              <>
                {rowKey === Number(record.key) ? (
                  <Popconfirm
                    title="该清单不属于您的功能业务，是否确定验证？"
                    onConfirm={() => { setVisible(false); handleFieldChange(result.passTest, 'passTest', record.key) }}
                    visible={visible}
                    onCancel={() => setVisible(false)}
                    placement="leftTop"
                  >
                    <RadioGroup
                      key={record.id}
                      value={text}
                      // onChange={e => handleFieldChange(e.target.value, 'passTest', record.key)}
                      onMouseDown={() => { setVisible(false); setResult({}); }}
                      onChange={e => {
                        // setRowKey(Number(record.key - 1));
                        if (record.responsible !== sessionStorage.getItem('userName') && type !== '发布验证') {
                          setVisible(true);
                          setResult({ ...result, passTest: e.target.value });

                        } else {
                          handleFieldChange(e.target.value, 'passTest', record.key)
                        }
                      }}
                    >
                      <Radio value='通过'>通过</Radio>
                      <Radio value='不通过'><span style={{ color: '#f5222d' }}>不通过</span></Radio>
                    </RadioGroup>
                  </Popconfirm>
                ) : (
                  <RadioGroup value={text} key={record.id}>
                    <Radio value='通过'>通过</Radio>
                    <Radio value='不通过'><span style={{ color: '#f5222d' }}>不通过</span></Radio>
                  </RadioGroup>
                )}
              </>
            ) : <div key={record.id} style={{ textAlign: 'center', color: `${text === '不通过' && '#f5222d'}` }}>{text}</div>}
          </>
        )
      }
    },
    {
      title: '验证意见',
      dataIndex: 'verifyComment',
      key: 'verifyComment',
      fixed: 'right',
      width: 200,
      render: (text, record) => {
        return (
          <>
            {isEdit ? (
              <div className={!text && record.passTest === '不通过' ? styles.requiredform : ''}>
                <TextArea
                  key={record.id}
                  defaultValue={text}
                  autoSize={{ minRows: 4 }}
                  placeholder="请输入"
                  onChange={e => handleAreaChange(e.target.value, 'verifyComment', record.key, e)}
                />
              </div >
            ) : (<>{text}</>)}
          </>
        )
      }
    },
  ];

  const sclicecolumns = () => {
    if (type === '发布验证') {
      const practicedone = columns.filter(item => item.key !== 'verifyStatus' && item.key !== 'operator');
      const newarr = practicedone.slice(0);
      newarr.pop();
      return newarr;
    }
    return columns
  };

  const setTableHeight = () => {
    let height = 500;
    const clientHeight = window.document?.body?.clientHeight || 500;
    height = clientHeight - 400
    return height
  };

  return (
    <>
      <h4>
        <span style={{ color: '#f5222d', marginRight: 4, fontWeight: 'normal' }}>*</span>
        {title}
      </h4>
      <Row>
        <Col span={20}>
          {classify && isEdit && (<div>{Object.values(classify)[0]}</div>)}
          {listmsg && (<div>{Object.values(listmsg)[0]}</div>)}
        </Col>
        {type === '发布验证' && (
          <Col span={4} style={{ textAlign: 'right' }}>
            <Button type='primary' onClick={() => { handleDlownd() }}>导出清单</Button>
          </Col>)}
      </Row>
      <Table
        rowSelection={rowSelection}
        columns={sclicecolumns()}
        dataSource={data}
        bordered
        size='middle'
        rowKey={(_, index) => index.toString()}
        onRow={record => {
          return {
            onMouseEnter: e => { e.preventDefault(); setRowKey(Number(record.key)); setVisible(false) },
          };
        }}
        pagination={pagination}
        scroll={{ x: 1700, y: setTableHeight() }}
        loading={loading}
        style={{ marginTop: 12 }}
      />
    </>
  );
}

export default BusinessEditTable;