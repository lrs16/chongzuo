import React, { useState, useRef, useImperativeHandle, useEffect } from 'react';
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  DatePicker,
  AutoComplete,
  Spin,
  Radio,
  Tag
} from 'antd';
import moment from 'moment';
import SysUpload from '@/components/SysUpload';
import { getAndField } from '@/pages/SysManage/services/api';
import SysDict from '@/components/SysDict';
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css';

const { Option } = Select;
const { TextArea, Search } = Input;
let startTime;
let endTime;


const OperationPlanfillin = React.forwardRef((props, ref) => {
  const {
    form: { getFieldDecorator, setFieldsValue },
    // match: { params: { id, executestatus,checkoutstatus } },
    formItemLayout,
    forminladeLayout,
    useInfo,
    files,
    ChangeFiles,
    location,
    main,
    type,
    executestatus,
    getRichtext,
  } = props;
  console.log('files: ', files);

  // const {
  //   match: { params: { id, executestatus,checkoutstatus } }
  // } = props;

  const statusContent = ['计划中', '已延期', '已超时', '已完成']
  const color = ['blue', 'yellow', 'green', 'green'];
  const [titlerecords, setTitleRecords] = useState([]);
  const [selectdata, setSelectData] = useState('');
  const [fileslist, setFilesList] = useState([]);
  const [titleautodata, setTitleAutoData] = useState([]);
  const [objautodata, setObjautodata] = useState([]);
  const [editorState, setEditorState] = useState('');

  useEffect(() => {
    ChangeFiles(fileslist);
  }, [fileslist]);

  const attRef = useRef();
  useImperativeHandle(
    ref,
    () => ({
      attRef,
    }),
    [],
  );

  const onChange = (date, dateString) => {
    setFieldsValue({ plannedStarTtime: moment(dateString) })
    startTime = dateString;
  }

  const endtimeonChange = (date, dateString) => {
    setFieldsValue({ plannedEndTime: moment(dateString) })
    endTime = dateString;
  }

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
      case 'obj': {
        const newArr = titlerecords.filter(item => {
          return item.includes(value);
        })
        if (newArr.length > 0) {
          setObjautodata(newArr);
        } else {
          setObjautodata([])
        }
      }
        break;
      default:
        break;
    }
  }

  const startdisabledDate = (current) => {
    if (startTime || endTime) {
      return current > moment(endTime)
    }
  }

  const enddisabledDate = (current) => {
    if (startTime || endTime) {
      return current < moment(startTime)
    }
  }


  useEffect(() => {
    startTime = new Date()
    endTime = new Date()
    handletitleSearch({ module: '作业单', field: '对象', key: '' })
    // 假设此处从服务端获取html格式的编辑器内容
    const img = <p>fff</p>
    const htmlContent = `ppp`
    // const htmlContent = 'gg'
    // 使用BraftEditor.createEditorState将html字符串转换为编辑器需要的editorStat
    setEditorState(BraftEditor.createEditorState(htmlContent))
  }, [])

  const handleEditorChange = (params) => {
    const htmlContent = editorState.toHTML();
    console.log('htmlContent: ', htmlContent);
    setEditorState(params);
    getRichtext(htmlContent);
  }

  const getTypebyTitle = title => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.title === title)[0].children;
    }
    return [];
  };

  const taskType = getTypebyTitle('作业类型');
  const taskNature = getTypebyTitle('作业性质');
  const taskCompany = getTypebyTitle('作业单位');

  const required = true;

  return (
    <>
      <Row gutter={16}>
        <SysDict
          typeid="1385513049263181825"
          commonid="1354288354950123522"
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
              })(<Input disabled />)}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="填报时间">
              {getFieldDecorator('main_addTime', {

                initialValue: moment(new Date())
              })(
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  disabled />
              )}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="作业系统名称" >
              {getFieldDecorator('main_system', {
                rules: [
                  {
                    required,
                    message: '请输入作业系统名称'
                  }
                ],
              })(
                <Input
                  placeholder='请输入'
                  allowClear
                  disabled={type}
                />)}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="作业类型">
              {getFieldDecorator('main_type', {
                rules: [
                  {
                    required,
                    message: '请输入作业类型'
                  }
                ],
              })
                (
                  <Select
                    placeholder="请选择"
                    allowClear
                    disabled={type}
                  >
                    {taskType.map(obj => [
                      <Option key={obj.key} value={obj.title}>
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
                    message: '请输入作业性质'
                  }
                ],
              })
                (
                  <Select
                    placeholder="请选择"
                    allowClear
                    disabled={type}
                  >
                    {taskNature.map(obj => [
                      <Option key={obj.key} value={obj.title}>
                        {obj.title}
                      </Option>,
                    ])}
                  </Select>,
                )
              }
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="作业单位">
              {getFieldDecorator('main_operationUnit', {
                rules: [
                  {
                    required,
                    message: '请输入作业单位'
                  }
                ],
              })(
                <Select
                  placeholder="请选择"
                  allowClear
                  disabled={type}
                >
                  {taskCompany.map(obj => [
                    <Option key={obj.key} value={obj.title}>
                      {obj.title}
                    </Option>,
                  ])}
                </Select>,
              )
              }</Form.Item>
          </Col>


          <Col span={8}>
            <Form.Item label="作业负责人">
              {getFieldDecorator('main_operationUser', {
                rules: [
                  {
                    required,
                    message: '请输入作业负责人'
                  }
                ],
              })
                (<Input disabled={type} />)}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="开工作票">
              {getFieldDecorator('main_billing', {
                rules: [
                  {
                    required,
                    message: '请输入开工作票'
                  }
                ],
              })
                (
                  <Radio.Group disabled={type}>
                    <Radio value='是'>是</Radio>
                    <Radio value='否'>否</Radio>
                  </Radio.Group>
                )}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="作业状态">
              {getFieldDecorator('main_status', {})
                (
                  <Tag
                    color={executestatus ? color[statusContent.indexOf(executestatus)] : "blue"}>
                    {executestatus || '计划中'}
                  </Tag>
                )}
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="作业对象" {...forminladeLayout}>
              {getFieldDecorator('main_object', {
                rules: [
                  {
                    required,
                    message: '请输入审核结果'
                  }
                ],
              })
                (
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
                    message: '请输入作业内容'
                  }
                ],
              })
                (
                  <BraftEditor
                    value={editorState}
                    onChange={handleEditorChange}
                    disabled={type}
                  />
                )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="计划开始时间">
              {getFieldDecorator('main_plannedStarTtime', {
                rules: [
                  {
                    required,
                    message: '请输入计划开始时间'
                  }
                ],
                initialValue: main.plannedStarTtime
              })
                (
                  <DatePicker
                    disabled={type}
                    showTime
                    onChange={onChange}
                    format="YYYY-MM-DD HH:mm:ss"
                    disabledDate={startdisabledDate}
                  />
                )}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="计划结束时间">
              {getFieldDecorator('main_plannedEndTime', {
                rules: [
                  {
                    required,
                    message: '请输入计划结束时间'
                  }
                ],
                initialValue: main.plannedEndTime
              })
                (
                  <DatePicker
                    disabled={type}
                    showTime
                    onChange={endtimeonChange}
                    format="YYYY-MM-DD HH:mm:ss"
                    disabledDate={enddisabledDate}
                  />
                )}
            </Form.Item>
          </Col>

          {(type !== '计划中' && type) && (
            <Col span={8}>
              <Form.Item label="延期结束时间">
                {getFieldDecorator('plannedEndTime', {
                  rules: [
                    {
                      required,
                      message: '请输入计划结束时间'
                    }
                  ],
                  initialValue: main.plannedEndTime
                })
                  (
                    <DatePicker
                      showTime
                      // disabled={type === 'list'}
                      onChange={endtimeonChange}
                      format="YYYY-MM-DD HH:mm:ss"
                      disabledDate={enddisabledDate}
                    />
                  )}
              </Form.Item>
            </Col>
          )}


          <Col span={24}>
            <Form.Item label="上传附件" {...forminladeLayout}>
              {getFieldDecorator('main_fileIds', {})
                (
                  <div style={{ width: 400 }}>
                    <SysUpload
                      fileslist={files}
                      ChangeFileslist={newvalue => setFilesList(newvalue)}
                    />
                  </div>
                )}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="填报人">
              {getFieldDecorator('main_addUser', {
                initialValue: useInfo.userName
              })
                (
                  <Input disabled />
                )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="填报单位">
              {getFieldDecorator('main_importance', {
                initialValue: useInfo.unitName
              })
                (
                  <Input disabled />
                )}
            </Form.Item>
          </Col>

        </Form>
      </Row>

    </>
  );
});

OperationPlanfillin.defaultProps = {
  main: {
    plannedStarTtime: moment(new Date()),
    plannedEndTime: moment(new Date()),
    status: '',

  },
  register: {
    complainUser: '',
  },
  useInfo: {
    userName: '',
    deptNameExt: '',
  },
};

export default Form.create({})(OperationPlanfillin);
