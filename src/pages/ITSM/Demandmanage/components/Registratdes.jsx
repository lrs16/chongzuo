import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Descriptions } from 'antd';
import styles from '../index.less';
import { PaperClipOutlined } from '@ant-design/icons';

function Registratdes(props) {
  const { dispatch, info } = props;

  // 列表中下载附件
  const handledownload = uploadinfo => {
    dispatch({
      type: 'sysfile/downloadfile',
      payload: {
        id: uploadinfo.id,
      },
    }).then(res => {
      // console.log(res);
      const filename = uploadinfo.name;
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
    <div className={styles.collapse}>
      <Descriptions style={{ marginTop: 24 }}>
        <Descriptions.Item label="需求编号">{info.demandId}</Descriptions.Item>
        <Descriptions.Item label="建单时间">
          {moment(info.creationTime).format('YYYY-MM-DD HH:MM')}
        </Descriptions.Item>
        <Descriptions.Item label="申请时间">
          {moment(info.registerTime).format('YYYY-MM-DD HH:MM')}
        </Descriptions.Item>
        <Descriptions.Item label="期待完成时间">
          {moment(info.completeTime).format('YYYY-MM-DD HH:MM')}
        </Descriptions.Item>
        <Descriptions.Item label="申请人">{info.proposer}</Descriptions.Item>
        <Descriptions.Item label="申请单位">{info.proposingUnit}</Descriptions.Item>
        <Descriptions.Item label="申请部门">{info.proposingDepartment}</Descriptions.Item>
        <Descriptions.Item label="联系电话">{info.proposerPhone}</Descriptions.Item>
        <Descriptions.Item label="所属项目">缺</Descriptions.Item>
        <Descriptions.Item label="功能模块">{info.functionalModule}</Descriptions.Item>
        <Descriptions.Item label="功能变更类型">{info.demandType}</Descriptions.Item>
        <Descriptions.Item label="需求标题" span={3}>
          {info.title}
        </Descriptions.Item>
        <Descriptions.Item label="申请原因" span={3}>
          {info.reason}
        </Descriptions.Item>
        <Descriptions.Item label="详细申请内容" span={3}>
          {info.detail}
        </Descriptions.Item>
        <Descriptions.Item label="附件" span={3}>
          {info.attachment !== '' && (
            <>
              {JSON.parse(info.attachment).map(obj => {
                return (
                  <div key={obj.id}>
                    <PaperClipOutlined
                      style={{ marginRight: 8, fontSize: 11, color: 'rgba(0, 0, 0, 0.45)' }}
                    />
                    <a onClick={() => handledownload(obj)}>{obj.name}</a>
                    {/* <a onClick={() => handledeletfile(obj.uid)}>
                        <DeleteOutlined
                          style={{ marginLeft: 8, fontSize: 12, color: 'rgba(0, 0, 0, 0.45)' }}
                        />
                      </a> */}
                  </div>
                );
              })}
            </>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="登记人">{info.registerPerson}</Descriptions.Item>
        <Descriptions.Item label="登记人单位">{info.registrationUnit}</Descriptions.Item>
        <Descriptions.Item label="登记人部门">{info.registrationDepartment}</Descriptions.Item>
      </Descriptions>
    </div>
  );
}

export default connect(({ loading }) => ({
  loading: loading.effects['sysfile/downloadfile'],
}))(Registratdes);
