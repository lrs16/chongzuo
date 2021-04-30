import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import {
  Form,
  Card,
  Input,
  Radio,
  Table,
  message,
  Divider
} from 'antd';
import Configurationedit from './components/Configurationedit';
import Monitoringinstruction from './components/Monitoringinstruction';
import { PageHeaderWrapper } from '@ant-design/pro-layout';



function MonitorConfiguration(props) {
  const pagetitle = props.route.name;
  const {
    dispatch,
    configurationArr,
    loading
  } = props;
  const [cacheOriginData, setcacheOriginData] = useState({});
  const [data, setData] = useState([]);
  const [fileslist, setFilesList] = useState([]);
  const [newbutton, setNewButton] = useState(false);
  const [tabActiveKey,setTabActiveKey] = useState('configure');
 
 

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

  useEffect(() => {
    getTobolist();
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
      title: '监控项',
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
      title: '监控类型',
      dataIndex: 'type',
      key: 'tytypepecn',
    },
    {
      title: '使用状态',
      dataIndex: 'useStatus',
      key: 'useStatus',
      width:200,
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
      width:150,
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

  const tabList = [
    {
      key:'configure',
      tab:'监控配置'
    },
    {
      key:'instructions',
      tab:'监控指令'
    },
    // {
    //   key:'networklevel',
    //   tab:'网级配置'
    // },
  ]

  const handleTabChange = (key) => {
    setTabActiveKey(key);
  }


  return (
    <PageHeaderWrapper 
    title={pagetitle}
    tabList={tabList}
    tabActiveKey={tabActiveKey}
    onTabChange={handleTabChange}
    >
    <Card>
      {
        tabActiveKey === 'configure' && (
          <Table
          loading={loading}
          columns={columns}
          dataSource={data}
        // rowKey={record => record.id}
        />
        )
      }

      {
        tabActiveKey === 'instructions' && (
          <Monitoringinstruction />
        )
      }
   
    </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ monitorconfiguration, loading }) => ({
    configurationArr: monitorconfiguration.configurationArr,
  }))(MonitorConfiguration),
);
