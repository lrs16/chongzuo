import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Table } from 'antd';
import { PaperClipOutlined } from '@ant-design/icons';
import styles from './style.less';

function Tracklist(props) {
  const { dispatch, demandId, tracklist } = props;

  useEffect(() => {
    if (tracklist === '') {
      dispatch({
        type: 'demandtodo/fetchtracklist',
        payload: {
          demandId,
        },
      });
    }
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
              id: info.id,
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
            {text !== '' && tracklist !== '' && (
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

  return <Table pagination={false} columns={columns} scroll={{ x: 1400 }} dataSource={tracklist} />;
}

export default connect(({ demandtodo, loading }) => ({
  tracklist: demandtodo.tracklist,
  loading: loading.models.demandtodo,
}))(Tracklist);
