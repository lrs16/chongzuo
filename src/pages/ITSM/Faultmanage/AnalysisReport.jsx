import React, { useEffect } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Row, Col, Form, DatePicker, Input, Card, message, Popconfirm } from 'antd';

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

const { TextArea } = Input;

function AnalysisReport(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, getFieldsValue, validateFields },
    dispatch,
    troubleReportdetail,
    loading,
    troubleReportdetail: { data },
    troubleReportdetail: { editState },
  } = props;
  const {
    query: { id, mainId, orderNo, tobeForm, tobeeditState, finishId, sign },
  } = props.location; // 获取taskId

  const required = true;

  const getDetail = () => {
    dispatch({
      type: 'faultcount/addtroubleReport',
      payload: { mainId },
    });
  };

  const handleSubmit = () => {
    const tobeSave = (fileid, filename) => {
      const formValues = {
        ...tobeForm,
        finishPracticeTime: tobeForm.finishPracticeTime
          ? moment(tobeForm.finishPracticeTime).format('YYYY-MM-DD HH:mm:ss')
          : moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        finishRequiredTime: tobeForm.finishRequiredTime
          ? moment(tobeForm.finishRequiredTime).format('YYYY-MM-DD HH:mm:ss')
          : '',
        finishTime: tobeForm.finishTime
          ? moment(tobeForm.finishTime).format('YYYY-MM-DD HH:mm:ss')
          : '',
        taskId: id,
        finishAnalysisAttachments: JSON.stringify([{ uid: fileid, name: filename }]),
        editState: tobeeditState,
        finishId,
      };
      return dispatch({
        type: 'fault/getfromsave',
        payload: {
          formValues,
        },
      }).then(res => {
        if (res.code === 200) {
          router.push({
            pathname: `/ITSM/faultmanage/todolist/record`,
            query: {
              id,
              mainId,
              orderNo,
            },
          });
        }
      });
    };
    const submitParams = () => {
      return dispatch({
        type: 'faultcount/submitReport',
        payload: mainId,
      }).then(res => {
        if (res.code === 200) {
          tobeSave(res.data[0].id, res.data[0].fileName);
        } else {
          message.error(res.msg);
        }
      });
    };

    validateFields((err, values) => {
      if (!err) {
        return dispatch({
          type: 'faultcount/saveReport',
          payload: {
            ...values,
            occurTime: values.occurTime.format('YYYY-MM-DD HH:mm:ss'),
            registerTime: values.registerTime.format('YYYY-MM-DD HH:mm:ss'),
            handleStartTime: values.handleStartTime.format('YYYY-MM-DD HH:mm:ss'),
            handleEndTime: values.handleEndTime.format('YYYY-MM-DD HH:mm:ss'),
            editState: editState || 'add',
            mainId,
          },
        }).then(re => {
          if (re.code === 200) {
            message.success(re.msg);
            submitParams();
          } else {
            message.error(re.msg);
          }
        });
      }

      if (err) {
        message.error('请将信息填写完整...');
      }

      return [];
    });
  };

  const handleSave = params => {
    const values = getFieldsValue();
    return dispatch({
      type: 'faultcount/saveReport',
      payload: {
        ...values,
        occurTime: values.occurTime.format('YYYY-MM-DD HH:mm:ss'),
        registerTime: values.registerTime.format('YYYY-MM-DD HH:mm:ss'),
        handleStartTime: values.handleStartTime.format('YYYY-MM-DD HH:mm:ss'),
        handleEndTime: values.handleEndTime.format('YYYY-MM-DD HH:mm:ss'),
        editState: editState || 'add',
        mainId,
      },
    }).then(res => {
      if (res.code === 200) {
        getDetail();
        message.success(res.msg);
      } else {
        message.error(res.msg);
      }
    });
  };

  const handleBack = () => {
    router.push({
      pathname: '/ITSM/faultmanage/todolist/record',
      query: {
        id,
        mainId,
        orderNo,
      },
    });
  };

  useEffect(() => {
    getDetail();
  }, []);

  return (
    <PageHeaderWrapper
      title={pagetitle}
      extra={
        <>
          <Button
            type="primary"
            style={{ marginRight: 8 }}
            onClick={() => handleSave()}
            disabled={sign}
          >
            保 存
          </Button>
          <Popconfirm
            title="确定提交报告吗？提交后不可再编辑报告"
            onConfirm={() => handleSubmit()}
            disabled={sign}
          >
            <Button type="primary" style={{ marginRight: 8 }} disabled={sign}>
              提交报告
            </Button>
          </Popconfirm>

          <Button type="default" onClick={handleBack}>
            返 回
          </Button>
        </>
      }
    >
      <Card>
        {loading === false && (
          <Row gutter={24} {...formItemLayout}>
            <Form {...formItemLayout}>
              <Col span={24}>
                <Form.Item label="故障名称" {...forminladeLayout}>
                  {getFieldDecorator('title', {
                    initialValue: data.title,
                  })(<Input disabled />)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="故障编号">
                  {getFieldDecorator('no', {
                    initialValue: data.no,
                  })(<Input disabled />)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="故障发生时间">
                  {getFieldDecorator('occurTime', {
                    initialValue: moment(data.occurTime || Date.now()),
                  })(<DatePicker format="YYYY-MM-DD HH:mm:ss" disabled />)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="登记时间">
                  {getFieldDecorator('registerTime', {
                    initialValue: moment(data.registerTime || new Date()),
                  })(<DatePicker disabled format="YYYY-MM-DD HH:mm:ss" />)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="故障地点">
                  {getFieldDecorator('address', {
                    initialValue: data.address,
                  })(<Input disabled />)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="计量中心联系人">
                  {getFieldDecorator('contactPerson', {
                    rules: [
                      {
                        required,
                        message: '请输入计量中心联系人',
                      },
                    ],
                    initialValue: data.contactPerson,
                  })(<Input disabled={sign} />)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="故障类型">
                  {getFieldDecorator('type', {
                    initialValue: data.type,
                  })(<Input disabled />)}
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item label="系统名称" {...forminladeLayout}>
                  {getFieldDecorator('systemName', {
                    rules: [
                      {
                        required,
                        message: '请输入系统名称',
                      },
                    ],
                    initialValue: data.systemName,
                  })(<Input disabled={sign} />)}
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item label="故障概要" {...forminladeLayout}>
                  {getFieldDecorator('content', {
                    initialValue: data.content,
                  })(<TextArea disabled />)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="严重程度">
                  {getFieldDecorator('level', {
                    initialValue: data.level,
                  })(<Input disabled />)}
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item label="范围说明(风险问题)" {...forminladeLayout}>
                  {getFieldDecorator('scopeContent', {
                    rules: [
                      {
                        required,
                        message: '请输入范围说明',
                      },
                    ],
                    initialValue: data.scopeContent,
                  })(<TextArea disabled={sign} />)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="汇报人">
                  {getFieldDecorator('addUser', {
                    initialValue: data.addUser,
                  })(<Input disabled />)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="汇报部门">
                  {getFieldDecorator('addDept', {
                    initialValue: data.addDept,
                  })(<Input disabled />)}
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item label="故障详细描述" {...forminladeLayout}>
                  {getFieldDecorator('handleContent', {
                    rules: [
                      {
                        required,
                        message: '请输入故障详细描述',
                      },
                    ],
                    initialValue: data.handleContent,
                  })(<TextArea disabled={sign} />)}
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item label="故障分析及原因" {...forminladeLayout}>
                  {getFieldDecorator('handleReason', {
                    initialValue: data.handleReason,
                  })(<TextArea disabled />)}
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item label="解决措施或建议" {...forminladeLayout}>
                  {getFieldDecorator('handleAdvise', {
                    initialValue: data.handleAdvise,
                  })(<TextArea disabled />)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="故障处理开始时间">
                  {getFieldDecorator('handleStartTime', {
                    initialValue: moment(data.handleStartTime || new Date()),
                  })(<DatePicker disabled format="YYYY-MM-DD HH:mm:ss" />)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="故障恢复完成时间">
                  {getFieldDecorator('handleEndTime', {
                    initialValue: moment(data.handleEndTime || new Date()),
                  })(<DatePicker disabled format="YYYY-MM-DD HH:mm:ss" />)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="处理人">
                  {getFieldDecorator('handler', {
                    initialValue: data.handler,
                  })(<Input disabled />)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="恢复结果">
                  {getFieldDecorator('handleResult', {
                    initialValue: data.handleResult,
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
            </Form>
          </Row>
        )}
      </Card>
    </PageHeaderWrapper>
  );
}

AnalysisReport.defaultProps = {
  data: {
    no: '',
    title: '',
    registerOccurTime: '',
    registerTime: '',
    address: '',
    addUser: '',
    type: '',
    systemName: '',
    content: '',
    level: '',
    scopeContent: '',
    handleContent: '',
    addDept: '',
    handleReason: '',
    handleAdvise: '',
    handleStartTime: '',
    handleEndTime: '',
    handler: '',
    handleResult: '',
  },
};

export default Form.create({})(
  connect(({ faultcount, loading }) => ({
    troubleReportdetail: faultcount.troubleReportdetail,
    loading: loading.models.faultcount,
  }))(AnalysisReport),
);
