import React, { useRef, useImperativeHandle, useEffect, useState } from 'react';
import router from 'umi/router';
import moment from 'moment';
import { Row, Col, Form, Input, Select, DatePicker } from 'antd';
import SysUpload from '@/components/SysUpload';

const { Option } = Select;
const { TextArea } = Input;

const nextsmap = new Map([
  ['001', '结束'],
  ['002', '结束'],
  ['003', '处理'],
]);

const typemaps = new Map([
  ['001', '1'],
  ['002', '1'],
  ['003', '3'],
]);

const ReturnVisit = React.forwardRef((props, ref) => {
  const {
    formItemLayout,
    forminladeLayout,
    info,
    main,
    userinfo,
    location,
    files,
    ChangeFiles,
    selectdata,
  } = props;
  const { taskName, taskId, mainId } = location.query;
  const { finish } = info;
  const { getFieldDecorator } = props.form;
  const attRef = useRef();
  const required = true;
  const [fileslist, setFilesList] = useState({ arr: [], ischange: false });
  useEffect(() => {
    if (fileslist.ischange) {
      ChangeFiles(fileslist);
      setFilesList({ ...fileslist, ischange: false });
    }
  }, [fileslist]);

  useEffect(() => {
    setFilesList({ ...fileslist, arr: files });
  }, [info]);

  useImperativeHandle(
    ref,
    () => ({
      attRef,
    }),
    [],
  );
  const routerRefresh = () => {
    router.push({
      pathname: location.pathname,
      query: {
        taskName,
        taskId,
        mainId,
        next: sessionStorage.getItem('Nextflowmane'),
      },
    });
  };
  useEffect(() => {
    sessionStorage.setItem('Nextflowmane', nextsmap.get(finish.satisfaction));
    sessionStorage.setItem('flowtype', typemaps.get(finish.satisfaction));
    routerRefresh();
  }, [info]);

  const handlcheckChange = value => {
    if (value === '003') {
      sessionStorage.setItem('Nextflowmane', '处理');
      sessionStorage.setItem('flowtype', '3');
    } else {
      sessionStorage.setItem('Nextflowmane', '结束');
      sessionStorage.setItem('flowtype', '1');
    }
    routerRefresh();
  };

  const getTypebyTitle = key => {
    if (selectdata.length > 0) {
      return selectdata.filter(item => item.key === key)[0].children;
    }
    return [];
  };

  const revisitwaymap = getTypebyTitle('486852783895478272');
  const handleresultmap = getTypebyTitle('486846455059841024');
  const satisfactionmap = getTypebyTitle('486855005945462784');

  return (
    <>
      <Row gutter={24} style={{ paddingTop: 24 }}>
        <Form {...formItemLayout}>
          <>
            <Col span={8} style={{ display: 'none' }}>
              <Form.Item label="回访表单id">
                {getFieldDecorator('finish_id', {
                  initialValue: finish.id,
                })(<Input placeholder="请输入" disabled />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="回访方式">
                {getFieldDecorator('finish_revisitWay', {
                  rules: [{ required, message: '请选择回访方式' }],
                  initialValue: main.revisitWay,
                })(
                  <Select placeholder="请选择">
                    {revisitwaymap.map(obj => [
                      <Option key={obj.key} value={obj.dict_code}>
                        {obj.title}
                      </Option>,
                    ])}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="处理结果">
                {getFieldDecorator('main_eventResult', {
                  rules: [{ required, message: '请选择处理结果' }],
                  initialValue: main.eventResult,
                })(
                  <Select placeholder="请选择">
                    {handleresultmap.map(obj => [
                      <Option key={obj.key} value={obj.dict_code}>
                        {obj.title}
                      </Option>,
                    ])}
                  </Select>,
                )}
              </Form.Item>
            </Col>
          </>
          <Col span={8}>
            <Form.Item label="满意度">
              {getFieldDecorator('finish_satisfaction', {
                rules: [{ required, message: '请选择满意度' }],
                initialValue: finish.satisfaction,
              })(
                <Select placeholder="请选择" onChange={handlcheckChange}>
                  {satisfactionmap.map(obj => [
                    <Option key={obj.key} value={obj.dict_code}>
                      {obj.title}
                    </Option>,
                  ])}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="回访内容" {...forminladeLayout}>
              {getFieldDecorator('finish_content', {
                rules: [{ required, message: '请输入回访内容' }],
                initialValue: finish.content,
              })(<TextArea autoSize={{ minRows: 3 }} placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="填单时间">
              {getFieldDecorator('finish_addTime', {
                rules: [{ required }],
                initialValue: moment(finish.addTime).format('YYYY-MM-DD HH:mm:ss'),
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="回访时间">
              {getFieldDecorator('finish_revisitTime', {
                rules: [{ required, message: '请选择回访时间' }],
                initialValue: moment(finish.revisitTime),
              })(<DatePicker showTime placeholder="请选择时间" format="YYYY-MM-DD HH:mm:ss" />)}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="上传附件"
              {...forminladeLayout}
              // extra="只能上传jpg/png/doc/xls格式文件，单个文件不能超过500kb"
            >
              <div style={{ width: 400 }}>
                <SysUpload fileslist={files} ChangeFileslist={newvalue => setFilesList(newvalue)} />
              </div>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="回访人">
              {getFieldDecorator('finish_revisitor', {
                rules: [{ required }],
                initialValue: userinfo.userName,
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>
          </Col>
          <Col span={8} style={{ display: 'none' }}>
            <Form.Item label="回访人ID">
              {getFieldDecorator('finish_revisitorId', {
                rules: [{ required }],
                initialValue: userinfo.userId,
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="回访人单位">
              {getFieldDecorator('finish_revisitUnit', {
                rules: [{ required }],
                initialValue: userinfo.unitName,
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>
          </Col>
          <Col span={8} style={{ display: 'none' }}>
            <Form.Item label="回访人单位ID">
              {getFieldDecorator('finish_revisitUnitId', {
                rules: [{ required }],
                initialValue: userinfo.unitId,
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="回访人部门">
              {getFieldDecorator('finish_revisitDept', {
                rules: [{ required }],
                initialValue: userinfo.deptName,
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>
          </Col>
          <Col span={8} style={{ display: 'none' }}>
            <Form.Item label="回访人部门ID">
              {getFieldDecorator('finish_revisitDeptId', {
                rules: [{ required }],
                initialValue: userinfo.deptId,
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
        </Form>
      </Row>
    </>
  );
});

ReturnVisit.defaultProps = {
  info: {
    finish: {
      revisitWay: '',
      satisfaction: '001',
      // addTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      // revisitTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      content: '',
      id: '',
    },
  },
  main: {
    eventResult: '',
    revisitWay: '',
  },
  userinfo: {
    deptName: '',
    deptId: '',
    unitName: '',
    unitId: '',
    userName: '',
    userId: '',
  },
};

export default Form.create({})(ReturnVisit);
