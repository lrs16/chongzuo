import React, { useImperativeHandle, useEffect, useState, useContext } from 'react';
import moment from 'moment';
import { Row, Col, Form, Input, Select, DatePicker, Cascader } from 'antd';
import SubmitContext from '@/layouts/MenuContext';
import SysUpload from '@/components/SysUpload';
import KnowledgCollect from '@/components/KnowledgeCollect';
import FormTextArea from '@/components/FormTextArea';

const { Option } = Select;
// const { TextArea } = Input;

const Handle = React.forwardRef((props, ref) => {
  const {
    formItemLayout,
    forminladeLayout,
    info,
    main,
    userinfo,
    files,
    ChangeFiles,
    show,
    selectdata,
    mainId,
    loading,
    uploadStatus,
    location
  } = props;
  const { handle } = info;
  const { orderNo, taskName, taskId } = location.query;
  const { getFieldDecorator, setFieldsValue, getFieldsValue, resetFields, getFieldValue } = props.form;
  const required = true;
  const [fileslist, setFilesList] = useState({ arr: [], ischange: false });
  const [knowledgecontent, setKonwledgeContent] = useState('');    // 知识内容
  const [valuealready, setValuealready] = useState(false)          // 告知知识子组件可以走接口了

  const { ChangeSubmitType, ChangeButtonName, ChangeUserChoice } = useContext(SubmitContext);

  // 获取知识数据
  const getContent = () => {
    const values = getFieldsValue(['handle_content'])
    setKonwledgeContent(values.handle_content);
    setValuealready(true)
  }

  useEffect(() => {
    if (fileslist.ischange) {
      ChangeFiles(fileslist);
      setFilesList({ ...fileslist, ischange: false });
    }
  }, [fileslist]);

  useEffect(() => {
    setFilesList({ ...fileslist, arr: files });
  }, [info]);

  useImperativeHandle(ref, () => ({
    getVal: () => getFieldsValue(),
    resetVal: () => resetFields(),
    getHandleResult: () => getFieldValue('handle_handleResult'),
    Forms: props.form.validateFieldsAndScroll,
  }), []);

  const ChangeResult = (e) => {
    if ((e === '4' || e === '5') && !show) {
      ChangeSubmitType(e);
      sessionStorage.setItem('flowtype', e)
    } else {
      ChangeSubmitType('1');
      sessionStorage.setItem('flowtype', '1')
    }
  }

  useEffect(() => {
    if (taskId && taskName === '事件处理') {
      ChangeButtonName('回访');
      if (info && info.handle) {
        ChangeResult(info.handle.handleResult)
      } else {
        ChangeResult('其它选择')
      }
    }
  }, [taskId]);

  const eventObject = main && main.eventObject && main.eventObject.split();
  if (main && main.eventObject && main.eventObject.length === 6) {
    eventObject.unshift(main.eventObject.slice(0, 3));
  }

  const adddisabled = datas => {
    const data = datas.map(obj => {
      const item = obj;
      if (item.dict_code === '005' || item.dict_code === '007' || item.dict_code === '008') {
        item.disabled = true;
      } else {
        item.disabled = false;
      }
      return item;
    });
    return data;
  };

  const displayRender = label => {
    return label[label.length - 1];
  };
  const handlcheckChange = value => {
    setFieldsValue({ main_eventObject: value?.slice(-1)[0] }, () => { });
  };

  const getTypebykey = key => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.key === key)[0].children;
    }
    return [];
  };
  const typemap = getTypebykey(1106);
  const objectmap = getTypebykey(1087);
  const resultmap = getTypebykey(1113);
  const typemaps = adddisabled(typemap);

  return (
    <>
      <Row gutter={24}>
        <Form {...formItemLayout}>
          <Col span={8} style={{ display: 'none' }}>
            <Form.Item label="处理表单id">
              {getFieldDecorator('handle_id', {
                initialValue: handle?.id || '',
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="处理人">
              {getFieldDecorator('handle_handler', {
                initialValue: userinfo.userName,
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>
          </Col>
          <Col span={8} style={{ display: 'none' }}>
            <Form.Item label="处理人ID">
              {getFieldDecorator('handle_handlerId', {
                initialValue: userinfo.userId,
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="处理人单位">
              {getFieldDecorator('handle_handleUnit', {
                initialValue: userinfo.unitName,
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>
          </Col>
          <Col span={8} style={{ display: 'none' }}>
            <Form.Item label="处理人单位ID">
              {getFieldDecorator('handle_handleUnitId', {
                initialValue: userinfo.unitId,
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="处理人部门">
              {getFieldDecorator('handle_handleDept', {
                initialValue: userinfo.deptName,
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>
            <Form.Item label="处理人部门ID" style={{ display: 'none' }}>
              {getFieldDecorator('handle_handleDeptId', {
                initialValue: userinfo.deptId,
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>
          </Col>
          {/* 事件处理 */}
          {!show && (
            <>
              <Col span={8}>
                <Form.Item label="事件分类">
                  {getFieldDecorator('main_eventType', {
                    rules: [{ required, message: '请选择事件分类' }],
                    initialValue: main.eventType,
                  })(
                    <Select placeholder="请选择">
                      {typemaps.map(obj => [
                        <Option key={obj.key} value={obj.dict_code} disabled={obj.disabled}>
                          {obj.title}
                        </Option>,
                      ])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="事件对象">
                  {getFieldDecorator('main_eventObject', {
                    rules: [{ required, message: '请选择事件对象' }],
                    initialValue: eventObject,
                  })(
                    <Cascader
                      fieldNames={{ label: 'title', value: 'dict_code', children: 'children' }}
                      options={objectmap}
                      onChange={handlcheckChange}
                      placeholder="请选择"
                      expandTrigger="hover"
                      displayRender={displayRender}
                    />,
                  )}
                </Form.Item>
              </Col>
            </>
          )}
          <Col span={8}>
            <Form.Item label="处理结果">
              {getFieldDecorator('handle_handleResult', {
                rules: [{ required, message: '请选择处理结果' }],
                initialValue: handle?.handleResult || '',
              })(
                <Select placeholder="请选择" onChange={(e) => ChangeResult(e)}>
                  {resultmap.map(obj => [
                    <Option key={obj.key} value={obj.dict_code}>
                      {obj.title}
                    </Option>,
                  ])}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="接单时间">
              {getFieldDecorator('handle_addTime', {
                rules: [{ required }],
                initialValue: moment(handle?.addTime || undefined).format('YYYY-MM-DD HH:mm:ss'),
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <div onClick={e => e.stopPropagation()}>
              <Form.Item label="处理完成时间">
                {getFieldDecorator('handle_endTime', {
                  //  rules: [{ required }],
                  initialValue: handle?.endTime || undefined,
                })(<Input disabled />)}
              </Form.Item>
            </div>
          </Col>
          {/* <Col span={24}>
          <Form.Item label="二线标签" {...forminladeLayout}>
            {getFieldDecorator('ha12')(
              <Input placeholder="请输入标签，至少两个字符，回车确认，最多输入八个标签" />,
            )}
          </Form.Item>
        </Col>
        <Col span={22} offset={2}>
          <span>您可输入相关标签（例如重点标签）</span>
          <div
            style={{
              marginBottom: 24,
              padding: '12px 12px 24px 12px',
              background: '#f1f1f1',
              borderRadius: 4,
            }}
          >
            <h5>推荐标签</h5>
            <div className={styles.margin_r}>
              <Button>重点标签</Button>
              <Button>标签1</Button>
              <Button>标签2</Button>
              <Button>标签3</Button>
              <Button>标签4</Button>
            </div>
          </div>
        </Col> */}
          <Col span={24} style={{ marginTop: 4, marginBottom: '-6px' }}>
            <Form.Item label="解决方案" {...forminladeLayout}>
              {getFieldDecorator('handle_content', {
                rules: [{ required, message: '请输入解决方案' }],
                initialValue: handle?.content || '',
              })(<FormTextArea
                autoSize={1}
                indexText={handle?.content || ''}
                isEdit
                getVal={v => setFieldsValue({ handle_content: v })}
              />)}
            </Form.Item>
          </Col>
          <Col span={24} style={{ paddingLeft: '8.33333333% ' }} >
            <KnowledgCollect
              valuealready={valuealready}
              content={knowledgecontent}
              orderType='event'
              orderId={mainId}
              ChangeValuealready={(v) => setValuealready(v)}
              HandleGEtContent={() => getContent()}
            />
          </Col>
          <Col span={24} style={{}}>
            <Form.Item
              label='上传附件'
              {...forminladeLayout}
            // extra="只能上传jpg/png/doc/xls格式文件，单个文件不能超过500kb"
            >
              {((location && location.state && !location.state.cache) || orderNo) && !loading && (
                <div onMouseDown={ChangeUserChoice(false)}>
                  <SysUpload fileslist={files} ChangeFileslist={newvalue => setFilesList(newvalue)} banOpenFileDialog={uploadStatus} />
                  <span style={{ color: '#ff0000' }}> 转回访请上传附件 </span>
                </div>
              )}
            </Form.Item>
          </Col>
        </Form>
      </Row>
    </>
  );
});

Handle.defaultProps = {
  info: {
    handle: {
      // addTime: moment().format("YYYY-MM-DD HH:mm:ss"),
      // endTime: moment().format("YYYY-MM-DD HH:mm:ss"),
      content: '',
      eventEffect: '',
      eventEmergent: '',
      eventPrior: '',
      handleResult: '',
      id: '',
    },
  },
  main: {
    eventObject: '',
    eventType: '',
    eventEffect: '',
    eventEmergent: '',
    eventPrior: '',
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

export default Form.create({})(Handle);
