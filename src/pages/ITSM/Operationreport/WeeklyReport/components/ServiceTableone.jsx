import React, { useEffect, useImperativeHandle, useContext, useState } from 'react';
import {
  Table,
  Form,
  Input,
  Col,
  Row,
  Button,
  Divider,
  Popconfirm,
  message
} from 'antd';
import { connect } from 'dva';
import SysUpload from '@/components/SysUpload';

const { TextArea } = Input;
function ServiceTableone(props) {

  const {
    form: { getFieldDecorator },
    maintenanceArr,
    typeList,
    startTime,
    endTime,
    tabActiveKey,
    mainId,
    typeArr,
    loading,
    dispatch
  } = props;
  const [data, setData] = useState([]);
  const [seconddata, setSeconddata] = useState([]);
  const [cacheOriginData, setcacheOriginData] = useState({});
  const [uploadkey, setKeyUpload] = useState('');
  const [fileslist, setFilesList] = useState([]);
  const [newbutton, setNewButton] = useState(false);

  // 初始化把数据传过去
  useEffect(() => {
    // typeList(maintenanceArr)
    if (maintenanceArr && maintenanceArr.length) {
      const result = JSON.parse(JSON.stringify(maintenanceArr)
        .replace(/first_object/g, 'field1')
        .replace(/second_object/g, 'field2')
        .replace(/last_num/g, 'field3').replace(/now_num/g, 'field4')
        .replace(/points_count/g, 'field5'))
      if (result) {
        typeList(result)
      }
    }
  }, [data]);



  // 新增一条记录
  const newMember = (params) => {
    setFilesList([]);
    setKeyUpload('');
    const newData = (data).map(item => ({ ...item }));
    newData.push({
      key: data.length + 1,
      id: '',
      dd11: '',
      dd22: '',
      dd33: '',
      dd44: '',
    });
    setData(newData);
    setNewButton(true);
  };

  //  获取行  
  const getRowByKey = (key, newData) => {
    return (newData || data).filter(item => item.key === key)[0];
  }

  const handleSave = () => {
    typeList(data);
    message.info('暂存保存数据成功')
  }

  const saveRow = (e, key) => {
    const target = getRowByKey(key) || {};

    delete target.key;
    target.editable = false;
    const id = target.id === '' ? '' : target.id;
    savedata(target, id);
    if (target.isNew) {
      target.isNew = false;
      setNewButton(false);
    }
  }

  const handleFieldChange = (e, fieldName, key) => {
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData)
    if (target) {
      target[fieldName] = e;
      setData(newData);
    }
  }

  const handleTabledata = () => {
    // console.log(mainId?typeArr:maintenanceArr)
    if (newbutton === false) {
      const newarr = (maintenanceArr).map((item, index) => {
        return Object.assign(item, { editable: true, isNew: false, key: index })
      })
      setData(newarr)
    }

  }

  useEffect(() => {
    handleTabledata();
  }, [maintenanceArr])

  const column = [
    {
      title: '一级对象',
      dataIndex: 'first_object',
      key: 'first_object',
      // render: (text, record) => {
      //   if (record.isNew) {
      //     return (
      //       <Input
      //         defaultValue={text}
      //         onChange={e => handleFieldChange(e.target.value, 'field1', record.key)}
      //       />
      //     )
      //   }
      //   if (record.isNew === false) {
      //     return <span>{text}</span>
      //   }
      // }
    },
    {
      title: '二级对象',
      dataIndex: 'second_object',
      key: 'second_object',
      // render: (text, record) => {
      //   if (record.isNew) {
      //     return (
      //       <Input
      //         defaultValue={text}
      //         onChange={e => handleFieldChange(e.target.value, 'field1', record.key)}
      //       />
      //     )
      //   }
      //   if (record.isNew === false) {
      //     return <span>{text}</span>
      //   }
      // }
    },
    {
      title: tabActiveKey === 'week' ? '上周' : '上月',
      dataIndex: 'last_num',
      key: 'last_num',
      // render: (text, record) => {
      //   if (record.isNew) {
      //     return (
      //       <Input
      //         defaultValue={text}
      //         onChange={e => handleFieldChange(e.target.value, 'field1', record.key)}
      //       />
      //     )
      //   }
      //   if (record.isNew === false) {
      //     return <span>{text}</span>
      //   }
      // }
    },
    {
      title: tabActiveKey === 'week' ? '本周' : '本月',
      dataIndex: 'now_num',
      key: 'now_num',
      // render: (text, record) => {
      //   if (record.isNew) {
      //     return (
      //       <Input
      //         defaultValue={text}
      //         onChange={e => handleFieldChange(e.target.value, 'field1', record.key)}
      //       />
      //     )
      //   }
      //   if (record.isNew === false) {
      //     return <span>{text}</span>
      //   }
      // }
    },
    {
      title: '环比',
      dataIndex: 'points_count',
      key: 'points_count',
      // render: (text, record) => {
      //   if (record.isNew) {
      //     return (
      //       <Input
      //         defaultValue={text}
      //         onChange={e => handleFieldChange(e.target.value, 'field1', record.key)}
      //       />
      //     )
      //   }
      //   if (record.isNew === false) {
      //     return <span>{text}</span>
      //   }
      // }
    },
  ];
  const editColumn = [
    {
      title: '一级对象',
      dataIndex: 'field1',
      key: 'field1',
      // render: (text, record) => {
      //   if (record.isNew) {
      //     return (
      //       <Input
      //         defaultValue={text}
      //         onChange={e => handleFieldChange(e.target.value, 'field1', record.key)}
      //       />
      //     )
      //   }
      //   if (record.isNew === false) {
      //     return <span>{text}</span>
      //   }
      // }
    },
    {
      title: '二级对象',
      dataIndex: 'field2',
      key: 'field2',
      // render: (text, record) => {
      //   if (record.isNew) {
      //     return (
      //       <Input
      //         defaultValue={text}
      //         onChange={e => handleFieldChange(e.target.value, 'field1', record.key)}
      //       />
      //     )
      //   }
      //   if (record.isNew === false) {
      //     return <span>{text}</span>
      //   }
      // }
    },
    {
      title: tabActiveKey === 'week' ? '上周' : '上月',
      dataIndex: 'field3',
      key: 'field3',
      // render: (text, record) => {
      //   if (record.isNew) {
      //     return (
      //       <Input
      //         defaultValue={text}
      //         onChange={e => handleFieldChange(e.target.value, 'field1', record.key)}
      //       />
      //     )
      //   }
      //   if (record.isNew === false) {
      //     return <span>{text}</span>
      //   }
      // }
    },
    {
      title: tabActiveKey === 'week' ? '本周' : '本月',
      dataIndex: 'field4',
      key: 'field4',
      // render: (text, record) => {
      //   if (record.isNew) {
      //     return (
      //       <Input
      //         defaultValue={text}
      //         onChange={e => handleFieldChange(e.target.value, 'field1', record.key)}
      //       />
      //     )
      //   }
      //   if (record.isNew === false) {
      //     return <span>{text}</span>
      //   }
      // }
    },
    {
      title: '环比',
      dataIndex: 'field5',
      key: 'field5',
      // render: (text, record) => {
      //   if (record.isNew) {
      //     return (
      //       <Input
      //         defaultValue={text}
      //         onChange={e => handleFieldChange(e.target.value, 'field1', record.key)}
      //       />
      //     )
      //   }
      //   if (record.isNew === false) {
      //     return <span>{text}</span>
      //   }
      // }
    },
  ];

  return (
    <>
      <Row gutter={16}>
        <Col span={24}>
          <p style={{ fontWeight: '900', fontSize: '16px', marginTop: '20px' }}>三、运维服务指标完成情况</p>
        </Col>

        <Col span={24}>
          <Button
            type='primary'
            onClick={handleSave}>保存</Button>
        </Col>


        <Col span={24}>
          <p>（一）运维分类统计情况 </p>
        </Col>

        <Table
          columns={mainId ? editColumn : column}
          dataSource={maintenanceArr}
          pagination={false}
        />
      </Row>
    </>
  )
}

export default Form.create({})(ServiceTableone)