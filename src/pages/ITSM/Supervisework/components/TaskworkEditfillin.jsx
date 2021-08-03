import React, { useState, useRef, useImperativeHandle, useEffect } from 'react';
import {
    Row,
    Col,
    Form,
    Input,
    Select,
    DatePicker,
    // AutoComplete,
    // Radio,
    Tag
} from 'antd';
import moment from 'moment';
import SysUpload from '@/components/SysUpload';
// import RichTextEditor from '@/components/RichTextEditor';
// import { getAndField } from '@/pages/SysManage/services/api';
// import SysDict from '@/components/SysDict';
// import BraftEditor from 'braft-editor'
// import 'braft-editor/dist/index.css';

const { Option } = Select;
const { TextArea, Search } = Input;
// let startTime;
// let endTime;
// let htmlContent;
let taskperson = true;

const TaskworkEditfillin = React.forwardRef((props, ref) => {
    const {
        form: { getFieldDecorator, getFieldsValue, resetFields,  setFieldsValue },
        formItemLayout,
        forminladeLayout,
        useInfo,
        files,
        ChangeFiles,
        main,
        // type,
        status,
        superviseworkPersonSelect,
    } = props;

      const statusContent = ['计划中', '延期中', '已超时', '已完成']
      const color = ['blue', 'orange', 'red', 'green'];
    //   const [titlerecords, setTitleRecords] = useState([]);
    //   const [selectdata, setSelectData] = useState('');
    const [fileslist, setFilesList] = useState([]);
    //   const [objautodata, setObjautodata] = useState([]);

    useEffect(() => {
        ChangeFiles(fileslist);
    }, [fileslist]);

      useEffect(() => {
        taskperson = true;
        if (main.workUser) {
          taskperson = false;
        }
      }, []);

    const attRef = useRef();
    // useImperativeHandle(
    //     ref,
    //     () => ({
    //         attRef,
    //     }),
    //     [],
    // );

    useImperativeHandle(ref, () => ({
        getVal: () => getFieldsValue(),
        resetVal: () => resetFields(),
        Forms: props.form.validateFieldsAndScroll,
        attRef
      }), []);

    // const handleFormValidator = (rule, value, callback) => {
    //     if (value === '' || value === '<p></p>') {
    //       callback(rule)
    //     }
    //     callback()
    // }

    //   const onChange = (date, dateString) => {
    //     setFieldsValue({ plannedStarTtime: moment(dateString) })
    //     startTime = dateString;
    //   }

    //   const endtimeonChange = (date, dateString) => {
    //     setFieldsValue({ plannedEndTime: moment(dateString) })
    //     endTime = dateString;
    //   }

    //   const handletitleSearch = values => {
    //     getAndField(values).then(res => {
    //       if (res.code === 200 && res.data.length > 0) {
    //         const newdata = res.data.map(item => {
    //           return item.content;
    //         });
    //         setObjautodata(newdata);
    //       }
    //     });
    //   };


    //   const handleSearch = (value, selectType) => {
    //     switch (selectType) {
    //       case 'obj': {
    //         const newArr = titlerecords.filter(item => {
    //           return item.includes(value);
    //         })
    //         if (newArr.length > 0) {
    //           setObjautodata(newArr);
    //         } else {
    //           setObjautodata([])
    //         }
    //       }
    //         break;
    //       default:
    //         break;
    //     }
    //   }

    //   const startdisabledDate = (current) => {
    //     if (startTime || endTime) {
    //       return current > moment(endTime)
    //     }
    //   }

    //   const enddisabledDate = (current) => {
    //     if (startTime || endTime) {
    //       return current < moment(startTime)
    //     }
    //   }


    //   useEffect(() => {
    //     startTime = new Date()
    //     endTime = new Date()
    //     handletitleSearch({ module: '作业单', field: '对象', key: '' })
    //     // 此处从服务端获取html格式的编辑器内容
    //     // const editContent = main.content;
    //     // 使用BraftEditor.createEditorState将html字符串转换为编辑器需要的editorStat
    //     // setEditorState(BraftEditor.createEditorState(editContent))
    //   }, [])

    // const handleEditorChange = (params) => {
    //   htmlContent = editorState.toHTML();
    //   setEditorState(params);
    // }

    // useEffect(() => {
    //   setFieldsValue({main_content:htmlContent});
    // }, [editorState])

    //   const getTypebyTitle = title => {
    //     if (selectdata.ischange) {
    //       return selectdata.arr.filter(item => item.title === title)[0].children;
    //     }
    //     return [];
    //   };

      const selectOnchange = (value, option) => {
        taskperson = false;
        setFieldsValue({
          main_workUser: value,
          main_workUserId: option.key
        });
      }

    //   const taskType = getTypebyTitle('作业类型');
    //   const taskNature = getTypebyTitle('作业性质');
    //   const taskCompany = getTypebyTitle('作业单位');
    //   const WorkOrder = getTypebyTitle('是否开票')

    const required = true;

    return (
        <div style={{ paddingRight: 24 }}>
            <Row gutter={24}>
                <Form {...formItemLayout} >
                    <Col span={8}>
                        <Form.Item label="表单id" style={{ display: 'none' }}>
                            {getFieldDecorator('main_id', {
                                initialValue: '',
                            })(<Input disabled />)}
                        </Form.Item>
                        <Form.Item label="工作任务编号" >
                            {getFieldDecorator('main_no', {
                                initialValue: main.no,
                            })(<Input disabled />)}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="填报时间">
                            {getFieldDecorator('main_addTime', {
                                initialValue: moment(new Date()),
                            })(
                                <DatePicker
                                    showTime
                                    format="YYYY-MM-DD hh:mm:ss"
                                    style={{ width: '100%' }}
                                    allowClear />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="工作状态">
                            {getFieldDecorator('main_status', {})
                            (
                            //   <Tag color="blue">计划中</Tag>
                              <Tag
                                    color={status ? color[statusContent.indexOf(status)] : "blue"}>
                                    {status || '计划中'}
                              </Tag>
                            )}
                        </Form.Item>
                    </Col>
                    {
                        superviseworkPersonSelect && superviseworkPersonSelect.length && (
                            <Col span={8}>
                                <Form.Item label="工作负责人">
                                    {getFieldDecorator('main_workUser', {
                                        rules: [
                                            {
                                                required,
                                                message: '请输入'
                                            }
                                        ],
                                        initialValue: main.workUser
                                    })
                                        (
                                            <Select onChange={selectOnchange}>
                                                {superviseworkPersonSelect.map(obj => [
                                                    <Option key={obj.key} value={obj.value}>
                                                        {obj.value}
                                                    </Option>
                                                ])}
                                            </Select>
                                        )}
                                </Form.Item>
                                <Form.Item label="工作负责人Id" style={{display: 'none'}}>
                                    {getFieldDecorator('main_workUserId', {
                                        initialValue: ''
                                    })
                                        (
                                            <Select onChange={selectOnchange}>
                                                {superviseworkPersonSelect.map(obj => [
                                                    <Option key={obj.key} value={obj.value}>
                                                        {obj.value}
                                                    </Option>
                                                ])}
                                            </Select>
                                        )}
                                </Form.Item>
                            </Col>
                        )
                    }
                    <Col span={24}>
                        <Form.Item label="工作内容" {...forminladeLayout}>
                            {getFieldDecorator('main_content', {
                                rules: [{ required, message: '请输入工作内容' }, {
                                    // validator: handleFormValidator
                                }],
                                initialValue: main.content
                            })(
                                <TextArea
                                    // disabled={type}
                                    rows={4} />
                                // <RichTextEditor cachevalue='' ChangeValue={v => setFieldsValue({ content: v })} />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="计划开始时间">
                            {getFieldDecorator('main_plannedStartTime', {
                                rules: [
                                    {
                                        required,
                                        message: '请输入计划开始时间'
                                    }
                                ],
                                initialValue: moment(main.plannedStartTime),
                            })
                                (
                                    <DatePicker
                                        showTime
                                        format="YYYY-MM-DD HH:mm:ss"
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
                                initialValue: moment(main.plannedEndTime),
                            })
                                (
                                    <DatePicker
                                        showTime
                                        format="YYYY-MM-DD HH:mm:ss"
                                    />
                                )}
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label="上传附件" {...forminladeLayout}>
                            {getFieldDecorator('main_fileIds', {
                                initialValue: main && main.fileIds ? main.fileIds : '',
                            })
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
                            {getFieldDecorator('main_addUnit', {
                                initialValue: useInfo.unitName
                            })
                                (
                                    <Input disabled />
                                )}
                        </Form.Item>
                    </Col>
                </Form>
            </Row>
        </div>
    );
});

TaskworkEditfillin.defaultProps = {
    main: {
        no: '',
        workUser: '',
        addUnit: '',
        addUser: '',
        content: '',
        plannedStartTime: new Date(),
        plannedEndTime: new Date(),
        status: '',
    },
    useInfo: {
        userName: '',
        unitName: ''
    }
};

export default Form.create({})(TaskworkEditfillin);