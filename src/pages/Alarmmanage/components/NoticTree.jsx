import React, { useEffect, useState } from 'react';
import { Tree, Form, Row, Col, Input, Drawer, Button, AutoComplete, message } from 'antd';
import { SearchUsers } from '../../SysManage/services/api';
import { saveUser } from '../services/api';

const { TreeNode } = Tree;
const { Search } = Input;
const { Option } = AutoComplete;

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

function NoticTree(props) {
  const { visible, ChangeVisible, openType, alarmgroup, selectdata, record } = props;
  const { getFieldDecorator, resetFields, setFieldsValue, validateFields } = props.form;
  const [expandedKeys, setExpandedKeys] = useState(['a']);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [users, setUsers] = useState([]);
  const required = true;

  const hanldleCancel = () => {
    ChangeVisible(false);
    resetFields();
    setCheckedKeys([])
  };
  const handleOk = () => {
    validateFields((err, val) => {
      if (!err) {
        saveUser(val).then(res => {
          if (res.code === 200) {
            message.success('操作成功！');
            ChangeVisible(false);
            resetFields();
            setCheckedKeys([])
          }
        })
      }
    })
  }
  const onExpand = (Keys) => {
    setExpandedKeys(Keys);
  };
  const onCheck = (Keys) => {
    setFieldsValue({ noticGroup: Keys.toString() });
    setCheckedKeys(Keys);
  };
  const onSelect = (Keys, info) => {
    setSelectedKeys(Keys)
  };

  const Searchuser = (queKey) => {
    if (queKey) {
      SearchUsers({ queKey, page: 1, limit: 100 }).then(res => {
        if (res.code === 200) {
          setUsers(res.data.rows)
        }
      })
    };
  }

  const handleSelectduser = (v, opt) => {
    setFieldsValue({
      key1: opt.props.user.userName,
      username: opt.props.user.userName,
      userId: opt.props.user.id,
      userDept: opt.props.user.deptNameExt,
      tel: opt.props.user.userPhone,
    })
  };

  useEffect(() => {
    if (record && record.noticGroup) {
      const arr = record.noticGroup.split(',');
      setCheckedKeys(arr)
    }
  }, [record])

  // 用户列表
  const userlist = users.map(opt => (
    <Option key={opt.id} value={opt.userName} user={opt}>
      <div>
        <span style={{ marginRight: 8 }}>{opt.userName}</span>
        <span style={{ marginRight: 8 }}>{opt.deptNameExt}</span>
        <span>{opt.userPhone}</span>
      </div>
    </Option>
  ));

  const getTypebykey = key => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.key === key)[0].children;
    }
    return [];
  };

  const measurmap = getTypebykey(899);          // 计量
  const hostmap = getTypebykey(932);            // 主机巡检内容
  const softmap = getTypebykey(965);            // 软件      
  const appmap = getTypebykey(938);             // 应用程序
  const filesmmap = getTypebykey(973);          // 配置文件
  const messagermap = getTypebykey(950);        // 上下行报文
  // console.log(measurmap)

  // const treenodemap = new Map([
  //   ['计量业务告警', measurmap],
  //   ['主机巡检告警', hostmap],
  //   ['软件巡检告警', softmap],
  //   ['应用程序运行状态告警', appmap],
  //   ['配置文件变更告警', filesmmap],
  //   ['上下行报文页面告警', messagermap],
  // ]);

  return (
    <Drawer
      title="新增告警联系人"
      placement="right"
      onClose={hanldleCancel}
      visible={visible}
      width={500}
    >
      <Row>
        <Form {...formItemLayout}>
          <Row gutter={24}>
            <Col span={24} style={{ display: 'none' }}>
              <Form.Item label="id">{
                getFieldDecorator('id', {
                  initialValue: record.id,
                })(
                  <Input disabled />
                )}
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="告警通知人">{
                getFieldDecorator('key1', {
                  rules: [{ required, message: '请选择告警通知人' }],
                  initialValue: record.username,
                })(
                  <>
                    <AutoComplete
                      defaultActiveFirstOption={false}
                      filterOption={false}
                      optionLabelProp="value"
                      dataSource={userlist}
                      dropdownMatchSelectWidth={false}
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                      dropdownStyle={{ width: 600 }}
                      onSelect={(v, opt) => handleSelectduser(v, opt)}
                      disabled={openType === 'view'}
                    >
                      <Search
                        placeholder="可输入姓名或用户ID搜索"
                        onSearch={values => Searchuser(values)}
                        allowClear
                      />
                    </AutoComplete>
                  </>
                )}
              </Form.Item>
            </Col>
            <Col span={24} style={{ display: 'none' }}>
              <Form.Item label="告警通知人">{
                getFieldDecorator('username', {
                  initialValue: record.username,
                })(
                  <Input disabled />
                )}
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="告警通知人id">{
                getFieldDecorator('userId', {
                  rules: [{ required, message: '请选择告警通知人' }],
                  initialValue: record.userId,
                })(
                  <Input disabled />
                )}
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="所属部门">{
                getFieldDecorator('userDept', {
                  rules: [{ required, message: '请选择所属部门' }],
                  initialValue: record.userDept,
                })(
                  <Input disabled />
                )}
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="联系电话">{
                getFieldDecorator('tel', {
                  rules: [{ required, message: '请输入联系人电话' }],
                  initialValue: record.tel,
                })(
                  <Input allowClear />
                )}
              </Form.Item>
            </Col>
            <Col span={24}>
              {alarmgroup && alarmgroup.length > 0 && (<Form.Item label="告警通知组">{
                getFieldDecorator('noticGroup')(
                  <Tree
                    checkable
                    onExpand={onExpand}
                    expandedKeys={expandedKeys}
                    autoExpandParent
                    onCheck={onCheck}
                    checkedKeys={checkedKeys}
                    onSelect={onSelect}
                    selectedKeys={selectedKeys}
                  // defaultExpandedKeys={['a']}
                  >
                    <TreeNode title='全部' key='a'>
                      {alarmgroup.map(item => {
                        // const type = treenodemap.get(item.val);
                        if (item.key === '001') {
                          return (<TreeNode key={item.key} title={item.val} >
                            {measurmap.map(obj => [
                              <TreeNode key={`${item.key}_${obj.dict_code}`} title={obj.title} >
                                <TreeNode key={`${item.key}_${obj.dict_code}_1`} title='告警' />
                                <TreeNode key={`${item.key}_${obj.dict_code}_2`} title='确认告警' />
                                <TreeNode key={`${item.key}_${obj.dict_code}_3`} title='告警消除' />
                              </TreeNode>
                            ])}
                          </TreeNode>)
                        }
                        return (
                          <TreeNode key={item.key} title={item.val} >
                            <TreeNode key={`${item.key}_1`} title='告警' />
                            <TreeNode key={`${item.key}_2`} title='确认告警' />
                            <TreeNode key={`${item.key}_3`} title='告警消除' />
                          </TreeNode>)
                      })}
                    </TreeNode>
                  </Tree>
                )}
              </Form.Item>
              )}
            </Col>
          </Row>
        </Form>

      </Row>
      <div
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }}
      >
        <Button onClick={hanldleCancel} style={{ marginRight: 8 }}>
          取消
        </Button>
        <Button onClick={handleOk} type="primary">
          提交
        </Button>
      </div>
    </Drawer>
  );
}

NoticTree.defaultProps = {
  record: {}
}

export default Form.create()(NoticTree);