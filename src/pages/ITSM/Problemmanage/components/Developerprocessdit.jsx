import React, { useEffect, useState, useRef, useImperativeHandle } from 'react';
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  DatePicker,
} from 'antd';
import moment from 'moment';
import SysUpload from '@/components/SysUpload';
import KnowledgCollect from '@/components/KnowledgeCollect';

const { Option } = Select;
const { TextArea } = Input;
let handleTime;
let planTime;
const Developerprocessdit = React.forwardRef((props, ref) => {
  const { formItemLayout, forminladeLayout, files, ChangeFiles, mainId } = props;
  const { getFieldDecorator, getFieldsValue } = props.form;
  const [fileslist, setFilesList] = useState([]);
  const [knowledgecontent, setKonwledgeContent] = useState('');    // 知识内容
  const [valuealready, setValuealready] = useState(false)          // 告知知识子组件可以走接口了
  // 获取知识数据
  const getContent = () => {
    const values = getFieldsValue(['handleContent'])
    setKonwledgeContent(values.handleContent);
    setValuealready(true)
  }
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
  const {
    showEdit,
    useInfo,
    handle,
    handleresult
  } = props;
  if (handle.handleTime !== null) {
    handleTime = moment(handle.handleTime)
  } else {
    handleTime = moment(new Date());
  }

  if (handle.planEndTime !== null) {
    planTime = moment(handle.planEndTime)
  } else {
    planTime = moment(new Date());
  }

  const required = true;

  return (
    <Row gutter={16}>
      <Form {...formItemLayout}>
        <Col span={8}>
          <Form.Item label='接单时间'>
            {getFieldDecorator('orderReceivingtime', {
              initialValue: moment(handle.addTime)
            })(<DatePicker
              showTime
              disabled={true}
            />)}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="计划完成时间">
            {getFieldDecorator('planEndTime', {
              rules: [
                {
                  required,
                  message: '请输入计划完成时间',
                },
              ],
              initialValue: planTime,
            })((<DatePicker
              showTime
              disabled={showEdit}
            />))}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="处理完成时间">
            {getFieldDecorator('handleTime', {
              rules: [
                {
                  required,
                  message: '请输入处理完成时间',
                },
              ],
              initialValue: handleTime,
            })((<DatePicker
              showTime
              disabled={showEdit}
            />))}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="处理结果">
            {getFieldDecorator('handleResult', {
              rules: [
                {
                  required,
                  message: '请选择处理结果'
                }
              ],
              initialValue: handle.handleResult,
            })(
              <Select placeholder="请选择" disabled={showEdit}>
                {
                  handleresult && handleresult.length && (
                    handleresult.map(({ key, val }) => (
                      <Option key={key} value={val}>
                        {val}
                      </Option>
                    ))
                  )
                }
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="解决方案" {...forminladeLayout}>
            {getFieldDecorator('handleContent', {
              rules: [
                {
                  required,
                  message: '请输入解决方案'
                }
              ],
              initialValue: handle.handleContent,
            })(<TextArea autoSize={{ minRows: 3 }} disabled={showEdit} />)}
          </Form.Item>
        </Col>

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
            label="上传附件"
            {...forminladeLayout}
          >
            <div>
              <SysUpload
                fileslist={files}
                ChangeFileslist={newvalue => setFilesList(newvalue)}
              />
            </div>

          </Form.Item>
        </Col>


        <Col span={8}>
          <Form.Item label="处理人">
            {getFieldDecorator('handler', {
              initialValue: useInfo.userName,
            })(<Input disabled />)}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="处理单位">
            {getFieldDecorator('handleUnit', {
              initialValue: useInfo.unitName,
            })(<Input disabled />)}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="处理部门">
            {getFieldDecorator('handleDept', {
              initialValue: useInfo.deptName,
            })(<Input disabled />)}
          </Form.Item>
        </Col>

      </Form>
    </Row>
  );
});

Developerprocessdit.defaultProps = {
  handle: {
    addtime: moment().format(),
    handleTime: moment().format(),
    handleResult: '',
    handleContent: '',
    planEndTime: moment().format()
  },
  useInfo: {
    userName: '',
    deptNameExt: '',
  }
}

export default Form.create({})(Developerprocessdit);
