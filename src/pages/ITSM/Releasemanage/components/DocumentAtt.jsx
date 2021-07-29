import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Table, Button, Icon, Input, message, AutoComplete, Select } from 'antd';
import SysUpload from '@/components/SysUpload/Upload';
import { PaperClipOutlined } from '@ant-design/icons';
import styles from '../index.less';

const { TextArea } = Input;
const { Option } = AutoComplete;


function DocumentAtt(props) {
  const { dispatch, rowkey, unitmap, isEdit, dataSource, Uint } = props;
  const [data, setData] = useState([]);
  const [keyupload, setKeyUpload] = useState('');

  useEffect(() => {
    dataSource[8].editable = true;
    if (Number(rowkey) !== 0) {
      dataSource[rowkey - 1].editable = true;
    };
    if (rowkey === '3') {
      dataSource[3].editable = true;
    };
    setData(dataSource);
    return () => {
      if (Number(rowkey) !== 0) {
        dataSource[rowkey - 1].editable = false;
      };
      dataSource[3].editable = false;
    };
  }, [rowkey])

  // 获取行
  const getRowByKey = (key, newData) => {
    return (newData || dataSource).filter(item => item.key === key)[0];
  };

  // 更新表单信息
  const handleFieldChange = (e, fieldName, key) => {
    const newData = dataSource.map(item => ({ ...item }));
    const target = getRowByKey(key, newData);
    if (target) {
      target[fieldName] = e;
      setData(newData);
    }
  };

  // 保存记录
  const saveRow = (e, key) => {
    e.preventDefault();
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData) || {};
    // if (!target.t2 || !target.t3) {
    //   message.error('请填写完整信息。');
    //   e.target.focus();
    //   return;
    // }
    // delete target.key;
    if (target && target.editable) {
      target.editable = !target.editable;
      setData(newData);
    }
  };

  // 列表中下载附件
  const handledownload = info => {
    dispatch({
      type: 'sysfile/downloadfile',
      payload: {
        id: info.uid,
      },
    }).then(res => {
      const filename = info.name;
      const blob = new Blob([res]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };


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
      title: '文档名称',
      dataIndex: 'docName',
      key: 'docName',
      width: 160,
      render: (text, record) => {
        if (isEdit && record.editable && (record.key === rowkey || record.key !== '9' || rowkey === '3')) {
          return (<><span style={{ color: '#f5222d', marginRight: 4, fontWeight: 'normal' }}>*</span>{text} </>)
        }
        return text;
      },
    },
    {
      title: '附件上传',
      dataIndex: 'attachFile',
      key: 'attachFile',
      width: 300,
      render: (text, record) => {
        if (isEdit && record.editable && (record.key === rowkey || rowkey === '3')) {
          return (
            <div onMouseOver={() => { setKeyUpload(record.key) }} onFocus={() => 0} style={{ width: 300 }}>
              <SysUpload />
            </div>
          )
        } if (record.key === '9') {
          return (
            <>
              {text !== '' && (
                <div className={styles.greylink}>
                  {text.map((obj, index) => {
                    return (
                      <div key={index.toString()} style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: 280, overflow: 'hidden' }}>
                        <PaperClipOutlined
                          style={{ marginRight: 8, fontSize: 11, color: 'rgba(0, 0, 0, 0.45)', }}
                        />
                        <a onClick={() => handledownload(obj)}>{obj.name}</a>
                      </div>
                    );
                  })}
                </div>
              )}
              <div onMouseOver={() => { setKeyUpload(record.key) }} onFocus={() => 0} style={{ width: 300, marginTop: 12 }}>
                <SysUpload />
              </div>
            </>
          )
        }
        return (
          <>
            {text && (
              <div className={styles.greylink}>
                {text.map((obj, index) => {
                  return (
                    <div key={index.toString()} style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: 280, overflow: 'hidden' }}>
                      <PaperClipOutlined
                        style={{ marginRight: 8, fontSize: 11, color: 'rgba(0, 0, 0, 0.45)' }}
                      />
                      <a onClick={() => handledownload(obj)}>{obj.name}</a>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        );
      },
    },
    {
      title: '责任单位',
      dataIndex: 'dutyUint',
      key: 'dutyUint',
      width: 200,
      align: 'center',
      render: (text, record) => {
        if (isEdit && record.editable && (record.key === rowkey || record.key !== '9' || rowkey === '3')) {
          return (
            Uint.dutyUnit
          )
        }
        return text;
      }
    },
    {
      title: '文档模板',
      dataIndex: 'docTemplate',
      key: 'docTemplate',
      with: 80,
      align: 'center',
      render: (text, record) => {
        if (record.key === '9') {
          return null;
        }
        return <><Button type='link'><Icon type='download' />下载</Button></>;
      },
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks',
      render: (text, record) => {
        if (isEdit && record.editable && (record.key === rowkey || record.key === '9' || rowkey === '3')) {
          return (
            <TextArea
              defaultValue={text}
              autoSize
              placeholder="请输入"
              onChange={e => handleFieldChange(e.target.value, 'des', record.key)}
            />
          )
        }
        return text;
      }
    },
    // {
    //   title: '操作',
    //   key: 'action',
    //   fixed: 'right',
    //   width: 100,
    //   align: 'center',
    //   render: (text, record) => {
    //     if (record.editable) {
    //       return (
    //         <Button type='link' onClick={e => saveRow(e, record.key)}>保存</Button>
    //       );
    //     }
    //     return null;
    //   },
    // },
  ];
  return (
    <Table
      columns={columns}
      dataSource={data}
      bordered
      size='middle'
      rowKey={(_, index) => index.toString()}
      pagination={false}
    />
  );
}

export default connect(({ sysfile, loading }) => ({
  sysfile,
  loading: loading.models.sysfile,
}))(DocumentAtt);