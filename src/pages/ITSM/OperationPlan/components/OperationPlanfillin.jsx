import React, { useState, useRef, useImperativeHandle, useEffect, useContext } from 'react';
import { message, Button, Upload, Row, Col, Form, Input, Select, DatePicker, AutoComplete, Radio, Tag } from 'antd';
import moment from 'moment';
import UploadContext from '@/layouts/MenuContext';
import { getAndField } from '@/pages/SysManage/services/api';
import SysDict from '@/components/SysDict';
import { DownloadOutlined } from '@ant-design/icons';
import { FileDownload, FileDelete, getFileSecuritySuffix } from '@/services/upload';
import FormTextArea from './FormTextArea';
// import BraftEditor from 'braft-editor'
// import 'braft-editor/dist/index.css';
import styles from '../index.less'

const { Option } = Select;
const { TextArea } = Input;
let startTime;
let endTime;
let taskperson = true;

const OperationPlanfillin = React.forwardRef((props, ref) => {
  const {
    form: { getFieldDecorator, setFieldsValue, validateFields, getFieldsValue },
    formItemLayout,
    forminladeLayout,
    useInfo,
    files,
    ChangeFiles,
    main,
    type,
    status,
    operationPersonSelect,
    getUploadStatus,
  } = props;

  const statusContent = ['计划中', '延期中', '已超时', '已完成'];
  const color = ['blue', 'yellow', 'red', 'green'];
  const [titlerecords, setTitleRecords] = useState([]);
  const [selectdata, setSelectData] = useState('');
  const [fileslist, setFilesList] = useState([]);
  const [objautodata, setObjautodata] = useState([]);
  const [banOpenFileDialog, setBanOpenFileDialog] = useState(true);
  const [filetype, setFileType] = useState('');
  const [showIcon, setShowIcon] = useState(true);
  const [showinput, setShowinput] = useState(true);
  const [showinput2, setShowinput2] = useState(true);
  const [showinput3, setShowinput3] = useState(true);
  const [showinput4, setShowinput4] = useState(true);

  const { getRegistUploadStatus, handleUploadStatus } = useContext(UploadContext);

  useEffect(() => {
    if (files && files.length > 0) {
      setFilesList(files);
    };
  }, [main]);

  useEffect(() => {
    taskperson = true;
    if (main.operationUser) {
      taskperson = false;
    }
  }, []);

  const attRef = useRef();
  useImperativeHandle(
    ref,
    () => ({
      attRef,
    }),
    [],
  );

  const onChange = (date, dateString) => {
    setFieldsValue({ main_plannedStartTime: moment(dateString) });
    startTime = dateString;
  };

  const endtimeonChange = (date, dateString) => {
    setFieldsValue({ main_plannedEndTime: moment(dateString) });
    endTime = dateString;
  };

  const handletitleSearch = values => {
    getAndField(values).then(res => {
      if (res.code === 200 && res.data.length > 0) {
        const newdata = res.data.map(item => {
          return item.content;
        });
        setObjautodata(newdata);
      }
    });
  };

  const handleSearch = (value, selectType) => {
    switch (selectType) {
      case 'obj':
        {
          const newArr = titlerecords.filter(item => {
            return item.includes(value);
          });
          if (newArr.length > 0) {
            setObjautodata(newArr);
          } else {
            setObjautodata([]);
          }
        }
        break;
      default:
        break;
    }
  };

  const enddisabledDate = current => {
    if (startTime || endTime) {
      return current < moment(startTime);
    }
    return [];
  };

  useEffect(() => {
    startTime = new Date();
    endTime = new Date();
    handletitleSearch({ module: '作业单', field: '对象', key: '' });
    // 此处从服务端获取html格式的编辑器内容
    // const editContent = main.content;
    // 使用BraftEditor.createEditorState将html字符串转换为编辑器需要的editorStat
    // setEditorState(BraftEditor.createEditorState(editContent))
  }, []);

  // const handleEditorChange = (params) => {
  //   htmlContent = editorState.toHTML();
  //   setEditorState(params);
  // }

  // useEffect(() => {
  //   setFieldsValue({main_content:htmlContent});
  // }, [editorState])

  const getTypebyTitle = title => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.title === title)[0].children;
    }
    return [];
  };

  const selectOnchange = (value, option) => {
    taskperson = false;
    setFieldsValue({
      main_operationUser: value,
      main_operationUserId: option.key,
    });
  };

  const taskType = getTypebyTitle('作业类型');
  const taskNature = getTypebyTitle('作业性质');
  const taskCompany = getTypebyTitle('作业单位');
  const WorkOrder = getTypebyTitle('是否开票');

  // const sendUploadStatus = (v) => {
  //   dispatch({
  //     type: 'viewcache/getolduploadstatus',
  //     payload: {
  //       olduploadstatus: v
  //     }
  //   })
  // };

  // useEffect(() => {
  //   sendUploadStatus(false);
  //   // let doCancel = false;
  //   // if (fileslist && fileslist.length && fileslist.length > 0 && !doCancel) {
  //   //   setUploadFiles(fileslist);
  //   // }
  //   return () => {
  //     // doCancel = true;
  //     sendUploadStatus(false);
  //   };
  // }, []);

  const handledownload = filesinfo => {
    FileDownload(filesinfo.uid).then(res => {
      const filename = filesinfo.name;
      const blob = new Blob([res]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };

  // 不允许上传类型
  useEffect(() => {
    getFileSecuritySuffix().then(res => {
      if (res.code === 200) {
        const arr = [...res.data];
        setFileType(arr);
      }
    });
  }, []);

  const uploadprops = {
    name: 'file',
    action: '/sys/file/upload',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    },
    showUploadList: { showDownloadIcon: showIcon, showRemoveIcon: true },
    defaultFileList: files,
    multiple: true,
    openFileDialogOnClick: !banOpenFileDialog,

    beforeUpload(file) {
      return new Promise((resolve, reject) => {
        setShowIcon(false);
        if (getUploadStatus) { getUploadStatus(true) };
        if (getRegistUploadStatus) { getRegistUploadStatus(true) };
        const type = file.name.lastIndexOf('.');
        const filesuffix = file.name.substring(type + 1, file.name.length);
        const correctfiletype = filetype.indexOf(filesuffix);
        if (correctfiletype === -1) {
          message.error(`${file.name}文件不符合上传规则,禁止上传...`);
          return reject();
        }
        return resolve(file);
      }
      );
    },

    onChange({ file, fileList }) {
      const allsuccess = fileList.map(item => item.response && item.response.fileUploadInfo && item.response.fileUploadInfo.length > 0);
      const alldone = fileList.map(item => item.status !== 'done');
      if (file.status === 'done' && alldone.indexOf(true) === -1 && file.response && file.response.code === 200 && allsuccess.indexOf(true) === -1) {
        const arr = [...fileList];
        const newarr = [];
        for (let i = 0; i < arr.length; i += 1) {
          const vote = {};
          vote.uid = arr[i]?.response?.data[0]?.id !== undefined ? arr[i]?.response?.data[0]?.id : arr[i].uid;
          vote.name = arr[i].name;
          vote.fileUrl = '';
          vote.status = arr[i].status;
          newarr.push(vote);
        }
        setFilesList([...newarr]);
        ChangeFiles({ arr: [...newarr], ischange: true });
        setShowIcon(true);
        if (getUploadStatus) { getUploadStatus(false) };
        if (getRegistUploadStatus) { getRegistUploadStatus(false) };
      }
    },
    onPreview(filesinfo) {
      if (showIcon) {
        handledownload(filesinfo);
      }

    },
    onDownload(filesinfo) {
      handledownload(filesinfo);
    },
    onRemove(filesinfo) {
      return new Promise((resolve, reject) => {
        const values = getFieldsValue();
        if ((values.main_plannedStartTime).valueOf() < (values.main_plannedEndTime).valueOf()) {
          const newfilelist = fileslist.filter(item => item.uid !== filesinfo.uid);
          // 删除文件
          if (filesinfo && !filesinfo.lastModified) {
            FileDelete(filesinfo.uid).then(res => {
              if (res.code === 200) {
                ChangeFiles({ arr: newfilelist, ischange: true });
              }
            });
          } else {
            message.success('已中止文件上传');
            setShowIcon(true);
            getUploadStatus(false);
            if (getUploadStatus) { getUploadStatus(false) };
            if (getRegistUploadStatus) { getRegistUploadStatus(false) };
          }
          return resolve()
        }

        if ((values.main_plannedStartTime).valueOf() > (values.main_plannedEndTime).valueOf()) {
          return reject()
        }

        return []
      }).catch(() => {
        return new Promise((resolve) => {
          return resolve(false)
        })
      })
    },
  };

  const handleDoubleClick = (e) => {
    if (e.target) {
      if (showinput) {
        const textheight = e.target.scrollHeight + 2;
        e.target.style.maxHeight = '9.0072e+15px';
        e.target.style.height = `${textheight}px`;
      } else {
        e.target.style.maxHeight = '31px';
        e.target.style.height = '31px';
      };
      setShowinput(!showinput)
    }
  }

  const required = true;

  return (
    <>
      <Row gutter={16}>
        <SysDict
          typeid="481"
          commonid="335"
          ChangeSelectdata={newvalue => setSelectData(newvalue)}
          style={{ display: 'none' }}
        />
        <div className={styles.autoCompleteallowclear}>
          <Form {...formItemLayout}>
            <Col span={8}>
              <Form.Item label="作业计划编号">
                {getFieldDecorator('main_operationNo', {
                  rules: [
                    {
                      message: '请输入问题编号',
                    },
                  ],
                  initialValue: main.operationNo,
                })(<Input disabled />)}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="填报时间">
                {getFieldDecorator('main_addTime', {
                  initialValue: moment(main.addTime || new Date()),
                })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" disabled />)}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="作业系统名称">
                {getFieldDecorator('main_systemName', {
                  rules: [
                    {
                      required,
                      message: '请输入作业系统名称',
                    },
                  ],
                  initialValue: main.systemName,
                })(<Input placeholder="请输入" allowClear disabled={type} />)}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="作业类型">
                {getFieldDecorator('main_type', {
                  rules: [
                    {
                      required,
                      message: '请选择作业类型',
                    },
                  ],
                  initialValue: main.type,
                })(
                  <Select
                    placeholder="请选择"
                    disabled={type}
                    getPopupContainer={e => e.parentNode}
                  >
                    {taskType.map(obj => [
                      <Option key={obj.key} value={obj.dict_code}>
                        {obj.title}
                      </Option>,
                    ])}
                  </Select>,
                )}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="作业性质">
                {getFieldDecorator('main_nature', {
                  rules: [
                    {
                      required,
                      message: '请选择作业性质',
                    },
                  ],
                  initialValue: main.nature,
                })(
                  <Select
                    placeholder="请选择"
                    disabled={type}
                    getPopupContainer={e => e.parentNode}
                  >
                    {taskNature.map(obj => [
                      <Option key={obj.key} value={obj.dict_code}>
                        {obj.title}
                      </Option>,
                    ])}
                  </Select>,
                )}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="作业单位">
                {getFieldDecorator('main_operationUnit', {
                  rules: [
                    {
                      required,
                      message: '请选择作业单位',
                    },
                  ],
                  initialValue: main.operationUnit,
                })(
                  <Select
                    placeholder="请选择"
                    disabled={type}
                    getPopupContainer={e => e.parentNode}
                  >
                    {taskCompany.map(obj => [
                      <Option key={obj.key} value={obj.dict_code}>
                        {obj.title}
                      </Option>,
                    ])}
                  </Select>,
                )}
              </Form.Item>
            </Col>

            {operationPersonSelect && operationPersonSelect.length && (
              <Col span={8}>
                <Form.Item label="作业负责人">
                  {getFieldDecorator('main_operationUser', {
                    rules: [
                      {
                        required,
                        message: '请选择作业负责人',
                      },
                    ],
                    initialValue: main.operationUser,
                  })(
                    <Select
                      onChange={selectOnchange}
                      disabled={type}
                      getPopupContainer={e => e.parentNode}
                    >
                      {operationPersonSelect.map(obj => [
                        <Option key={obj.key} value={obj.value}>
                          {obj.value}
                        </Option>,
                      ])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            )}

            <Col span={8} style={{ display: 'none' }}>
              <Form.Item label="开工作票">
                {getFieldDecorator('main_operationUserId', {
                  rules: [
                    {
                      required,
                      message: '请选择是否开工作票',
                    },
                  ],
                  initialValue: main.operationUserId,
                })(
                  <Radio.Group>
                    {WorkOrder.map(obj => [
                      <Radio key={obj.key} value={obj.dict_code}>
                        {obj.title}
                      </Radio>,
                    ])}
                  </Radio.Group>,
                )}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="开工作票">
                {getFieldDecorator('main_billing', {
                  rules: [
                    {
                      required,
                      message: '请选择开工作票',
                    },
                  ],
                  initialValue: main.billing,
                })(
                  <Radio.Group disabled={type}>
                    {WorkOrder.map(obj => [
                      <Radio key={obj.key} value={obj.dict_code}>
                        {obj.title}
                      </Radio>,
                    ])}
                  </Radio.Group>,
                )}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="作业状态">
                {getFieldDecorator(
                  'main_status',
                  {},
                )(
                  <Tag color={status ? color[statusContent.indexOf(status)] : 'blue'}>
                    {status || '计划中'}
                  </Tag>,
                )}
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="作业对象" {...forminladeLayout}>
                {getFieldDecorator('main_object', {
                  rules: [
                    {
                      required,
                      message: '请输入作业对象',
                    },
                  ],
                  initialValue: main.object,
                })(
                  <AutoComplete
                    disabled={type}
                    dataSource={objautodata}
                    onSearch={value => handleSearch(value, 'obj')}
                    filterOption={(inputValue, option) =>
                      option.props.children.includes(inputValue)
                    }
                  >
                    <TextArea
                      disabled={type}
                      autoSize={{ minRows: 1 }}
                      placeholder="请输入"
                      onDoubleClick={(e) => handleDoubleClick(e, 'object')}
                    />
                  </AutoComplete>,
                )}
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="作业内容" {...forminladeLayout}>
                {getFieldDecorator('main_content', {
                  rules: [
                    {
                      required,
                      message: '请输入作业内容',
                    },
                  ],
                  initialValue: main.content,
                })(
                  <FormTextArea
                    autoSize={1}
                    indexText={main.content}
                    isEdit
                    getVal={v => setFieldsValue({ main_content: v })}
                  />
                )}
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="风险分析" {...forminladeLayout}>
                {getFieldDecorator('main_riskAnalysis', {
                  rules: [
                    {
                      required,
                      message: '请输入风险分析',
                    },
                  ],
                  initialValue: main.riskAnalysis,
                })(
                  <FormTextArea
                    autoSize={1}
                    indexText={main.riskAnalysis}
                    isEdit
                    getVal={v => setFieldsValue({ main_riskAnalysis: v })}
                  />
                )}
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="风险应对措施" {...forminladeLayout}>
                {getFieldDecorator('main_riskMeasures', {
                  rules: [
                    {
                      required,
                      message: '请输入风险应对措施',
                    },
                  ],
                  initialValue: main.riskMeasures,
                })(
                  <FormTextArea
                    autoSize={1}
                    indexText={main.riskMeasures}
                    isEdit
                    getVal={v => setFieldsValue({ main_riskMeasures: v })}
                  />
                )}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="计划开始时间">
                {getFieldDecorator('main_plannedStartTime', {
                  rules: [
                    {
                      required,
                      message: '请选择计划开始时间',
                    },
                  ],
                  initialValue: moment(main.plannedStartTime || moment(new Date(moment(new Date()).format('YYYY-MM-DD 09:00:00')))),
                })(
                  // <div>
                  <DatePicker
                    // defaultValue={moment(main.plannedStartTime || moment(new Date(moment(new Date()).format('YYYY-MM-DD 09:00:00'))))}
                    disabled={type}
                    // onChange={onChange}
                    format="YYYY-MM-DD HH:mm:ss"
                    allowClear={false}
                    showTime
                  />,
                  {/* </div> */ }
                )}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="计划结束时间">
                {getFieldDecorator('main_plannedEndTime', {
                  rules: [
                    {
                      required,
                      message: '请选择计划结束时间',
                    },
                  ],
                  initialValue: main && main.plannedEndTime ? moment(main.plannedEndTime) : moment(new Date(moment(new Date()).format('YYYY-MM-DD 18:00:00'))),
                })(
                  // <div>
                  <DatePicker
                    // defaultValue={main && main.plannedEndTime ? moment(main.plannedEndTime) : moment(new Date(moment(new Date()).format('YYYY-MM-DD 18:00:00')))}
                    disabled={type}
                    // onChange={endtimeonChange}
                    allowClear={false}
                    format="YYYY-MM-DD HH:mm:ss"
                    showTime
                  // disabledDate={enddisabledDate}
                  />,
                  {/* </div> */ }

                )}
              </Form.Item>
            </Col>

            {type !== '计划中' && type && (
              <Col span={8}>
                <Form.Item label="延期结束时间">
                  {getFieldDecorator('plannedEndTime', {
                    rules: [
                      {
                        required,
                        message: '请选择计划结束时间',
                      },
                    ],
                    initialValue: moment(main.plannedEndTime),
                  })(
                    <DatePicker
                      showTime
                      // disabled={type === 'list'}
                      onChange={endtimeonChange}
                      format="YYYY-MM-DD HH:mm:ss"
                      disabledDate={enddisabledDate}
                    />,
                  )}
                </Form.Item>
              </Col>
            )}

            <Col span={24}>
              <Form.Item label="上传附件" {...forminladeLayout}>
                {getFieldDecorator('main_fileIds', {
                  initialValue: main && main.fileIds ? main.fileIds : '',
                })(
                  <div
                    onMouseDown={() => {
                      setBanOpenFileDialog(true);
                      const values = getFieldsValue()
                      validateFields(['main_operationUser'], (err) => {
                        if (err) {
                          message.error('请先选择作业负责人');
                        }

                        if (!err) {
                          if ((values.main_plannedStartTime).valueOf() > (values.main_plannedEndTime).valueOf()) {
                            message.error('计划开始时间必须小于计划结束时间')
                          } else {
                            setBanOpenFileDialog(false)
                          }
                          if (handleUploadStatus) {
                            message.info('文件正在上传中，请稍后再上传');
                          }
                        }

                      })
                    }}
                  >
                    <Upload {...uploadprops}>
                      <Button type="primary">
                        <DownloadOutlined /> 上传附件
                      </Button>
                      {filetype && filetype.length > 0 && (
                        <span style={{ color: '#ccc', lineHeight: '20px', paddingLeft: 16 }}>
                          1、仅能上传{filetype.join('，')}类型文件；2、最多可上传20个文件；3、附件名称最长100个字符；
                        </span>
                      )}
                    </Upload>
                  </div>,
                )}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="填报人">
                {getFieldDecorator('main_addUser', {
                  initialValue: useInfo.userName,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="填报单位">
                {getFieldDecorator('main_addUnit', {
                  initialValue: useInfo.unitName,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
          </Form>
        </div>

      </Row>
    </>
  );
});

OperationPlanfillin.defaultProps = {
  main: {
    operationNo: '',
    systemName: '',
    type: '',
    nature: '',
    operationUnit: '',
    operationUser: '',
    billing: '',
    object: '',
    content: '',
    plannedStartTime: new Date(),
    plannedEndTime: new Date(),
    status: '',
  },
  useInfo: {
    userName: '',
    unitName: '',
  },
};

export default Form.create({})(OperationPlanfillin);
