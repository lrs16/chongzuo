import React, { useEffect, useRef, useImperativeHandle, useState } from 'react';
import {
  Table,
  Form,
  Input,
  Col,
  Row,
  Button,
  Divider,
  Popconfirm,
  Select,
  message
} from 'antd';
import { connect } from 'dva';
import SysUpload from '@/components/SysUpload';

const { TextArea } = Input;
const { Option } = Select;
const ThisweekMaintenance = React.forwardRef((props, ref) => {
  const attRef = useRef();
  useImperativeHandle(
    ref,
    () => ({
      attRef,
    }),
    [],
  );

  const {
    contentRow,
    contentArr,
    detailParams
  } = props;

  const [data, setData] = useState([]);

  // 初始化把数据传过去
  useEffect(() => {
    if (data && data.length) {
      contentRow(data)
    }
  }, [data]);

  const handleSave = () => {
    contentRow(data);
    message.info('暂存保存数据成功')
  }

  const addData = [
    {
      field1: '',
      field2: '',
      field3: '',
      field4: '',
      field5: '',
      field6: '',
      field7: '',
      field8: ''
    }
  ]

  //  获取行  
  const getRowByKey = (key, newData) => {
    return (newData || data).filter(item => item.key === key)[0];
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
    const newarr = (contentArr).map((item, index) => {
      return Object.assign(item, { editable: true, isNew: false, key: index })
    })
    setData(newarr)
  }


  const column = [
    {
      title: '系统名称',
      dataIndex: 'field1',
      key: 'field1',
      render: (text, record) => {
        return (
          <Input
            defaultValue={text}
            disabled={detailParams}
            onChange={e => handleFieldChange(e.target.value, 'field1', record.key)}
          />
        )
      }
    },
    {
      title: '工单数',
      dataIndex: 'field2',
      key: 'field2',
      render: (text, record) => {
        return (
          <Input
            disabled={detailParams}
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field2', record.key)}
          />
        )
      }
    },
    {
      title: '巡检次数',
      dataIndex: 'field3',
      key: 'field3',
      render: (text, record) => {
        return (
          <Input
            disabled={detailParams}
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field3', record.key)}
          />
        )
      }
    },
    {
      title: '系统发生影响业务运行的故障次数',
      dataIndex: 'field4',
      key: 'field4',
      render: (text, record) => {
        return (
          <Input
            disabled={detailParams}
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field4', record.key)}
          />
        )
      }
    },
    {
      title: '性能调优',
      dataIndex: 'field5',
      key: 'field5',
      render: (text, record) => {
        return (
          <Input
            disabled={detailParams}
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field5', record.key)}
          />
        )
      }
    },
    {
      title: '系统升级',
      dataIndex: 'field6',
      key: 'field6',
      render: (text, record) => {
        return (
          <Input
            disabled={detailParams}
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field6', record.key)}
          />
        )
      }
    },
    {
      title: '重要时期业务保障',
      dataIndex: 'field7',
      key: 'field7',
      render: (text, record) => {
        return (
          <Input
            disabled={detailParams}
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field7', record.key)}
          />
        )
      }
    },
    {
      title: '运维材料',
      dataIndex: 'field8',
      key: 'field8',
      render: (text, record) => {
        return (
          <Input
            disabled={detailParams}
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field8', record.key)}
          />
        )
      }
    },
    // {
    //   title: '操作',
    //   key: 'action',
    //   fixed: 'right',
    //   width: 120,
    //   render: (text, record) => {
    //     return (
    //       <span>
    //         <Popconfirm title="是否要删除此行？" onConfirm={() => remove(record.key)}>
    //           <a>删除</a>
    //         </Popconfirm>
    //       </span>
    //     )
    //   }

    // }
  ];

  useEffect(() => {
    handleTabledata();
  }, [])

  return (
    <>
      <Row gutter={16}>
        <Col span={24}>
          <p style={{ fontWeight: '900', fontSize: '16px' }}>一、本周运维情况综述</p>
        </Col>

        <Col style={{ marginBottom: '10px',textAlign:'center' }} span={24}>
          <Button
            type='primary'
            disabled={detailParams}
            onClick={handleSave}>保存</Button>
        </Col>

        <Col span={24}>
        <Table
          columns={column}
          dataSource={data}
          pagination={false}
        />
        </Col>
       

      </Row>
    </>
  )
})

export default Form.create({})(ThisweekMaintenance)
