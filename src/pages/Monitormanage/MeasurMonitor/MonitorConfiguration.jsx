import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import {
  Form,
  Card,
  Input,
  Radio,
  Table,
  message,
  Divider,
  Row,
  Col,
  Button
} from 'antd';
import router from 'umi/router';
import Configurationedit from './components/Configurationedit';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

function MonitorConfiguration(props) {
  const pagetitle = props.route.name;
  const {
    dispatch,
    location,
    form: { getFieldDecorator,resetFields,validateFields },
    configurationArr,
    loading
  } = props;
  const [cacheOriginData, setcacheOriginData] = useState({});
  const [data, setData] = useState([]);
  const [fileslist, setFilesList] = useState([]);
  const [newbutton, setNewButton] = useState(false);
  const [tabActiveKey, setTabActiveKey] = useState('configure');
  const [paginations,setPaginations] = useState({ current:0,pageSize:15});


  // 更新表单信息
  const handleFieldChange = (e, fieldName, key) => {
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData);
    // console.log('target: ', target);
    if (target) {
      target[fieldName] = e;
      setData(newData);
    }
  };

  // 编辑记录
  const toggleEditable = (e, key) => {
    e.preventDefault();
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData);
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        setcacheOriginData({ key: { ...target } });
      }
      // target.editable = !target.editable;
      target.isNew = true;
      setData(newData);
    }
  };


  // 点击编辑生成filelist,
  // const handlefileedit = (key, values) => {
  //   // setKeyUpload(key);
  //   if (!values) {
  //     setFilesList([]);
  //   } else {
  //     setFilesList(JSON.parse(values));
  //   }
  // };

  const getTobolist = () => {
    return dispatch({
      type: 'monitorconfiguration/fetch',
    }).then(res => {
      if (res.code === 200) {
        const newarr = (res.data).map((item, index) => {
          return Object.assign(item, { editable: true, isNew: false, key: index })
        })
        setData(newarr);
      }
    });
  };

  const searchdata = (value,page,pageSize) => {
    return dispatch({
      type: 'monitorconfiguration/fetch',
      payload:{
        ...value,
        page,
        pageSize
      }
    }).then(res => {
      if (res.code === 200) {
        const newarr = (res.data).map((item, index) => {
          return Object.assign(item, { editable: true, isNew: false, key: index })
        })
        setData(newarr);
      }
    });
  }

  useEffect(() => {
    validateFields((err,value) => {
      searchdata(value,paginations.current,paginations.pageSize)
    })
  }, []);

  // 获取行
  const getRowByKey = (key, newData) => {
    return (newData || data).filter(item => item.key === key)[0];

  };

  // 提交保存数据
  const savedata = (target, id) => {
    dispatch({
      type: 'monitorconfiguration/saveConfigura',
      payload: {
        ...target,
        id,
      },
    }).then(res => {
      if (res.code === 200) {
        message.success(res.msg);
        getTobolist();
      }
    });
  };


  // 保存记录
  const saveRow = (e, key) => {
    const target = getRowByKey(key) || {};
    // if (!target.remark || !target.cron) {
    //   message.error('请填写完整信息。');
    //   e.target.focus();
    //   return;
    // }
    delete target.key;
    target.editable = false;
    const id = target.id === '' ? '' : target.id;
    savedata(target, id);
    if (target.isNew) {
      setNewButton(false);
    }
  };

  // 取消按钮
  const cancel = (e, key) => {
    e.preventDefault();
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData);
    const newArr = newData.filter(item => item.key !== target.key);
    setData(newArr);
    setNewButton(false);
  };

  const columns = [
    {
      title: '监控项11',
      dataIndex: 'item',
      key: 'item',
    },
    {
      title: '描述',
      dataIndex: 'remark',
      key: 'remark',
      render: (text, record) => {
        if (record.isNew) {
          return <Input
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'remark', record.key)}
          />
        }
        if (record.isNew === false) {
          return <span>{text}</span>
        }
      }
    },
    {
      title: '监控频率',
      dataIndex: 'cron',
      key: 'cron',
      render: (text, record) => {
        if (record.isNew) {
          return <Input
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'sourcecn', record.key)}
          />
        }
        if (record.isNew === false) {
          return <span>{text}</span>
        }
      }
    },
    {
      title: '监护间隔（分/次)',
      dataIndex: 'cron',
      key: 'cron',
      render: (text, record) => {
        if (record.isNew) {
          return <Input
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'sourcecn', record.key)}
          />
        }
        if (record.isNew === false) {
          return <span>{text}</span>
        }
      }
    },
    {
      title: '监控类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '使用状态',
      dataIndex: 'useStatus',
      key: 'useStatus',
      width: 200,
      render: (text, record) => {
        if (record.isNew) {
          return (
            <Radio.Group value={record.useStatus} onChange={e => handleFieldChange(e.target.value, 'useStatus', record.key)}>
              <Radio value='Y'>启用</Radio>
              <Radio value='N'>停用</Radio>
            </Radio.Group>
          )
        }

        if (record.isNew === false) {
          return (
            <Radio.Group value={record.useStatus}>
              <Radio value='Y' disabled>启用</Radio>
              <Radio value='N' disabled>停用</Radio>
            </Radio.Group>
          )
        }

      }
    },
    {
      title: '操作',
      dataIndex: '',
      key: '',
      width: 150,
      render: (text, record) => {
        if (record.editable) {
          if (record.isNew === true) {
            return (
              <span>
                <a onClick={e => saveRow(e, record.key)}>保存</a>
                <Divider type='vertical' />
                <Configurationedit
                  code={record.code}
                >
                  <a>配置详情</a>
                </Configurationedit>
              </span>
            )
          }
        }

        return (
          <span>
            <a
              onClick={e => {
                toggleEditable(e, record.key, record);
                // handlefileedit(record.key, record.attachment);
              }}
            >编辑</a>
            <Divider type='vertical' />
            <Configurationedit
              code={record.code}
            >
              <a>配置详情</a>
            </Configurationedit>
          </span>
        )
      }
    },
  ];



  const handleReset = () => {
    router.push({
      pathname:location.pathname,
      query:{},
      state:{}
    })
    resetFields();
    
  }

  const onShowSizeChange = (page,pageSize) => {
    validateFields((err,values) => {
      if(!err) {
        searchdata(values,page,pageSize)
      }
     })
  }

  const pagination = {
    showSizeChanger:true,
    onShowSizeChange:(page,pagesize) => onShowSizeChange(page,pagesize),
    current:paginations.current,
    pageSize:paginations.pageSize,
    total: (data && data.length) || 0,
  }


  return (
    <PageHeaderWrapper
      title={pagetitle}
    >
      <Card>
        {/* <Row>
          <Form {...formItemLayout}>
            <Col span={8}>
              <Form.Item label='监控项'>
                {
                  getFieldDecorator('item', {

                  })(<Input />)
                }
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label='监控类型'>
                {
                  getFieldDecorator('type', {

                  })(<Input />)
                }
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label='描述'>
                {
                  getFieldDecorator('remark', {

                  })(<Input />)
                }
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label='频率'>
                {
                  getFieldDecorator('cron', {

                  })(<Input />)
                }
              </Form.Item>
            </Col>

            <Col span={16} style={{ textAlign: 'right' }}>
              <Button type='primary' style={{ marginRight: 8 }}>查 询</Button>
              <Button onClick={handleReset}>重 置</Button>
            </Col>
          </Form>
        </Row> */}




        <Table
          loading={loading}
          columns={columns}
          dataSource={data}
          pagination={false}
          // pagination={pagination}
        // rowKey={record => record.id}
        />
        {/* {
        tabActiveKey === 'instructions' && (
          <Monitoringinstruction />
        )
      } */}

      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ monitorconfiguration, loading }) => ({
    configurationArr: monitorconfiguration.configurationArr,
    loading: loading.models.monitorconfiguration
  }))(MonitorConfiguration),
);
