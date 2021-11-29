import React, { useImperativeHandle,useEffect,useRef, useState } from 'react';
import { Form, Input, Radio, Row, Col, DatePicker, Select } from 'antd';
import moment from 'moment';
import SysDict from '@/components/SysDict';

import styles from '../index.less';

const { TextArea } = Input;
const { Option } = Select;

const AssessmentConfirmation = React.forwardRef((props, ref) => {
  const {
    form: { getFieldDecorator, setFieldsValue },
    formItemLayout,
    forminladeLayout,
    userinfo,
    assessmentConfirmation,
    getTarget1,
    getTarget2,
    clauseList,
    getclausedetail,
    target1,
    target2,
    editSign,
    noEdit,
    search
  } = props;
  const [selectdata, setSelectData] = useState('');
  const [providerId, setProviderId] = useState(''); //  设置服务商的id
  const [scoreId, setScoreId] = useState(''); //  设置服务商的id

  const required = true;
  const attRef = useRef();
  useImperativeHandle(
    ref,
    () => ({
      attRef,
    }),
    [],
  );

  useEffect(() => {
    setProviderId(assessmentConfirmation.providerId);
    setScoreId(assessmentConfirmation.scoreId);
  },[assessmentConfirmation])

  const getTypebyTitle = title => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.title === title)[0].children;
    }
    return [];
  };

  const handleChange = (values, option, params) => {
    const {
      key,
      props: { value },
    } = option;
    switch (params) {
      case 'assessType':
        setFieldsValue({
          target1Name: '',
          target1Id: '',
          target2Name: '',
          target2Id: '',
        });
        getTarget1(value);
        break;
      case 'target1Name':
        setFieldsValue({
          target1Name: value,
          target1Id: key,
          target2Name: '',
          target2Id: '',
        });
        getTarget2(key);
        break;
      case 'target2Name':
        setFieldsValue({
          target2Name: value,
          target2Id: key,
          clause: '',
        });
        getclausedetail(key, assessmentConfirmation.scoreId);
        break;
      case 'clause': {
        const {
          props: {
            children: {
              props: { children },
            },
          },
        } = option;
        setFieldsValue({
          clauseId: value,
          clauseName: children[1].props.children,
          assessValue: children[3].props.children,
        });
      }
        break;
      default:
        break;
    }
  };

  const onChange = (date, dateString) => {
    setFieldsValue({ confirmTime: moment(dateString) })
  }

  const appraisalStatus = getTypebyTitle('考核状态');

  return (
    <Row gutter={24} style={{ paddingTop: 24 }}>
      <SysDict
        typeid='576'
        commonid="335"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      {appraisalStatus && (
        <Form {...formItemLayout}>
          <Col span={8}>
            <Form.Item label="是否申诉">
              {getFieldDecorator('isAppeal', {
                initialValue: assessmentConfirmation.isAppeal,
              })(
                <Radio.Group disabled>
                  <Radio value="1">是</Radio>
                  <Radio value="0">否</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="申诉内容" {...forminladeLayout}>
              {getFieldDecorator('appealContent', {
                initialValue: assessmentConfirmation.appealContent,
              })(
                <TextArea autoSize={{ minRows: 3 }} disabled placeholder="请输入申诉内容" />,
              )}
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="确认结果" {...forminladeLayout}>
              {getFieldDecorator('confirmValue', {
                initialValue: assessmentConfirmation.confirmValue || '1',
              })(
                <Radio.Group disabled={search || noEdit}>
                  <Radio value="1">确认考核</Radio>
                  <Radio value="0">取消考核</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="确认说明" {...forminladeLayout}>
              {getFieldDecorator('confirmContent', {
                initialValue: assessmentConfirmation.confirmContent,
              })(
                <TextArea
                  disabled={search || noEdit}
                  autoSize={{ minRows: 3 }}
                  placeholder="请输入确认说明"
                />,
              )}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="考核类型">
              {getFieldDecorator('assessType', {
                initialValue: assessmentConfirmation.assessType,
              })(
                <Select
                  getPopupContainer={e => e.parentNode}
                  disabled={search || editSign}
                  onChange={(value, option) => handleChange(value, option, 'assessType')}
                >
                  <Option key="功能开发" value="1">
                    功能开发
                  </Option>
                  <Option key="系统运维" value="2">
                    系统运维
                  </Option>
                </Select>,
              )}
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="考核内容说明" {...forminladeLayout}>
              {getFieldDecorator('assessContent', {
                initialValue: assessmentConfirmation.assessContent,
              })(
                <TextArea
                  disabled={search || editSign}
                  autoSize={{ minRows: 3 }}
                  placeholder="请输入考核内容说明"
                />,
              )}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="一级指标">
              {getFieldDecorator('target1Name', {
                rules: [
                  {
                    required,
                    message: '请输入一级指标',
                  },
                ],
                initialValue: assessmentConfirmation.target1Name,
              })(
                <Select
                  getPopupContainer={e => e.parentNode}
                  disabled={search || editSign}
                  onChange={(value, option) => handleChange(value, option, 'target1Name')}
                  placeholder="请选择"
                  allowClear={false}
                >
                  {target1.map(obj => [
                    <Option key={obj.id} value={obj.title}>
                      {obj.title}
                    </Option>,
                  ])}
                </Select>,
              )}
            </Form.Item>
          </Col>

          <Col span={8} style={{ display: 'none' }}>
            <Form.Item label="一级指标id">
              {getFieldDecorator('target1Id', {
                initialValue: assessmentConfirmation.target1Id,
              })(<Input />)}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="二级指标">
              {getFieldDecorator('target2Name', {
                rules: [
                  {
                    required,
                    message: '请输入二级指标',
                  },
                ],
                initialValue: assessmentConfirmation.target2Name,
              })(
                <Select
                  getPopupContainer={e => e.parentNode}
                  disabled={search || editSign}
                  onChange={(value, option) => handleChange(value, option, 'target2Name')}
                  placeholder="请选择"
                  allowClear={false}
                >
                  {target2.map(obj => [
                    <Option key={obj.id} value={obj.title}>
                      {obj.title}
                    </Option>,
                  ])}
                </Select>,
              )}
            </Form.Item>
          </Col>

          <Col span={8} style={{ display: 'none' }}>
            <Form.Item label=" 二级指标">
              {getFieldDecorator('target2Id', {
                initialValue: assessmentConfirmation.target2Id,
              })(<Input />)}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="考核状态">
              {getFieldDecorator('taskName', {
                initialValue: assessmentConfirmation.taskName,
              })(
                <Select disabled={search || editSign} getPopupContainer={e => e.parentNode}>
                  {appraisalStatus.map(obj => [
                    <Option key={obj.key} value={obj.title}>
                      {obj.title}
                    </Option>,
                  ])}
                </Select>,
              )}
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="详细条款" {...forminladeLayout}>
              {getFieldDecorator('clause', {
                rules: [
                  {
                    required,
                    message: '请输入详细条款',
                  },
                ],
                initialValue: assessmentConfirmation.clause?.detailed
                  ? assessmentConfirmation.clause.id
                  : assessmentConfirmation.clauseId,
              })(
                <Select
                  getPopupContainer={e => e.parentNode}
                  disabled={search || editSign}
                  allowClear={false}
                  onChange={(value, option) => handleChange(value, option, 'clause')}
                >
                  {(clauseList.records || []).map(obj => [
                    <Option key={obj.detailed} value={obj.id}>
                      <div className={styles.disableuser}>
                        <span>{obj.orderNo}</span>
                        <span>{obj.detailed}</span>
                        <span>{obj.calc}</span>
                        <span>{obj.scoreValue}</span>
                        <span>{obj.sources}</span>
                      </div>
                    </Option>,
                  ])}
                </Select>,
              )}
            </Form.Item>
          </Col>

          <Col span={24} style={{ display: 'none' }}>
            <Form.Item label="详细条款" {...forminladeLayout}>
              {getFieldDecorator('clauseId', {
                initialValue: assessmentConfirmation.clauseId,
              })(<Input disabled={editSign} />)}
            </Form.Item>
          </Col>

          <Col span={24} style={{ display: 'none' }}>
          <Form.Item label="详细条款" {...forminladeLayout}>
            {getFieldDecorator('clauseName', {
              initialValue: assessmentConfirmation.clause && assessmentConfirmation.clause.detailed,
            })(<Input />)}
          </Form.Item>
        </Col>

          <Col span={8}>
            <Form.Item label="考核得分">
              {getFieldDecorator('assessValue', {
                initialValue: assessmentConfirmation.assessValue,
              })(<Input disabled={search || editSign} />)}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="确认人">
              {getFieldDecorator('confirmer', {
                initialValue: assessmentConfirmation.confirmerName || userinfo.userName,
              })(<Input disabled />)}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="确认时间">
              {getFieldDecorator('confirmTime', {
                initialValue: moment(assessmentConfirmation.confirmationtime || new Date()),
              })(
                // <div>
                //   <DatePicker
                //     disabled={true}
                //     defaultValue={moment(assessmentConfirmation.confirmationtime || new Date())}
                //     format='YYYY-MM-DD HH:mm'
                //     onChange={onChange}
                //   />
                // </div>
                <DatePicker
                  disabled
                  // defaultValue={moment(assessmentConfirmation.confirmationtime || new Date())}
                  format='YYYY-MM-DD HH:mm'
                  onChange={onChange}
                />
              )}
            </Form.Item>
          </Col>
        </Form>
      )}
    </Row>
  );
});

AssessmentConfirmation.defaultProps = {
  assessmentConfirmation: {
    isAppeal: '1',
    appealContent: '',
    confirmValue: '1',
    confirmContent: '',
    assessType: '',
    assessContent: '',
    target1Name: '',
    target1Id: '',
    target2Name: '',
    target2Id: '',
    assessValue: '',
    taskName: '',
    clause: '',
    clauseId: '',
    confirmer: '',
    confirmTime: '',
    confirmerName: '',
  },
};

export default Form.create({})(AssessmentConfirmation);
