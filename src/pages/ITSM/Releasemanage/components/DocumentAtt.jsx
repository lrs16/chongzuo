import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Table, Button, Icon, Input, Select } from 'antd';
import SysUpload from '@/components/SysUpload/Upload';
import { PaperClipOutlined } from '@ant-design/icons';
import FilesContext from '@/layouts/MenuContext';              // 引用上下文管理组件
import styles from '../index.less';

const { TextArea } = Input;
const { Option } = Select;

function DocumentAtt(props) {
  const { dispatch, rowkey, unitmap, isEdit, dataSource, Uint, check, ChangeValue } = props;
  const [data, setData] = useState([]);

  useEffect(() => {
    if (rowkey && dataSource.length > 0) {
      const newData = dataSource.map((item, index) => ({
        ...item,
        editable: false,
        key: (index + 1).toString(),
      }));
      newData[8].editable = true;
      if (Number(rowkey) !== 0) {
        newData[rowkey - 1].editable = true;
      };
      if (rowkey === '3') {
        newData[3].editable = true;
      };
      setData(newData);
      ChangeValue(newData)
    }
  }, [rowkey])

  // 获取行
  const getRowByKey = (key, newData) => {
    return (newData || dataSource).filter(item => item.key === key)[0];
  };

  // 更新表单信息
  const handleFieldChange = (e, fieldName, key) => {
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData);
    if (target) {
      target[fieldName] = e;
      setData(newData);
      ChangeValue(newData)
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
            <>
              <div style={{ width: 300 }}>
                <FilesContext.Provider value={{
                  files: JSON.parse(text),
                  ChangeFiles: (v => handleFieldChange(JSON.stringify(v), 'attachFile', record.key)),
                }}>
                  <SysUpload />
                </FilesContext.Provider>
              </div>
              {check && (<div style={{ color: '#f5222d' }}>请上传{record.docName}</div>)}
            </>
          )
        } if (record.key === '9') {
          return (
            <>
              {text !== '[]' && text !== '' && (
                <div className={styles.greylink}>
                  {JSON.parse(text).map((obj, index) => {
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
              <div style={{ width: 300, marginTop: 12 }}>
                <FilesContext.Provider value={{
                  files: JSON.parse(text),
                  ChangeFiles: (v => handleFieldChange(JSON.stringify(v), 'attachFile', record.key)),
                }}>
                  <SysUpload filelist={JSON.parse(text)} />
                </FilesContext.Provider>
              </div>
            </>
          )
        }
        return (
          <>
            {text !== '[]' && text !== '' && (
              <div className={styles.greylink}>
                {JSON.parse(text).map((obj, index) => {
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
            <Select
              placeholder="请选择"
              value={Uint && Uint.dutyUnit ? Uint.dutyUnit : ''}
              onChange={e => handleFieldChange(e.target.value, 'dutyUint', record.key)}
            >
              {unitmap.map(obj => [
                <Option key={obj.key} value={obj.title}>
                  {obj.title}
                </Option>,
              ])}
            </Select>

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
              onChange={e => handleFieldChange(e.target.value, 'remarks', record.key)}
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