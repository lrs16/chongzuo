import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Table, Row, Col, Form, Radio, Input } from 'antd';
import { PaperClipOutlined } from '@ant-design/icons';
import styles from './style.less';

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

function Tracklist(props) {
  const { dispatch, demandId, trackslist, loading } = props;
  const [data, setData] = useState([]);
  const [status, setStatus] = useState('open');

  const getlistdata = () => {
    dispatch({
      type: 'chacklist/fetchtracklist',
      payload: {
        demandId,
      },
    }).then(res => {
      if (res.code === 200) {
        const newarr = res.data.map((item, index) => {
          return Object.assign(item, { key: index });
        });
        setData(newarr);
        setStatus(res.status);
      }
    });
  };

  useEffect(() => {
    getlistdata();
    return () => {
      setData([]);
    };
  }, []);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: '开发进度',
      dataIndex: 'developSchedule',
      key: 'developSchedule',
      width: 150,
    },
    {
      title: '跟踪说明',
      dataIndex: 'trackDirections',
      key: 'trackDirections',
      width: 200,
    },
    {
      title: '附件',
      dataIndex: 'attachment',
      key: 'attachment',
      width: 250,
      render: text => {
        // 列表中下载附件
        const handledownload = info => {
          dispatch({
            type: 'sysfile/downloadfile',
            payload: {
              id: info.uid,
            },
          }).then(res => {
            // console.log(res);
            const filename = info.name;
            const blob = new Blob([res]);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
          });
        };
        return (
          <>
            {text !== '' && trackslist !== '' && (
              <div className={styles.greylink}>
                {JSON.parse(text).map(obj => {
                  return (
                    <div key={obj.id}>
                      <PaperClipOutlined
                        style={{ marginRight: 8, fontSize: 11, color: 'rgba(0, 0, 0, 0.45)' }}
                      />
                      <a onClick={() => handledownload(obj)}>{obj.name}</a>
                    </div>
                  );
                })}
              </div>
            )}
            {text === '' && <>{text}</>}
          </>
        );
      },
    },
    {
      title: '跟踪时间',
      dataIndex: 'gmtCreate',
      key: 'gmtCreate',
      width: 200,
    },
    {
      title: '跟踪人',
      dataIndex: 'stalker',
      key: 'stalker',
      width: 100,
    },
    {
      title: '所在单位',
      dataIndex: 'trackUnit',
      key: 'trackUnit',
      width: 120,
    },
    {
      title: '所在部门',
      dataIndex: 'trackDepartment',
      key: 'trackDepartment',
      width: 120,
    },
  ];

  return (
    <>
      <Row gutter={24}>
        <Form {...formItemLayout}>
          <Col span={8}>
            <Form.Item label="预计开发完成时间">
              <Input disabled value={data.length > 0 ? data[data.length - 1].devFinishTime : ''} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="预计发布时间">
              <Input disabled value={data.length > 0 ? data[data.length - 1].releaseTime : ''} />
            </Form.Item>
          </Col>
          <Col span={8} style={{ paddingTop: 4 }}>
            {status !== '' && (<Radio checked style={{ marginTop: 8 }}>已到发布库</Radio>)}
          </Col>
        </Form>
      </Row>
      <Table
        pagination={false}
        columns={columns}
        scroll={{ x: 1400 }}
        dataSource={data}
        loading={loading}
      />
    </>
  );
}

export default connect(({ trackslist, loading }) => ({
  trackslist,
  loading: loading.models.chacklist,
}))(Tracklist);
