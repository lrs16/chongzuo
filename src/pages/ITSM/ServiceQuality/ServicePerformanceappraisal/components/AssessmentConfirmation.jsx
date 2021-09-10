import React, { useImperativeHandle, useRef, useState } from 'react';
import { Form, Input, Radio, Row, Col, Tag, DatePicker, Select } from 'antd';
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
    getclausedetail,
    clauseList,
    target1,
    target2,
    editSign,
    noEdit,
  } = props;
  const [selectdata, setSelectData] = useState('');
  const [clauselist, setClauselist] = useState([]); // 详细条款

  const required = true;
  const attRef = useRef();
  useImperativeHandle(
    ref,
    () => ({
      attRef,
    }),
    [],
  );

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
          target1Name: key,
          target1Id: value,
          target2Name: '',
          target2Id: '',
        });
        getTarget2(key);
        break;
      case 'clause':
        const {
          props: {
            children: {
              props: { children },
            },
          },
        } = option;
        setFieldsValue({
          clauseId: key,
          assessValue: children[3].props.children,
        });
        break;
      default:
        break;
    }
  };

  console.log(noEdit, 'noEdit');

  const appraisalStatus = getTypebyTitle('考核状态');

  return (
    <Row gutter={24} style={{ paddingTop: 24 }}>
      <SysDict
        typeid="1410413049587699713"
        commonid="1354288354950123522"
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
                <Radio.Group disabled="true">
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
                <TextArea autosize={{ minRows: 3 }} disabled="true" placeholder="请输入申诉内容" />,
              )}
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="确认结果" {...forminladeLayout}>
              {getFieldDecorator('confirmValue', {
                initialValue: assessmentConfirmation.confirmValue || '1',
              })(
                <Radio.Group disabled={noEdit}>
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
                  disabled={noEdit}
                  // autosize={{ minRows: 3 }}
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
                  disabled={editSign}
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
                  disabled={editSign}
                  // autosize={{ minRows: 3 }}
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
                  disabled={editSign}
                  onChange={(value, option) => handleChange(value, option, 'target1Name')}
                  // onFocus={() => handleFocus('one')}
                  placeholder="请选择"
                  allowClear
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
                  disabled={editSign}
                  onChange={(value, option) => handleChange(value, option, 'target2Name')}
                  // onFocus={() => handleFocus('two')}
                  placeholder="请选择"
                  allowClear
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
                <Select disabled={editSign}>
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
                  ? assessmentConfirmation.clause.detailed
                  : assessmentConfirmation.clause,
              })(
                <Select
                  disabled={editSign}
                  onChange={(value, option) => handleChange(value, option, 'clause')}
                  // onFocus={() => handleFocus('clause')}
                >
                  {(clauseList.records || []).map(obj => [
                    <Option key={obj.id} value={obj.detailed}>
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

          <Col span={8}>
            <Form.Item label="考核得分">
              {getFieldDecorator('assessValue', {
                initialValue: assessmentConfirmation.assessValue,
              })(<Input disabled={editSign} />)}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="确认人">
              {getFieldDecorator('confirmer', {
                initialValue: assessmentConfirmation.confirmerName || userinfo.userName,
              })(<Input disabled={editSign} />)}
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="确认时间">
              {getFieldDecorator('confirmTime', {
                initialValue: moment(assessmentConfirmation.confirmationtime || new Date()),
              })(<DatePicker disabled={editSign} format="YYYY-MM-DD HH-MM" />)}
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
