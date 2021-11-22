import React, { useRef, useImperativeHandle, useEffect, useState } from 'react';
import moment from 'moment';
import {
  Form,
  Row,
  Col,
  Input,
  DatePicker,
  Radio,
  Select,
  Button,
} from 'antd';
import SysUpload from '@/components/SysUpload'; // 附件下载组件
import SysDict from '@/components/SysDict';

const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;

const ExamineSecondChild = React.forwardRef((props, ref) => {
  const {
    formItemLayout,
    forminladeLayout,
    check,
    curruserinfo,
    ChangeFiles,
    ChangeResult,
    location,
    createQualityByMainId
  } = props;
  const { getFieldDecorator, setFieldsValue } = props.form;
  const attRef = useRef();
  const [fileslist, setFilesList] = useState({ arr: [], ischange: false }); // 下载列表
  const [adopt, setAdopt] = useState('1');
  const [selectdata, setSelectData] = useState([]);

  useEffect(() => {
    ChangeFiles(fileslist);
  }, [fileslist]);

  useEffect(() => {
    if (check !== undefined) {
      setAdopt(check.checkResult);
      ChangeResult(check.checkResult);
    }
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      attRef,
    }),
    [],
  );
  const required = true;
  useEffect(() => {
    sessionStorage.setItem('Nextflowmane', '自动化科专责确认');
  });

  const onChange = (e) => {
    setAdopt(e.target.value);
    ChangeResult(e.target.value);
  }

  const getTypebyTitle = title => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.title === title)[0].children;
    }
    return [];
  };

  const responsible = getTypebyTitle('故障责任方');

  return (
    <Row gutter={24} style={{ paddingTop: 24 }}>
      <SysDict
        typeid="333"
        commonid="335"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Form {...formItemLayout}>
        <Col span={8}>
          <Form.Item label="审核结果">
            {getFieldDecorator('checkResult', {
              rules: [{ required: true, message: '请选择审核结果' }],
              initialValue: check.checkResult,
            })(
              <Radio.Group onChange={onChange}>
                <Radio value='1'>通过</Radio>
                <Radio value='0'>不通过</Radio>
              </Radio.Group>,
            )}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="故障责任方">
            {getFieldDecorator('checkBlame', {
              rules: [
                {
                  required,
                  message: '请输入故障责任方',
                },
              ],
              initialValue: check.checkBlame
            })(
              <Select placeholder="请选择" allowClear>
                {responsible.map(obj => [
                  <Option key={obj.key} value={obj.title}>
                    {obj.title}
                  </Option>,
                ])}
              </Select>
            )}
          </Form.Item>
        </Col>


        <Col span={8}>
          <Form.Item label="审核时间">
            {getFieldDecorator('checkTime', {
              rules: [
                {
                  required,
                  message: '请选择时间',
                },
              ],
              initialValue: check.checkTime ? moment(check.checkTime) : moment(new Date())
            })(<>
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                defaultValue={moment(check && check.checkTime ? check.checkTime : new Date())}
                onChange={(v) => { setFieldsValue({ checkTime: moment(v) }) }}
              /></>)}
          </Form.Item>
        </Col>

        <Col span={23}>
          {adopt === '1' && ( // 1 通过
            <Form.Item label="审核意见" {...forminladeLayout}>
              {getFieldDecorator('checkOpinion1', {
                rules: [{ required: false, message: '请输入', }],
                initialValue: check ? check.checkOpinion : ''
              })(<TextArea autoSize={{ minRows: 3 }} placeholder="请输入" />)}
            </Form.Item>
          )}
          {adopt === '0' && ( // 0 不通过
            <Form.Item label="审核意见" {...forminladeLayout}>
              {getFieldDecorator('checkOpinion2', {
                rules: [{ required: true, message: '请输入', }],
                initialValue: check ? check.checkOpinion : ''
              })(<TextArea autoSize={{ minRows: 3 }} placeholder="请输入" />)}
            </Form.Item>
          )}
        </Col>

        <Col span={24}>
          <Form.Item
            label="上传附件"
            {...forminladeLayout}
          // extra="只能上传jpg/png/doc/xls/xlsx/pdf格式文件，单个文件不能超过500kb"
          >
            {
              location && (!location.state || (location.state && !location.state.cache)) && (
                <div style={{ width: 400 }}>
                  <SysUpload fileslist={(check && check.checkAttachments) ? JSON.parse(check.checkAttachments) : []} ChangeFileslist={newvalue => setFilesList(newvalue)} />
                </div>
              )
            }
          </Form.Item>
        </Col>

        <Col span={8}>
          <Button onClick={createQualityByMainId} type='primary'>发起绩效考核</Button>
        </Col>

        <Col span={24}>
          <Form.Item label="是否影响计量主站" {...forminladeLayout}>
            {getFieldDecorator('checkMaster', {
              initialValue: check && check.checkMaster || '',
            })(
              <RadioGroup>
                <Radio value='0'>是</Radio>
                <Radio value='1'>否</Radio>
              </RadioGroup>,
            )}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="审核人">
            {getFieldDecorator('checkUser', {
              initialValue: check.checkUser || curruserinfo.userName
            })(<Input allowClear disabled />)}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="审核人单位">
            {getFieldDecorator('checkUnit', {
              initialValue: check.checkUnit || curruserinfo.unitName
            })(<Input allowClear disabled />)}
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="审核人部门">
            {getFieldDecorator('checkDept', {
              initialValue: check.checkDept || curruserinfo.deptName
            })(<Input allowClear disabled />)}
          </Form.Item>
        </Col>
      </Form>
    </Row>
  );
});

ExamineSecondChild.defaultProps = {
  check: {
    checkDept: '',
    checkUnit: '',
    checkUser: '',
    checkAttachments: '',
    checkReportSign: '',
    checkOpinion: '',
    checkResult: '1',
    checkTime: '',
    checkBlame: ''
  },
  curruserinfo: {
    deptName: '',
    unitName: '',
    userName: ''
  }
}

export default Form.create({})(ExamineSecondChild);
