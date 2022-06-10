import React, { useEffect, useState, useContext } from 'react';
import { connect } from 'dva';
import { Table, Button, Icon, Input, Select, message } from 'antd';
import SysUpload from '@/components/SysUpload/Upload';
import { PaperClipOutlined } from '@ant-design/icons';
import FilesContext from '@/layouts/MenuContext';              // 引用上下文管理组件
import { getFileSecuritySuffix } from '@/services/upload';
import styles from '../index.less';
import { downloadAttachTemplate, exportTaskToDocx } from '../services/api';

const { TextArea } = Input;
const { Option } = Select;

const downloadmap = new Map([
  ['出厂测试', 'register'],
  ['平台验证', 'platformValid'],
  ['业务验证', 'funcTesting'],
  ['发布实施准备', 'funcListFinal'],
  ['发布实施方案', 'practice'],
  ['版本管理员审核', 'planApply'],
  // ['临时发布申请审批表', 'temporaryApply'],
  ['业务复核', 'funcReport'],
]);


function NewDocAtt(props) {
  const { dispatch, rowkey, unitmap, isEdit, dataSource, Unit, check, ChangeValue, tasklinks, taskName } = props;
  const [data, setData] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(false);
  const { ChangeButtype, addAttaches, ChangeaddAttaches, } = useContext(FilesContext);                     // 是否要添加行
  const [filetype, setFileType] = useState('');
  // const dutyUnit = dataSource && dataSource.length > 0 ? dataSource[0].dutyUnit : '';
  // console.log('dataSource:', dataSource);
  // console.log('data:', data);

  // 允许上传类型
  useEffect(() => {
    getFileSecuritySuffix().then(res => {
      if (res.code === 200) {
        const arr = [...res.data];
        setFileType(arr);
      }
    });
  }, []);

  // 获取行
  const getRowByKey = (key, newData) => {
    return (newData || dataSource).filter(item => item.sn === key)[0];
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

  const columns = [
    {
      title: '序号',
      dataIndex: 'sn',
      key: 'sn',
      width: 60,
      align: 'center'
    },
    {
      title: '流程节点名称',
      dataIndex: 'docName',
      key: 'docName',
      width: 160,
    },
    {
      title: '流程节点状态',
      dataIndex: 'taskStatus',
      key: 'taskStatus',
      width: 120,
      align: 'center',
      render: (text, record) => {
        return (
          <>
            {(text === '1' || text === '0') && (<Icon type="check" style={{ color: '#52c41a' }} />)}
            {text === '2' && (<Icon type="close" style={{ color: '#f50' }} />)}
          </>)
      },
    },
    {
      title: '附件上传',
      dataIndex: 'attachFile',
      key: 'attachFile',
      width: 350,
      render: (text, record) => {
        if (record.sn === '1' && taskName === '新建' && isEdit) {
          return (
            <div style={{ width: 300, marginTop: 12 }} onMouseDown={() => { ChangeButtype(''); }}>
              <FilesContext.Provider value={{
                files: JSON.parse(text),
                ChangeFiles: (v => handleFieldChange(JSON.stringify(v), 'attachFile', record.sn)),
                getUploadStatus: (v) => { setUploadStatus(v) },
              }}>
                <SysUpload key={record.sn} banOpenFileDialog={uploadStatus} remark />
              </FilesContext.Provider>
              {filetype && filetype.length > 0 && (
                <div style={{ color: '#ccc', lineHeight: '20px' }}>
                  <p style={{ marginBottom: '6px', }}>1、仅能上传{filetype.join('，')}类型文件;</p>
                  <p style={{ marginBottom: '6px', }}>2、最多可上传20个文件;</p>
                  <p style={{ marginBottom: '6px', }}>3、附件名称最长100个字符;</p>
                </div>
              )}
            </div>
          )
        } if (isEdit && taskName === record.docName) {
          return (
            <>
              <div style={{ width: 300 }} onMouseDown={() => { ChangeButtype(''); }}>
                <FilesContext.Provider value={{
                  files: JSON.parse(text),
                  ChangeFiles: (v => handleFieldChange(JSON.stringify(v), 'attachFile', record.sn)),
                  getUploadStatus: (v) => { setUploadStatus(v) },
                }}>
                  <SysUpload key={record.id || record.key} banOpenFileDialog={uploadStatus} remark />
                </FilesContext.Provider>
                {filetype && filetype.length > 0 && (
                  <div style={{ color: '#ccc', lineHeight: '20px' }}>
                    <p style={{ marginBottom: '6px', }}>1、仅能上传{filetype.join('，')}类型文件;</p>
                    <p style={{ marginBottom: '6px', }}>2、最多可上传20个文件;</p>
                    <p style={{ marginBottom: '6px', }}>3、附件名称最长100个字符;</p>
                  </div>
                )}
              </div>
              {check && text === '[]' && (<div style={{ color: '#f5222d' }}>请上传{record.docName}</div>)}
            </>
          )
        }
        return (
          <>
            {text !== '[]' && text && (
              <div className={styles.greylink}>
                {JSON.parse(text) && JSON.parse(text).length && JSON.parse(text).map((obj, index) => {
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
        if (((record.sn === '1' && taskName === '新建') || (taskName === record.docName)) && isEdit) {
          return (
            <Select
              placeholder="请选择"
              defaultValue={text}
              key={text}
              onChange={e => { handleFieldChange(e, 'dutyUnit', record.sn) }}
              allowClear
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
            if (res) {
              const filename = `${record.docName}.zip`;
              const blob = new Blob([res], { type: 'application/octet-stream' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = filename;
              a.click();
              window.URL.revokeObjectURL(url);
            } else {
              message.error(res.msg)
            }

          })
        };
        if (record.key === '9') {
          return null;
        }
        return <><Button type='link' onClick={() => dowload()}><Icon type='download' />下载</Button></>;
      },
    },
    {
      title: '文档导出',
      dataIndex: 'doc',
      key: 'doc',
      with: 80,
      align: 'center',
      render: (text, record) => {
        const dowload = ({ name, reportName }) => {
          exportTaskToDocx({ docTaskId: record.docTaskId, reportName }).then(res => {
            if (res.status === 200) {
              const filename = `${name || reportName}.docx`;
              const blob = new Blob([res], { type: 'application/octet-stream' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = filename;
              a.click();
              window.URL.revokeObjectURL(url);
            } else {
              message.error(res.msg || '下载失败！')
            }

          })
        };
        if (record.key === '9') {
          return null;
        }
        return (
          <>
            {record.docName === '出厂测试' && record.taskStatus && record.docTaskId && (<Button type='link' onClick={() => dowload({ name: '出厂测试报告' })}><Icon type='download' />出厂测试报告</Button>)}
            {record.docName === '平台验证' && record.taskStatus && (<Button type='link' onClick={() => dowload({ name: '平台验证测试报告' })}><Icon type='download' />平台验证测试报告</Button>)}
            {record.docName === '业务验证' && record.taskStatus && (
              <>
                <Button type='link' onClick={() => dowload({ name: '功能验证测试报告' })}><Icon type='download' />功能验证测试报告</Button>
                <Button type='link' onClick={() => dowload({ reportName: '功能清单终稿' })}><Icon type='download' />功能清单终稿</Button>
              </>
            )}
            {record.docName === '发布实施准备' && record.taskStatus && (<Button type='link' onClick={() => dowload({ name: '实施方案' })}><Icon type='download' />实施方案</Button>)}
            {record.docName === '发布验证' && record.taskStatus && (<Button type='link' onClick={() => dowload({ name: '功能发布报告' })}><Icon type='download' />功能发布报告</Button>)}
          </>
        );
      },
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks',
      render: (text, record) => {
        if (((record.sn === '1' && taskName === '新建') || (taskName === record.docName)) && isEdit) {
          return (
            <TextArea
              defaultValue={text}
              autoSize
              placeholder="请输入"
              onChange={e => handleFieldChange(e.target.value, 'remarks', record.sn)}
            />
          )
        }
        return text;
      }
    },
  ];

  useEffect(() => {
    if (dataSource && dataSource.length > 0) {
      if (taskName === '新建') {
        const newData = dataSource.map(item => ({ ...item, taskStatus: item.docName === '出厂测试' ? '1' : null }));
        setData(newData);
        ChangeValue(newData, '');
      } else {
        const newData = dataSource.map(item => ({ ...item }));
        setData(newData);
      }
    };
  }, [dataSource]);

  // const getBigNum = (datas, taskNames) => {
  //   let max = 1;
  //   if (!Array.isArray(datas)) {
  //     return max;
  //   }
  //   for (let i = 0; i < datas.length; i += 1) {
  //     const cur = taskNames.indexOf(datas[i].taskName.split('(')[0]);
  //     max = cur > max ? cur : max;
  //   }
  //   return max
  // }

  // useEffect(() => {
  //   if (isEdit && tasklinks && tasklinks.length && tasklinks.length > 1 && dataSource && dataSource.length > 0) {
  //     console.log('3:', taskName);
  //     const nodePic = tasklinks.slice(-2);
  //     const taskNames = dataSource.map(item => { return item.docName });
  //     const rowNum = getBigNum(tasklinks, taskNames);
  //     console.log(rowNum);
  //     // const rowNum = taskNames.indexOf(nodePic[0].taskName.split('(')[0]);
  //     const rowLastNum = taskNames.indexOf(nodePic[1].taskName.split('(')[0]);
  //     if (rowLastNum < rowNum) {
  //       const listAtt = dataSource.map((item, index) => {
  //         if (index < rowNum) {
  //           return { ...item, taskStatus: '1' }
  //         } if (index === rowNum) {
  //           return { ...item, taskStatus: '2' }
  //         }
  //         return { ...item, taskStatus: null }
  //       });
  //       setData(listAtt);
  //     } else {
  //       const listAtt = dataSource.map((item, index) => {
  //         if (index <= rowLastNum) {
  //           return { ...item, taskStatus: '1' }
  //         } if (index === rowLastNum) {
  //           return { ...item, taskStatus: '1' }
  //         }
  //         return { ...item, taskStatus: null }
  //       });
  //       setData(listAtt);
  //       ChangeValue(listAtt, '')
  //     };
  //   };
  // }, [tasklinks, dataSource]);

  // 出厂测试出具文档责任单位为空，表单有选择责任单位时修改列表值
  // useEffect(() => {
  //   if (Unit && Unit.dutyUnit && (taskName === '新建' || taskName === '出厂测试') && dataSource && dataSource.length > 0 && !dataSource[0].dutyUnit) {
  //     handleFieldChange(Unit.dutyUnit, 'dutyUnit', '1')
  //   };
  // }, [Unit.dutyUnit]);

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

export default connect(({ sysfile, releaseview, loading }) => ({
  tasklinks: releaseview.processLinks,
  sysfile,
  loading: loading.models.sysfile,
}))(NewDocAtt);