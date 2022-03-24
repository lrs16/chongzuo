import React, { useRef, useImperativeHandle, forwardRef, useState, useContext, useEffect } from 'react';
import moment from 'moment';
import { Row, Col, Form, Input, Alert } from 'antd';
import SubmitTypeContext from '@/layouts/MenuContext';
import FormTextArea from '@/components/FormTextArea';
import DocumentAtt from './NewDocAtt';
import ReleseList from './ReleseList';

const { TextArea } = Input;

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
const formuintLayout = {
  labelCol: {
    sm: { span: 24 },
  },
  wrapperCol: {
    sm: { span: 24 },
  },
};

function BusinessReview(props, ref) {
  const { userinfo, selectdata, isEdit, info, listmsg, timeoutinfo, taskName } = props;
  const { getFieldDecorator, getFieldsValue, resetFields, setFieldsValue } = props.form;
  const required = true;

  const [check, setCheck] = useState(false);
  const [alertvisible, setAlertVisible] = useState(false);  // 超时告警是否显示
  const [alertmessage, setAlertMessage] = useState('');

  const { ChangeButtype } = useContext(SubmitTypeContext);

  const formRef = useRef();
  useImperativeHandle(ref, () => ({
    getVal: () => getFieldsValue(),
    resetVal: () => resetFields(),
    Forms: props.form.validateFieldsAndScroll,
  }), []);

  useEffect(() => {
    if (isEdit && timeoutinfo) {
      setAlertVisible(true);
      setAlertMessage({ mes: `${taskName}超时，${taskName}${timeoutinfo}`, des: `` });
    };
    if (!isEdit && timeoutinfo) {
      setAlertVisible(true);
      setAlertMessage({ mes: `超时原因：${timeoutinfo}`, des: `` });
    };
  }, [timeoutinfo])

  const changeatt = (v, files) => {
    setFieldsValue({ releaseAttaches: v });
    const target = v.filter(item => item.key === '8')[0];
    if (target && target.attachFile !== '[]') {
      setCheck(false);
    };
    if (files === 'files') {
      ChangeButtype('save')
    };
  }

  const getTypebyId = key => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.key === key)[0]?.children;
    }
    return [];
  };

  const docunitmap = getTypebyId(1289);    // 出具文档单位

  // 数组去重
  const uniqueName = (arr) => {
    const res = new Map();
    return arr.filter((item) => !res.has(item) && res.set(item, 1))
  }
  const indexVal = () => {
    const Arr = [];
    const names = info.releaseLists.map(item => {
      return item.operator;
    });
    const nameArr = uniqueName(names);
    for (let i = 0; i < nameArr.length; i += 1) {
      const textVal = [];
      for (let j = 0; j < info.releaseLists.length; j += 1) {
        if (info.releaseLists[j].operator === nameArr[i]) {
          const vote = `序号${j + 1}. 复核待办里面的是“${info.releaseLists[j].passTest}”`;
          textVal.push(vote);
        }
      }
      Arr.push(`业务复核人${nameArr[i]}：${textVal.join(',')}`)
    }
    return Arr.join('\n')
  }
  return (
    <Row gutter={12}>
      {alertvisible && (<Alert message={alertmessage.mes} type='warning' showIcon style={{ marginBottom: 12 }} />)}
      <Form ref={formRef} {...formItemLayout}>
        {/* <Col span={24}>
          <h4>发布结论：</h4>
          <p>{info.releaseBizCheck.checkResult}</p>
        </Col> */}
        <Col span={24}>
          <Form.Item label="复核说明" {...formuintLayout} labelAlign='left'>
            {getFieldDecorator('checkComments', {
              rules: [{ required, message: `请填写复核说明` }],
              initialValue: info.releaseBizCheck && info.releaseBizCheck.checkComments || indexVal(),
            })(<FormTextArea
              autoSize={3}
              indexText={info.releaseBizCheck && info.releaseBizCheck.checkComments || indexVal()}
              isEdit={isEdit}
              getVal={v => setFieldsValue({ checkComments: v })}
            />)}
          </Form.Item>
        </Col>
        <Col span={24}>
          <h4>发布清单</h4>
          <ReleseList
            title='发布清单'
            dataSource={info.releaseLists}
            listmsg={listmsg}
          />
          <Form.Item wrapperCol={{ span: 24 }} style={{ display: 'none' }}>
            {getFieldDecorator('releaseLists', {
              initialValue: info.releaseLists,
            })(<></>)}
          </Form.Item>
        </Col>
        {/* <Col span={24}><Button type='primary'>发起服务绩效考核</Button></Col> */}
        <Col span={24} style={{ marginBottom: 16, }}>
          <DocumentAtt
            // rowkey='0'
            isEdit={isEdit}
            unitmap={docunitmap}
            dataSource={info && info.releaseAttaches ? info.releaseAttaches : []}
            Unit={{ dutyUnit: undefined }}
            ChangeValue={(v, files) => changeatt(v, files)}
            check={check}
            taskName={taskName}
          />
          <Form.Item wrapperCol={{ span: 24 }} style={{ display: 'none' }}>
            {getFieldDecorator('releaseAttaches', {
              initialValue: info.releaseAttaches,
            })(<></>)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="复核人">
            {getFieldDecorator('userName', {
              rules: [{ required, message: `请选择复核人` }],
              initialValue: userinfo ? userinfo.userName : info.releaseBizCheck && info.releaseBizCheck.userName,
            })(<Input disabled />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="复核时间" >
            {getFieldDecorator('registerTime', {
              rules: [{ required, message: `请选择复核时间` }],
              initialValue: moment(info.releaseBizCheck && info.releaseBizCheck.registerTime || undefined).format("YYYY-MM-DD HH:mm:ss"),
            })(
              <Input disabled />
            )}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="复核单位">
            {getFieldDecorator('form13', {
              rules: [{ required, message: `请选择复核单位` }],
              initialValue: userinfo ? userinfo.unitName : info.releaseBizCheck && info.releaseBizCheck.unitName,
            })(<Input disabled />)}
          </Form.Item>
        </Col>
      </Form>
    </Row>
  );
}
const WrappedForm = Form.create({ name: 'form' })(forwardRef(BusinessReview));
export default WrappedForm;