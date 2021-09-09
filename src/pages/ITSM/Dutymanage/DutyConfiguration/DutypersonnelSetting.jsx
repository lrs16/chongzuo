import React, {
  useState,
  // useEffect 
} from 'react';
import { connect } from 'dva';
import AdddutyPersonnelSetting from './components/AdddutyPersonnelSetting';
import {
  Card,
  Row,
  Col,
  Form,
  Input,
  Button,
  Table,
  AutoComplete,
  Select
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const { Search } = Input;
const { Option } = Select;

const dutypersonnel = [
  { key: '1', name: 'zhangsan' },
  { key: '2', name: 'lsi', },
  { key: '3', name: 'wangwu', },
];

const dutypersonnel1 = [
  { key: '1', name: '岗位1' },
  { key: '2', name: '岗位2', },
  { key: '3', name: '岗位3', },
];

const dutypersonnel2 = [
  { key: '1', name: '班组1' },
  { key: '2', name: '班组2', },
  { key: '3', name: '班组3', },
];

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

function DutypersonnelSetting(props) {
  const pagetitle = props.route.name;
  const {
    form: {
      getFieldDecorator,
      resetFields,
      // getFieldsValue 
    },
    // dispatch,
  } = props;

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // const [newbutton, setNewButton] = useState(false);

  const handleSearch = () => {
    console.log('查询')
  }
  const handleReset = () => {
    console.log('重置')
    resetFields();
  }

  // 新增一条记录
  // const newMember = () => {
  //   // setFilesList([]);
  //   // setKeyUpload('');
  //   //  const newData = data.map(item => ({ ...item }));
  //   data.push({
  //     key: data.length + 1,
  //     id: '',
  //     name: '',
  //     type: '',
  //     app: '',
  //     attachmentId: '',
  //     editable: true,
  //     isNew: true,
  //   });
  //   //  setData(newData);
  //   setNewButton(true);
  // };

  // const handleChange = (value, key) => {
  //   const rowdata = JSON.parse(value);
  //   const newdata = [...data];
  //   newdata[key - 1].name = rowdata.name;
  //   newdata[key - 1].type = rowdata.type;
  //   newdata[key - 1].app = rowdata.app;
  //   setData(newdata);
  //   setNewButton(false);
  // }

  const onSelectChange = (RowKeys) => {
    setSelectedRowKeys(RowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: (key, record) => onSelectChange(key, record),
  };

  // 查询
  const extra = (<>
    <Button type="primary" onClick={() => handleSearch()}>查 询</Button>
    <Button style={{ marginLeft: 8 }} onClick={() => handleReset()}>重 置</Button></>
  )

  const columns = [
    {
      title: '序号',
      dataIndex: 'key',
      key: 'key',
      width: 60,
      align: 'center',
      render: (index) => {
        return <>{`${index + 1}`}</>;
      },
    },
    {
      title: '值班人员',
      dataIndex: 'zbry',
      key: 'zbry',
      render: (text, record) => {
        if (record.isNew) {
          return (
            <>
              <Select placeholder="请选择"
              // onChange={v => handleChange(v, record.key)}
              >
                {dutypersonnel.map(obj => [
                  <Option key={obj.key} value={JSON.stringify(obj)}>
                    {obj.name}
                  </Option>,
                ])}
              </Select>
            </>
          )
        }
        return text;
      }
    },
    {
      title: '所属部门',
      dataIndex: 'ssbm',
      key: 'ssbm',
    },
    {
      title: '所属岗位',
      dataIndex: 'ssgw',
      key: 'ssgw',
      render: (text, record) => {
        if (record.isNew) {
          return (
            <>
              <Select placeholder="请选择"
              // onChange={v => handleChange(v, record.key)}
              >
                {dutypersonnel1.map(obj => [
                  <Option key={obj.key} value={JSON.stringify(obj)}>
                    {obj.name}
                  </Option>,
                ])}
              </Select>
            </>
          )
        }
        return text;
      }
    },
    {
      title: '所属班组',
      dataIndex: 'ssbz',
      key: 'ssbz',
      render: (text, record) => {
        if (record.isNew) {
          return (
            <>
              <Select placeholder="请选择"
              // onChange={v => handleChange(v, record.key)}
              >
                {dutypersonnel2.map(obj => [
                  <Option key={obj.key} value={JSON.stringify(obj)}>
                    {obj.name}
                  </Option>,
                ])}
              </Select>
            </>
          )
        }
        return text;
      }
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
    },
  ];

  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card>
        <Row gutter={8}>
          <Form {...formItemLayout} onSubmit={handleSearch}>
            <Col span={8}>
              <Form.Item label="值班人员">
                {getFieldDecorator('form1', {
                  initialValue: '',
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="所属部门">
                {getFieldDecorator('form2', {
                  initialValue: '',
                })(
                  <AutoComplete
                    // dataSource={disableduser}
                    dropdownMatchSelectWidth={false}
                    dropdownStyle={{ width: 600 }}
                  // onSelect={(v, opt) => handleDisableduser(v, opt)}
                  >
                    <Search
                      placeholder="输入搜索"
                      // onSearch={values => SearchDisableduser(values)}
                      allowClear
                    />
                  </AutoComplete>,
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="所属岗位">
                {getFieldDecorator('form3', {
                  initialValue: '',
                })(
                  <AutoComplete
                    // dataSource={disableduser}
                    dropdownMatchSelectWidth={false}
                    dropdownStyle={{ width: 600 }}
                  // onSelect={(v, opt) => handleDisableduser(v, opt)}
                  >
                    <Search
                      placeholder="输入搜索"
                      // onSearch={values => SearchDisableduser(values)}
                      allowClear
                    />
                  </AutoComplete>,
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="联系电话">
                {getFieldDecorator('form4', {
                  initialValue: '',
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            <Col span={24} style={{ textAlign: 'right', paddingTop: 4, marginBottom: 24 }}>{extra}</Col>
          </Form>
        </Row>

        <AdddutyPersonnelSetting
          title='新建值班人员设置'
        >
          <Button
            style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
            icon='plus'
          >
            新建值班人员设置
          </Button>
        </AdddutyPersonnelSetting>

        <Table
          columns={columns}
          // dataSource={}
          bordered
          size='middle'
          rowKey={(_, index) => index.toString()}
          pagination={false}
          rowSelection={rowSelection}
        />
      </Card>
    </PageHeaderWrapper >
  );
}

export default Form.create({})(
  connect()(DutypersonnelSetting),
);