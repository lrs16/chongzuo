import React, { useState, useRef, useImperativeHandle, useEffect } from 'react';
import { Row, Col, Form, Input, Select, DatePicker, AutoComplete, Radio, Tag } from 'antd';
import moment from 'moment';
import SysUpload from '@/components/SysUpload';
import { getAndField } from '@/pages/SysManage/services/api';
import SysDict from '@/components/SysDict';
// import BraftEditor from 'braft-editor'
// import 'braft-editor/dist/index.css';

const { Option } = Select;
const { TextArea } = Input;
let startTime;
let endTime;
let taskperson = true;

const OperationPlanfillin = React.forwardRef((props, ref) => {
  const {
    form: { getFieldDecorator, setFieldsValue },
    formItemLayout,
    forminladeLayout,
    useInfo,
    files,
    ChangeFiles,
    main,
    type,
    status,
    operationPersonSelect,
  } = props;

  const statusContent = ['计划中', '延期中', '已超时', '已完成'];
  const color = ['blue', 'yellow', 'red', 'green'];
  const [titlerecords, setTitleRecords] = useState([]);
  const [selectdata, setSelectData] = useState('');
  const [fileslist, setFilesList] = useState([]);
  const [objautodata, setObjautodata] = useState([]);

  useEffect(() => {
    ChangeFiles(fileslist);
  }, [fileslist]);

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
    setFieldsValue({ plannedStarTtime: moment(dateString) });
    startTime = dateString;
  };

  const endtimeonChange = (date, dateString) => {
    setFieldsValue({ plannedEndTime: moment(dateString) });
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

  const startdisabledDate = current => {
    if (startTime || endTime) {
      return current > moment(endTime);
    }
    return [];
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
                initialValue: moment(new Date()),
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
                    message: '请输入作业类型',
                  },
                ],
                initialValue: main.type,
              })(
                <Select placeholder="请选择" allowClear disabled={type}>
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
                    message: '请输入作业性质',
                  },
                ],
                initialValue: main.nature,
              })(
                <Select placeholder="请选择" allowClear disabled={type}>
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
                    message: '请输入作业单位',
                  },
                ],
                initialValue: main.operationUnit,
              })(
                <Select placeholder="请选择" allowClear disabled={type}>
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
                      message: '请输入作业负责人',
                    },
                  ],
                  initialValue: main.operationUser,
                })(
                  <Select onChange={selectOnchange} disabled={type}>
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
                    message: '请输入开工作票',
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
                    message: '请输入开工作票',
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
                >
                  <TextArea
                    // autoSize={{ minRows: 3 }}
                    placeholder="请输入"
                    disabled={type}
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
                <TextArea disabled={type} rows={4} />,
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
                <TextArea disabled={type} rows={4} />,
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
                <TextArea disabled={type} rows={4} />,
              )}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="计划开始时间">
              {getFieldDecorator('main_plannedStartTime', {
                rules: [
                  {
                    required,
                    message: '请输入计划开始时间',
                  },
                ],
                initialValue: moment(main.plannedStartTime),
              })(
                <DatePicker
                  disabled={type}
                  showTime
                  onChange={onChange}
                  format="YYYY-MM-DD HH:mm:ss"
                  disabledDate={startdisabledDate}
                />,
              )}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="计划结束时间">
              {getFieldDecorator('main_plannedEndTime', {
                rules: [
                  {
                    required,
                    message: '请输入计划结束时间',
                  },
                ],
                initialValue: moment(main.plannedEndTime),
              })(
                <DatePicker
                  disabled={type}
                  showTime
                  onChange={endtimeonChange}
                  format="YYYY-MM-DD HH:mm:ss"
                  disabledDate={enddisabledDate}
                />,
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
                      message: '请输入计划结束时间',
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

          <Col span={24} style={{ display: taskperson || type ? 'none' : 'block' }}>
            <Form.Item label="上传附件" {...forminladeLayout}>
              {getFieldDecorator('main_fileIds', {
                initialValue: main && main.fileIds ? main.fileIds : '',
              })(
                <div style={{ width: 400 }}>
                  <SysUpload
                    disabled={type}
                    fileslist={files}
                    ChangeFileslist={newvalue => setFilesList(newvalue)}
                  />
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
