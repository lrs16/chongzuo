import React, { useEffect, useState, useContext } from 'react';
import { connect } from 'dva';
import { Table, Button, Icon, Input, Select, message } from 'antd';
import SysUpload from '@/components/SysUpload/Upload';
import { PaperClipOutlined } from '@ant-design/icons';
import FilesContext from '@/layouts/MenuContext';              // 引用上下文管理组件
import styles from '../index.less';
import { downloadAttachTemplate } from '../services/api';

// rowkey：1  出厂测试必填
// rowkey: 2  平台验证必填
// rowkey: 3  业务功能测试报告，功能清单终稿必填
// rowkey: 4  发布实施方案必填
// rowkey: 6  计划发布申请审批表必填
// rowkey: 7  临时发布申请审批表必填

const { TextArea } = Input;
const { Option } = Select;

const downloadmap = new Map([
  ['功能出厂测试报告', 'register'],
  ['平台验证测试报告', 'platformValid'],
  ['业务功能测试报告', 'funcTesting'],
  ['功能清单终稿', 'funcListFinal'],
  ['发布实施方案', 'practice'],
  ['计划发布申请审批表', 'planApply'],
  ['临时发布申请审批表', 'temporaryApply'],
  ['功能发布报告', 'funcReport'],
]);

function DocumentAtt(props) {
  const { dispatch, rowkey, unitmap, isEdit, dataSource, Unit, check, ChangeValue } = props;
  const [data, setData] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(false);
  const { ChangeButtype, addAttaches, ChangeaddAttaches, location } = useContext(FilesContext);                     // 是否要添加行
  const dutyUnit = dataSource && dataSource.length > 0 ? dataSource[0].dutyUnit : ''
  const Attaches = [
    { docName: '功能出厂测试报告', attachFile: '[]', dutyUnit, docTemplate: '', remarks: '', editable: true, },
    { docName: '平台验证测试报告', attachFile: '[]', dutyUnit, docTemplate: '', remarks: '', editable: true, },
    { docName: '业务功能测试报告', attachFile: '[]', dutyUnit, docTemplate: '', remarks: '', editable: true, },
    { docName: '功能清单终稿', attachFile: '[]', dutyUnit, docTemplate: '', remarks: '', editable: true, },
    { docName: '发布实施方案', attachFile: '[]', dutyUnit, docTemplate: '', remarks: '', editable: true, },
    { docName: '计划发布申请审批表', attachFile: '[]', dutyUnit, docTemplate: '', remarks: '', editable: true, },
    { docName: '临时发布申请审批表', attachFile: '[]', dutyUnit, docTemplate: '', remarks: '', editable: true, },
    { docName: '功能发布报告', attachFile: '[]', dutyUnit, docTemplate: '', remarks: '', editable: true, },
    { docName: '其它附件', attachFile: '[]', dutyUnit, docTemplate: '', remarks: '', editable: true, },
  ];
  console.log(location);

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
      if (fieldName === 'attachFile') {
        ChangeValue(newData, 'files')
      } else {
        ChangeValue(newData, '')
      }

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
  // 初始化表格数据
  const attList = () => {
    const newData = dataSource.map((item, index) => ({
      ...item,
      editable: false,                  // 可上传附件
      key: (index + 1).toString(),
    }));
    if (newData.length > 8) { newData[8].editable = true; }         // 其它附件都可以上传附件
    if (Number(rowkey) !== 0) {
      newData[rowkey - 1].editable = true;
      newData[rowkey - 1].dutyUnit = newData[rowkey - 1].dutyUnit || newData[0].dutyUnit;
    };
    if (rowkey === '3') {
      newData[3].editable = true;
      newData[3].dutyUnit = newData[3].dutyUnit || newData[0].dutyUnit;
    };
    // 补充的材料必填
    const endAtt = dataSource[dataSource.length - 1];
    if (rowkey === '2' && endAtt.docName === '功能出厂测试报告') {
      newData[dataSource.length - 1].editable = true;
    };
    if (rowkey === '3' && endAtt.docName === '平台验证测试报告') {
      newData[dataSource.length - 1].editable = true;
      newData[dataSource.length - 2].editable = true;
    };
    if (rowkey === '6' && endAtt.docName === '发布实施方案') {
      newData[dataSource.length - 1].editable = true;
      newData[dataSource.length - 2].editable = true;
      newData[dataSource.length - 3].editable = true;
      newData[dataSource.length - 4].editable = true;
      newData[dataSource.length - 5].editable = true;
    };
    setData(newData);
    ChangeValue(newData);

  }

  // useEffect(() => {
  //   if (rowkey && dataSource && dataSource.length > 0) { attList() }
  // }, [rowkey])

  useEffect(() => {
    if (rowkey && dataSource && dataSource.length > 0) {
      attList();
      if (isEdit) {
        ChangeaddAttaches('');
      }
    }
  }, [dataSource])

  // 出厂测试出具文档责任单位为空，表单有选择责任单位时修改列表值
  useEffect(() => {
    if (Unit && Unit.dutyUnit && rowkey === '1' && dataSource && dataSource.length > 0 && dataSource[0].dutyUnit === '') {
      handleFieldChange(Unit.dutyUnit, 'dutyUnit', rowkey)
    };
  }, [Unit.dutyUnit])

  useEffect(() => {
    if (addAttaches === 'add' && dataSource && dataSource.length > 0) {
      const lastattname = dataSource.slice(-1)[0].docName;
      if (rowkey === '2' && lastattname !== '功能出厂测试报告') {
        const newarr = Attaches.slice(0, 1);
        const newdata = data.concat(newarr);
        setData(newdata);
        ChangeValue(newdata)
      };
      if (rowkey === '3' && lastattname !== '平台验证测试报告') {
        const newarr = Attaches.slice(0, 2);
        const newdata = data.concat(newarr);
        setData(newdata);
        ChangeValue(newdata)
      };
      if (rowkey === '6' && lastattname !== '发布实施方案') {
        const newarr = Attaches.slice(0, 5);
        const newdata = data.concat(newarr);
        setData(newdata);
        ChangeValue(newdata)
      };
    };
    if (addAttaches === 'delete' && dataSource && dataSource.length > 0) {
      const lastattname = dataSource.slice(-1)[0].docName;
      if (rowkey === '2' && lastattname === '功能出厂测试报告') {
        const newdata = data.map(item => ({ ...item }));
        newdata.pop();
        setData(newdata);
        ChangeValue(newdata)
      };
      if (rowkey === '3' && lastattname === '平台验证测试报告') {
        const newdata = data.map(item => ({ ...item }));
        newdata.pop();
        newdata.pop();
        setData(newdata);
        ChangeValue(newdata);
      };
      if (rowkey === '6' && lastattname === '发布实施方案') {
        const newdata = data.map(item => ({ ...item }));
        newdata.pop();
        newdata.pop();
        newdata.pop();
        newdata.pop();
        newdata.pop();
        setData(newdata);
        ChangeValue(newdata)
      };
    }
  }, [addAttaches])

  const columns = [
    {
      title: '序号',
      dataIndex: 'key',
      key: 'key',
      width: 60,
      align: 'center',
      render: (text, record, index) => {
        if (text) {
          return text;
        }
        return (index + 1).toString()
      },
    },
    {
      title: '文档名称',
      dataIndex: 'docName',
      key: 'docName',
      width: 160,
      render: (text, record) => {
        if (isEdit && record.editable && record.key !== '9') {
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
        if (record.key === '9' && isEdit) {
          return (
            <div style={{ width: 300, marginTop: 12 }} onMouseDown={() => { ChangeButtype(''); }}>
              {location && (!location.state || (location.state && !location.state.cache)) && (
                <FilesContext.Provider value={{
                  files: JSON.parse(text),
                  ChangeFiles: (v => handleFieldChange(JSON.stringify(v), 'attachFile', record.key)),
                  getUploadStatus: (v) => { setUploadStatus(v) },
                }}>
                  <SysUpload key={record.id || record.key} banOpenFileDialog={uploadStatus} />
                </FilesContext.Provider>
              )}
            </div>
          )
        } if (isEdit && record.editable) {
          return (
            <>
              <div style={{ width: 300 }} onMouseDown={() => { ChangeButtype(''); }}>
                {location && (!location.state || (location.state && !location.state.cache)) && (
                  <FilesContext.Provider value={{
                    files: JSON.parse(text),
                    ChangeFiles: (v => handleFieldChange(JSON.stringify(v), 'attachFile', record.key)),
                    getUploadStatus: (v) => { setUploadStatus(v) },
                  }}>
                    <SysUpload key={record.id || record.key} banOpenFileDialog={uploadStatus} />
                  </FilesContext.Provider>
                )}
              </div>
              {check && text === '[]' && (<div style={{ color: '#f5222d' }}>请上传{record.docName}</div>)}
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
      title: '出具文档单位',
      dataIndex: 'dutyUnit',
      key: 'dutyUnit',
      width: 200,
      align: 'center',
      render: (text, record) => {
        if (isEdit && record.editable && (record.key === rowkey || record.key !== '9' || rowkey === '3')) {
          return (
            <Select
              placeholder="请选择"
              defaultValue={text || Unit.dutyUnit || data[0].dutyUnit}
              key={text || Unit.dutyUnit}
              onChange={e => { handleFieldChange(e, 'dutyUnit', record.key) }}
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
        const dowload = () => {
          downloadAttachTemplate(downloadmap.get(record.docName)).then(res => {
            const filename = `${record.docName}.docx`;
            const blob = new Blob([res], { type: 'application/octet-stream' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
          })
        };
        if (record.key === '9') {
          return null;
        }
        return <><Button type='link' onClick={() => dowload()}><Icon type='download' />下载</Button></>;
      },
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks',
      render: (text, record) => {
        if (isEdit && record.editable) {
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