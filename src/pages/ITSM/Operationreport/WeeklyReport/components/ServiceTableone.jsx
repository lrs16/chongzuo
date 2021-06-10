import React, { useEffect, useImperativeHandle, useContext, useState } from 'react';
import {
  Table,
  Form,
  Input,
  Col,
  Row,
  Button,
  Divider,
  Popconfirm
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
    if(loading === false && maintenanceArr && maintenanceArr.data) {
      const result = JSON.parse(JSON.stringify(maintenanceArr.data)
      .replace(/first_object/g, 'field1')
      .replace(/second_object/g, 'field2')
      .replace(/last_num/g, 'field3').replace(/now_num/g, 'field4')
      .replace(/points_count/g, 'field5'))
      if(result) {
        typeList(result)
      }
    }
  }, [maintenanceArr]);


   // 新增一条记录
   const newMember = (params) => {
    setFilesList([]);
    setKeyUpload('');
    const newData = (data).map(item => ({ ...item }));
    newData.push({
      key: data.length + 1,
      id: '',
      dd11: '新增数据',
      dd22: '',
      dd33: 'dd',
      dd44: '',
    });
    setData(newData);
    setNewButton(true);
  };

  //  获取行  
  const getRowByKey = (key, newData) => {
    return (newData || data).filter(item => item.key === key)[0];
  }

  //  删除数据
  const remove = key => {
    const target = getRowByKey(key) || {};
    // dispatch({
    //   type: 'chacklist/trackdelete',
    //   payload: {
    //     id: target.id,
    //   },
    // }).then(res => {
    //   if (res.code === 200) {
    //     message.success(res.msg, 2);
    //     getlistdata();
    //   }
    // });
  };

  // 编辑记录
  const toggleEditable = (e, key, record) => {

    e.preventDefault();
    const newData = data.map(item => ({ ...item })
    );
    const target = getRowByKey(key, newData);
    if (target) {
      if (!target.editable) {
        setcacheOriginData({ key: { ...target } });
      }
      // target.editable = !target.editable;
      target.isNew = true;
      setData(newData);
    }
  }

  //  点击编辑生成filelist
  const handlefileedit = (key, values) => {
    if (!values) {
      setFilesList([]);
    } else {
      setFilesList(JSON.parse(values))
    }
  }

  const savedata = (target, id) => {
    legacyList(data)
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
    const newarr = remainingDefectslist.map((item, index) => {
      return Object.assign(item, { editable: true, isNew: false, key: index })
    })
    setData(newarr)
  }


  const handlemaintenanserviceceArr = () => {
    dispatch({
      type: 'eventstatistics/fetchMaintenancelist',
      payload: { tabActiveKey, startTime, endTime }
    })
  }

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
      title:  tabActiveKey === 'week' ? '上周':'上月',
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
      title: tabActiveKey === 'week' ? '本周':'本月',
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

  useEffect(() => {
    if (startTime && tabActiveKey) {
      handlemaintenanserviceceArr()
    }
  }, [startTime])

  // useEffect(() => {
  //   if(loading === false) {
  //     handleTabledata()
  //   }
  // },[loading])

  return (
    <>
      {loading === false && (
        <Row gutter={16}>
          <Col span={24}>
            <p style={{ fontWeight: '900', fontSize: '16px', marginTop: '20px' }}>三、运维服务指标完成情况</p>
          </Col>

          <Col span={24}>
            <p>（一）运维分类统计情况 </p>
          </Col>

          <Table
            columns={column}
            dataSource={maintenanceArr.data}
          />
        </Row>

      )}

    </>
  )
}

// export default Form.create({})(ServiceCompletion)
export default Form.create({})(
  connect(({ eventstatistics, loading }) => ({
    maintenanceService: eventstatistics.maintenanceService,
    maintenanceArr: eventstatistics.maintenanceArr,
    soluteArr: eventstatistics.soluteArr,
    loading: loading.models.eventstatistics
  }))(ServiceTableone),
);