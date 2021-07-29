import React, { useRef, useImperativeHandle, useEffect, useState } from 'react';
import moment from 'moment';
import SysUpload from '@/components/SysUpload'; // 附件下载组件
import { Form, Row, Col, Input, DatePicker, Select } from 'antd';
import KeyVal from '@/components/SysDict/KeyVal';
import KnowledgCollect from '@/components/KnowledgeCollect';

const { TextArea } = Input;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

const forminladeLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 22 },
  },
};


const HandleChild = React.forwardRef((props, ref) => {
  const { handle, curruserinfo, ChangeFiles, ChangeFileskey, mainId } = props;
  const { getFieldDecorator, setFieldsValue, getFieldsValue } = props.form;
  const attRef = useRef();
  const [fileslist, setFilesList] = useState({ arr: [], ischange: false }); // 下载列表
  const [selectdata, setSelectData] = useState([]);
  const [knowledgecontent, setKonwledgeContent] = useState('');    // 知识内容
  const [valuealready, setValuealready] = useState(false)          // 告知知识子组件可以走接口了
  // 获取知识数据
  const getContent = () => {
    const values = getFieldsValue(['handleAdvise'])
    setKonwledgeContent(values.handleAdvise);
    setValuealready(true)
  }
  useEffect(() => {
    if (fileslist.ischange) {
      ChangeFiles(fileslist);
    }
  }, [fileslist]);

  useEffect(() => {
    if (
      handle &&
      handle.handleRecordAttachments !== '[]' &&
      handle.handleRecordAttachments !== undefined &&
      handle.handleRecordAttachments !== null
    ) {
      setFieldsValue({ handleRecordAttachments: handle.handleRecordAttachments }, () => { });
    }

    if (
      handle &&
      handle.handlePictureAttachments !== '[]' &&
      handle.handlePictureAttachments !== undefined &&
      handle.handlePictureAttachments !== null
    ) {
      setFieldsValue({ handlePictureAttachments: handle.handlePictureAttachments }, () => { });
    }

    if (
      handle &&
      handle.handleAttachments !== '[]' &&
      handle.handleAttachments !== undefined &&
      handle.handleAttachments !== null
    ) {
      setFieldsValue({ handleAttachments: handle.handleAttachments }, () => { });
    }
  }, []);

  const type = typeof (handle.handleRecordAttachments);
  useImperativeHandle(
    ref,
    () => ({
      attRef,
    }),
    [],
  );

  const required = true;

  useEffect(() => {
    sessionStorage.setItem('Nextflowmane', '系统运维商确认总结');
  });

  // const getTypebyTitle = (title) => {
  //   if (selectdata.length > 0) {
  //     return selectdata.filter(item => item.title === title)[0].children;
  //   }
  //   return [];
  // };

  // const handleResult = getTypebyTitle('故障处理结果');
  // console.log('handleResult: ', handleResult);

  return (
    <Row gutter={24} style={{ paddingTop: 24 }}>
      <Form {...formItemLayout}>
        <KeyVal
          style={{ display: 'none' }}
          dictModule="trouble"
          dictType="handleresult"
          ChangeSelectdata={newvalue => setSelectData(newvalue)}
        />
        <Col span={24}>
          <Form.Item label="故障详细描述" {...forminladeLayout}>
            {getFieldDecorator('handleContent', {
              rules: [
                {
                  required,
                  message: '请输入',
                },
              ],
              initialValue: handle ? handle.handleContent : '',
            })(<TextArea autoSize={{ minRows: 3 }} placeholder="请输入" />)}
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item label="故障分析及原因" {...forminladeLayout}>
            {getFieldDecorator('handleReason', {
              rules: [
                {
                  required,
                  message: '请输入',
                },
              ],
              initialValue: handle ? handle.handleReason : '',
            })(<TextArea autoSize={{ minRows: 3 }} allowClear />)}
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item label="解决措施或建议" {...forminladeLayout}>
            {getFieldDecorator('handleAdvise', {
              rules: [
                {
                  required,
                  message: '请输入',
                },
              ],
              initialValue: handle ? handle.handleAdvise : '',
            })(<TextArea autoSize={{ minRows: 3 }} allowClear />)}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="处理开始时间">
            {getFieldDecorator('handleStartTime', {
              rules: [
                {
                  required,
                  message: '请选择时间',
                },
              ],
              initialValue:
                handle && handle.handleStartTime
                  ? moment(handle.handleStartTime)
                  : moment(Date.now()),
            })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />)}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="处理完成时间">
            {getFieldDecorator('handleEndTime', {
              rules: [
                {
                  required,
                  message: '请选择时间',
                },
              ],
              initialValue:
                handle && handle.handleStartTime
                  ? moment(handle.handleEndTime)
                  : moment(Date.now()),
            })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />)}
          </Form.Item>
        </Col>
        {selectdata.handleresult !== undefined && (
          <Col span={8}>
            <Form.Item label="处理结果">
              {getFieldDecorator('handleResult', {
                rules: [
                  {
                    required,
                    message: '请选择',
                  },
                ],
                initialValue: handle ? handle.handleResult : '',
              })(
                <Select placeholder="请选择">
                  {selectdata.handleresult.map(obj => [
                    <Option key={obj.key} value={obj.val}>
                      {obj.val}
                    </Option>,
                  ])}
                </Select>,
              )}
            </Form.Item>
          </Col>
        )}
        <Col span={24} style={{ paddingLeft: '8.33333333% ' }} >
          <KnowledgCollect
            valuealready={valuealready}
            content={knowledgecontent}
            orderType='problem'
            orderId={mainId}
            ChangeValuealready={(v) => setValuealready(v)}
            HandleGEtContent={() => getContent()}
          />
        </Col>
        <Col span={24}>
          <Form.Item
            label="上传故障处理记录表"
            {...forminladeLayout}
          // extra="只能上传jpg/png/doc/xls/xlsx/pdf格式文件，单个文件不能超过500kb"
          >
            {getFieldDecorator('handleRecordAttachments', {
              rules: [
                {
                  required,
                  message: '请上传故障处理记录表！',
                },
              ],
            })(
              <div
                // style={{ width: 400 }}
                onMouseOver={() => {
                  ChangeFileskey('1');
                }}
                onFocus={() => 0}
              >
                <SysUpload
                  fileslist={
                    handle && (handle.handleRecordAttachments !== null)
                      ? JSON.parse(handle.handleRecordAttachments)
                      : []
                  }
                  ChangeFileslist={
                    newvalue => {
                      setFieldsValue({ handleRecordAttachments: JSON.stringify(newvalue.arr) });
                      setFilesList(newvalue);
                    }
                  }
                />
              </div>,
            )}
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            label="故障系统截图"
            {...forminladeLayout}
          // extra="只能上传jpg/png/doc/xls/xlsx/pdf格式文件，单个文件不能超过500kb"
          >
            {getFieldDecorator('handlePictureAttachments', {
              rules: [
                {
                  required,
                  message: '请故障系统截图！',
                },
              ],
            })(
              <div
                style={{ width: 400 }}
                onMouseOver={() => {
                  ChangeFileskey('2');
                }}
                onFocus={() => 0}
              >
                <SysUpload
                  fileslist={
                    handle && handle.handlePictureAttachments !== null
                      ? JSON.parse(handle.handlePictureAttachments)
                      : []
                  }
                  ChangeFileslist={
                    newvalue => {
                      setFieldsValue({ handlePictureAttachments: JSON.stringify(newvalue.arr) });
                      setFilesList(newvalue);
                    }
                  }
                />
              </div>,
            )}
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            label="上传附件"
            {...forminladeLayout}
          // extra="只能上传jpg/png/doc/xls/xlsx/pdf格式文件，单个文件不能超过500kb"
          >
            {getFieldDecorator(
              'handleAttachments',
              {},
            )(
              <div
                style={{ width: 400 }}
                onMouseOver={() => {
                  ChangeFileskey('3');
                }}
                onFocus={() => 0}
              >
                <SysUpload
                  fileslist={
                    handle && handle.handleAttachments !== null
                      ? JSON.parse(handle.handleAttachments)
                      : []
                  }
                  ChangeFileslist={
                    newvalue => {
                      setFieldsValue({ handleAttachments: JSON.stringify(newvalue.arr) });
                      setFilesList(newvalue);
                    }
                  }
                />
              </div>,
            )}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="处理人">
            {getFieldDecorator('handler', {
              initialValue: handle.handler || curruserinfo.userName,
            })(<Input disabled />)}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="处理人单位">
            {getFieldDecorator('handleUnit', {
              initialValue: handle.handleUnit || curruserinfo.deptName,
            })(<Input disabled />)}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="处理人部门">
            {getFieldDecorator('handleDept', {
              initialValue: handle.handleDept || curruserinfo.deptName,
            })(<Input disabled />)}
          </Form.Item>
        </Col>
      </Form>
    </Row>
  );
});

HandleChild.defaultProps = {
  handle: {
    handleContent: '',
    handleReason: '',
    handleAdvise: '',
    handleResult: '',
  },
  curruserinfo: {
    deptName: '',
    unitName: '',
    userName: '',
  },
};

export default Form.create({})(HandleChild);
