import React, { Component } from 'react';
import { connect } from 'dva';
// import Link from 'umi/link';
import moment from 'moment';
import { Table, Card, Badge, Divider } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

@connect(({ opsscenes, loading }) => ({
  opsscenes,
  loading: loading.models.opsscenes,
}))
class Home extends Component {
  componentDidMount() {
    // console.log(this.props.location.state);
    const { Jobid } = this.props.location.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'opsscenes/fetchjoblist',
      payload: {
        jobId: Jobid,
        limit: 100,
        pages: 0,
      },
    });
  }

  render() {
    const view = jobid => {
      const { dispatch } = this.props;
      dispatch({
        type: 'download/view',
        payload: { jobid },
      }).then(res => {
        const blob = new Blob([res], {
          type: 'application/pdf;chartset=UTF-8',
        });
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      });
    };
    const download = (jobid, jobname) => {
      const { dispatch } = this.props;
      const filename = `${jobname}.docx`;
      dispatch({
        type: 'download/download',
        payload: { jobid },
      }).then(res => {
        // console.log(res);
        const blob = new Blob([res]);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      });
    };

    const columns = [
      {
        title: '编码',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '编排名称',
        dataIndex: 'name',
        key: 'name',
        render: () => <span>{this.props.location.state.scriptName}</span>,
      },
      {
        title: '执行结果',
        dataIndex: 'handleCode',
        key: 'handleCode', // 200成功500失败
        // render: (text, record) => (
        //   <span>
        //     <Badge status={statusMap[record.triggerCode]} text={status[record.triggerCode]} />
        //   </span>
        // ),
        render: (text, record) => {
          const textmaps = new Map([
            [200, '成功'],
            [500, '失败'],
            [0, '报告生成中'],
          ]);
          const statusMap = new Map([
            [200, 'success'],
            [500, 'error'],
            [0, 'processing'],
          ]);
          //const statustext = record.handleCode === 200 ? '成功' : 500 ? '失败':'报告生成中';
          //const statusMap = record.handleCode === 200 ? 'success' : 'error';
          return (
            <span>
              {/* <Badge status={statusMap} text={record.handleCode} /> */}
              <Badge
                status={statusMap.get(record.handleCode)}
                text={textmaps.get(record.handleCode)}
              />
            </span>
          );
        },
      },
      {
        title: '开始时间',
        dataIndex: 'triggerTime',
        key: 'triggerTime',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '结束时间',
        dataIndex: 'handleTime',
        key: 'handleTime',
        render: (text, record) => {
          console.log(record);
          if (record.handleTime === null) {
            return <span>--</span>;
          } else {
            return <span>{moment(record.handleTime).format('YYYY-MM-DD HH:mm:ss')}</span>;
          }
        },
        //render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '启动方式',
        dataIndex: 'startingmode',
        key: 'startingmode',
        render: () => <span>手动</span>,
      },
      //  {
      //   title: '总耗时(s)',
      //   dataIndex: 'taking',
      //   key: 'taking',
      // },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => {
          const { scriptName } = this.props.location.state;
          const downloadtext = record.handleCode === 200 ? '下载报告' : '';
          // const viewtext = record.handleCode === 200 ? '查看报告' : '';
          // const myUrl = `http://172.16.4.211:8800/api-eai-job/oma/download/${record.id}/specify`;
          return (
            // <a
            //   href={myUrl}
            //   target="_blank"
            //   rel="noopener noreferrer"
            // >
            // 下载报告</a>
            <div>
              {/* <a onClick={() => view(record.id)}>{viewtext}</a>
              <Divider type='vertical' /> */}
              <a onClick={() => download(record.id, scriptName)}>{downloadtext}</a>
            </div>
          );
        },
      },
    ];

    const {
      opsscenes: { joblist },
    } = this.props;
    const dataSource = [...joblist];

    //console.log(changedatas(joblist));
    const title = `${this.props.location.state.scenarioName}：脚本执行历史`;
    return (
      <PageHeaderWrapper title={title}>
        <Card>
          <Table dataSource={dataSource} rowKey={record => record.id} columns={columns} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Home;
