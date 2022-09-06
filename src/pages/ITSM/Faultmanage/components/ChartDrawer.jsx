import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { AlertTwoTone } from '@ant-design/icons';
import { Drawer, Button, Table, Tooltip, Popconfirm } from 'antd';

const columns = [
  {
    title: '故障编号',
    dataIndex: 'no',
    key: 'no',
    width: 150,
    fixed: 'left',
    render: (text, record) => {
      const handleClick = () => {
        router.push({
          pathname: `/ITSM/faultmanage/querylist/record`,
          query: {
            id: record.id,
            No: text,
          },
        });
      };
      return <a onClick={() => handleClick(text, record)}>{text}</a>;
    },
  },
  {
    title: '当前处理环节',
    dataIndex: 'flowNodeName',
    key: 'flowNodeName',
    width: 200,
    fixed: 'left',
    onCell: () => {
      return {
        style: {
          maxWidth: 200,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          cursor: 'pointer',
        },
      };
    },
    render: text => (
      <Tooltip
        placement="topLeft"
        title={text}
        getPopupContainer={() => document.querySelector('.ant-drawer-body')}
      >
        {text}
      </Tooltip>
    ),
  },
  {
    title: '超时状态',
    dataIndex: 'timeoutStatus',
    key: 'timeoutStatus',
    width: 150,
    onCell: () => {
      return {
        style: {
          maxWidth: 150,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          cursor: 'pointer',
        },
      };
    },
    render: text => {
      const blubnap = new Map([
        ['未超时', <AlertTwoTone twoToneColor="#52C41A" />],
        ['即将超时', <AlertTwoTone twoToneColor="orange" />],
        ['已超时', <AlertTwoTone twoToneColor="red" />],
      ]);
      const colormap = new Map([
        ['未超时', '#52C41A'],
        ['即将超时', 'orange'],
        ['已超时', 'red'],
      ]);
      return (
        <>
          <span style={{ fontSize: '1.4em', marginRight: 8 }}>{blubnap.get(text)}</span>
          <span style={{ color: colormap.get(text) }}>{text}</span>
        </>
      );
    },
  },
  {
    title: '故障名称',
    dataIndex: 'title',
    key: 'title',
    width: 120,
    onCell: () => {
      return {
        style: {
          maxWidth: 120,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          cursor: 'pointer',
        },
      };
    },
    render: text => (
      <Tooltip
        placement="topLeft"
        title={text}
        getPopupContainer={() => document.querySelector('.ant-drawer-body')}
      >
        {text}
      </Tooltip>
    ),
  },
  {
    title: '故障发生时间',
    dataIndex: 'registerOccurTime',
    key: 'registerOccurTime',
    width: 200,
  },
  {
    title: '故障概要',
    dataIndex: 'content',
    key: 'content',
    width: 150,
    onCell: () => {
      return {
        style: {
          maxWidth: 150,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          cursor: 'pointer',
        },
      };
    },
    render: text => (
      <Tooltip
        placement="topLeft"
        title={text}
        getPopupContainer={() => document.querySelector('.ant-drawer-body')}
      >
        {text}
      </Tooltip>
    ),
  },
  {
    title: '故障详细描述',
    dataIndex: 'handleContent',
    key: 'handleContent',
    width: 150,
    onCell: () => {
      return {
        style: {
          maxWidth: 150,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          cursor: 'pointer',
        },
      };
    },
    render: text => (
      <Tooltip
        placement="topLeft"
        title={text}
        getPopupContainer={() => document.querySelector('.ant-drawer-body')}
      >
        {text}
      </Tooltip>
    ),
  },
  {
    title: '影响范围',
    dataIndex: 'registerScope',
    key: 'registerScope',
    width: 150,
    onCell: () => {
      return {
        style: {
          maxWidth: 150,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          cursor: 'pointer',
        },
      };
    },
    render: text => (
      <Tooltip
        placement="topLeft"
        title={text}
        getPopupContainer={() => document.querySelector('.ant-drawer-body')}
      >
        {text}
      </Tooltip>
    ),
  },
  {
    title: '处理过程',
    dataIndex: 'handleProcess',
    key: 'handleProcess',
    width: 150,
    onCell: () => {
      return {
        style: {
          maxWidth: 150,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          cursor: 'pointer',
        },
      };
    },
    render: text => (
      <Tooltip
        placement="topLeft"
        title={text}
        getPopupContainer={() => document.querySelector('.ant-drawer-body')}
      >
        {text}
      </Tooltip>
    ),
  },
  {
    title: '故障类型',
    dataIndex: 'type',
    key: 'type',
    width: 150,
    onCell: () => {
      return {
        style: {
          maxWidth: 150,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          cursor: 'pointer',
        },
      };
    },
    render: text => (
      <Tooltip
        placement="topLeft"
        title={text}
        getPopupContainer={() => document.querySelector('.ant-drawer-body')}
      >
        {text}
      </Tooltip>
    ),
  },
  {
    title: '故障措施或建议',
    dataIndex: 'handleAdvise',
    key: 'handleAdvise',
    width: 150,
    onCell: () => {
      return {
        style: {
          maxWidth: 150,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          cursor: 'pointer',
        },
      };
    },
    render: text => (
      <Tooltip
        placement="topLeft"
        title={text}
        getPopupContainer={() => document.querySelector('.ant-drawer-body')}
      >
        {text}
      </Tooltip>
    ),
  },
  {
    title: '是否需要提供故障报告',
    dataIndex: 'finishReportSign',
    key: 'finishReportSign',
    width: 200,
  },
  {
    title: '系统运维商确认总结人',
    dataIndex: 'finishUser',
    key: 'finishUser',
    width: 200,
  },
  {
    title: '是否已提交故障处理记录表',
    dataIndex: 'handleReport',
    key: 'handleReport',
    width: 250,
  },
  {
    title: '系统运维商处理人',
    dataIndex: 'handler',
    key: 'handler',
    width: 150,
  },
  {
    title: '责任单位',
    dataIndex: 'confirmBlame',
    key: 'confirmBlame',
    width: 150,
    onCell: () => {
      return {
        style: {
          maxWidth: 150,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          cursor: 'pointer',
        },
      };
    },
    render: text => (
      <Tooltip
        placement="topLeft"
        title={text}
        getPopupContainer={() => document.querySelector('.ant-drawer-body')}
      >
        {text}
      </Tooltip>
    ),
  },
  {
    title: '系统运维商处理结果',
    dataIndex: 'handleResult',
    key: 'handleResult',
    width: 180,
  },
  {
    title: '故障报告要求上传时间',
    dataIndex: 'finishRequiredTime',
    key: 'finishRequiredTime',
    width: 200,
  },
];

function ChartDrawer(props) {
  const { visible, ChangeVisible, drawerdata, dispatch, faultQueryList, loading } = props;

  const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });
  const [selectedKeys, setSelectedKeys] = useState([]);
  // const [downVal, setDownVal] = useState({ blame: '', status: '', registerModel: '', timeoutStatus: '', registerUser: '', handler: '', registerUnit: '', handleUnit: '', })

  const rowSelection = {
    onChange: index => {
      setSelectedKeys([...index]);
    },
  };

  const searchdata = (value, page, size) => {
    const pointdate = value.date && Array.from(value.date).length === 2;
    switch (value.staticName) {
      // *******Card卡片(故障工单情况/系统故障率、可用率/故障数量统计情况)
      // 1.故障工单情况（故障工单(故障总数)，已处理，未处理，完成率(不做攥取)）
      case '故障总数':
        dispatch({
          type: 'fault/getfaultQueryList',
          payload: {
            pageNum: page,
            pageSize: size,
            addTimeBegin: value.time1,
            addTimeEnd: value.time2,
          },
        });
        break;
      case '已处理':
        dispatch({
          type: 'fault/getfaultQueryList',
          payload: {
            pageNum: page,
            pageSize: size,
            status: '255',
            addTimeBegin: value.time1,
            addTimeEnd: value.time2,
          },
        });
        break;
      case '未处理':
        dispatch({
          type: 'fault/getfaultQueryList',
          payload: {
            pageNum: page,
            pageSize: size,
            status: '未关闭',
            addTimeBegin: value.time1,
            addTimeEnd: value.time2,
          },
        });
        break;
      // 2.系统故障率、可用率(不做攥取)
      // 3.故障数量统计情况(故障总数(同故障工单的总数)，主站故障，非主站故障)
      case '主站故障':
        dispatch({
          type: 'fault/getfaultQueryList',
          payload: {
            pageNum: page,
            pageSize: size,
            master: '是',
            addTimeBegin: value.time1,
            addTimeEnd: value.time2,
          },
        });
        break;
      case '非主站故障':
        dispatch({
          type: 'fault/getfaultQueryList',
          payload: {
            pageNum: page,
            pageSize: size,
            master: '否',
            addTimeBegin: value.time1,
            addTimeEnd: value.time2,
          },
        });
        break;
      // *******饼+线(故障责任单位情况)
      case '故障责任单位情况':
        if (value.timeType === 'Y') {
          dispatch({
            type: 'fault/getfaultQueryList',
            payload: {
              pageNum: page,
              pageSize: size,
              blame: value.type || value.name,
              addTimeBegin: moment(value.date).format('YYYY-MM-DD 00:00:00'),
              addTimeEnd: moment(value.date)
                .endOf('month')
                .format('YYYY-MM-DD 23:59:59'),
            },
          });
        } else {
          dispatch({
            type: 'fault/getfaultQueryList',
            payload: {
              pageNum: page,
              pageSize: size,
              blame: value.type || value.name,
              addTimeBegin:
                pointdate === true
                  ? moment(value.beginTime).format(`YYYY-MM-DD ${value.date}:00:00`)
                  : value.startdate || moment(value.date).format('YYYY-MM-DD 00:00:00'),
              addTimeEnd:
                pointdate === true
                  ? moment(value.endTime).format(`YYYY-MM-DD ${value.date}:59:59`)
                  : value.enddate || moment(value.date).format('YYYY-MM-DD 23:59:59'),
            },
          });
        }
        break;
      // *******(饼+线)*3个(故障类型统计分析-[故障类型总情况+故障类型趋势分析]，[硬件故障情况+硬件故障趋势分析]，[软件故障情况+软件故障趋势分析])
      case '故障类型总情况':
        if (value.name === '总数') {
          // 线图
          dispatch({
            type: 'fault/getfaultQueryList',
            payload: {
              pageNum: page,
              pageSize: size,
              type: '件',
              addTimeBegin:
                pointdate === true
                  ? moment(value.beginTime).format(`YYYY-MM-DD ${value.date}:00:00`)
                  : value.startdate || moment(value.date).format('YYYY-MM-DD 00:00:00'),
              addTimeEnd:
                pointdate === true
                  ? moment(value.endTime).format(`YYYY-MM-DD ${value.date}:59:59`)
                  : value.enddate ||
                  (value.timeType === 'Y'
                    ? moment(value.date)
                      .endOf('month')
                      .format('YYYY-MM-DD 23:59:59')
                    : moment(value.date).format('YYYY-MM-DD 23:59:59')),
            },
          });
        } else if (value.name === '非主站故障') {
          // 曲线
          dispatch({
            type: 'fault/getfaultQueryList',
            payload: {
              pageNum: page,
              pageSize: size,
              master: '否',
              addTimeBegin:
                pointdate === true
                  ? moment(value.beginTime).format(`YYYY-MM-DD ${value.date}:00:00`)
                  : value.startdate || moment(value.date).format('YYYY-MM-DD 00:00:00'),
              addTimeEnd:
                pointdate === true
                  ? moment(value.endTime).format(`YYYY-MM-DD ${value.date}:59:59`)
                  : value.enddate ||
                  (value.timeType === 'Y'
                    ? moment(value.date)
                      .endOf('month')
                      .format('YYYY-MM-DD 23:59:59')
                    : moment(value.date).format('YYYY-MM-DD 23:59:59')),
            },
          });
        } else if (value.name === 'XX主站故障') {
          // 曲线
          dispatch({
            type: 'fault/getfaultQueryList',
            payload: {
              pageNum: page,
              pageSize: size,
              master: '是',
              addTimeBegin:
                pointdate === true
                  ? moment(value.beginTime).format(`YYYY-MM-DD ${value.date}:00:00`)
                  : value.startdate || moment(value.date).format('YYYY-MM-DD 00:00:00'),
              addTimeEnd:
                pointdate === true
                  ? moment(value.endTime).format(`YYYY-MM-DD ${value.date}:59:59`)
                  : value.enddate ||
                  (value.timeType === 'Y'
                    ? moment(value.date)
                      .endOf('month')
                      .format('YYYY-MM-DD 23:59:59')
                    : moment(value.date).format('YYYY-MM-DD 23:59:59')),
            },
          });
        } else {
          dispatch({
            type: 'fault/getfaultQueryList',
            payload: {
              pageNum: page,
              pageSize: size,
              type: value.type || value.name,
              addTimeBegin:
                pointdate === true
                  ? moment(value.beginTime).format(`YYYY-MM-DD ${value.date}:00:00`)
                  : value.startdate || moment(value.date).format('YYYY-MM-DD 00:00:00'),
              addTimeEnd:
                pointdate === true
                  ? moment(value.endTime).format(`YYYY-MM-DD ${value.date}:59:59`)
                  : value.enddate ||
                  (value.timeType === 'Y'
                    ? moment(value.date)
                      .endOf('month')
                      .format('YYYY-MM-DD 23:59:59')
                    : moment(value.date).format('YYYY-MM-DD 23:59:59')),
            },
          });
        }
        break;
      case '硬件故障情况':
        if (value.name === '总数') {
          // 曲线
          dispatch({
            type: 'fault/getfaultQueryList',
            payload: {
              pageNum: page,
              pageSize: size,
              type: '硬件',
              addTimeBegin:
                pointdate === true
                  ? moment(value.beginTime).format(`YYYY-MM-DD ${value.date}:00:00`)
                  : value.startdate || moment(value.date).format('YYYY-MM-DD 00:00:00'),
              addTimeEnd:
                pointdate === true
                  ? moment(value.endTime).format(`YYYY-MM-DD ${value.date}:59:59`)
                  : value.enddate ||
                  (value.timeType === 'Y'
                    ? moment(value.date)
                      .endOf('month')
                      .format('YYYY-MM-DD 23:59:59')
                    : moment(value.date).format('YYYY-MM-DD 23:59:59')),
            },
          });
        } else {
          dispatch({
            type: 'fault/getfaultQueryList',
            payload: {
              pageNum: page,
              pageSize: size,
              type: value.type || value.name,
              addTimeBegin:
                pointdate === true
                  ? moment(value.beginTime).format(`YYYY-MM-DD ${value.date}:00:00`)
                  : value.startdate || moment(value.date).format('YYYY-MM-DD 00:00:00'),
              addTimeEnd:
                pointdate === true
                  ? moment(value.endTime).format(`YYYY-MM-DD ${value.date}:59:59`)
                  : value.enddate ||
                  (value.timeType === 'Y'
                    ? moment(value.date)
                      .endOf('month')
                      .format('YYYY-MM-DD 23:59:59')
                    : moment(value.date).format('YYYY-MM-DD 23:59:59')),
            },
          });
        }
        break;
      case '软件故障情况':
        if (value.name === '总数') {
          // 曲线
          dispatch({
            type: 'fault/getfaultQueryList',
            payload: {
              pageNum: page,
              pageSize: size,
              type: '软件',
              addTimeBegin:
                pointdate === true
                  ? moment(value.beginTime).format(`YYYY-MM-DD ${value.date}:00:00`)
                  : value.startdate || moment(value.date).format('YYYY-MM-DD 00:00:00'),
              addTimeEnd:
                pointdate === true
                  ? moment(value.endTime).format(`YYYY-MM-DD ${value.date}:59:59`)
                  : value.enddate ||
                  (value.timeType === 'Y'
                    ? moment(value.date)
                      .endOf('month')
                      .format('YYYY-MM-DD 23:59:59')
                    : moment(value.date).format('YYYY-MM-DD 23:59:59')),
            },
          });
        } else {
          dispatch({
            type: 'fault/getfaultQueryList',
            payload: {
              pageNum: page,
              pageSize: size,
              type: value.type || value.name,
              addTimeBegin:
                pointdate === true
                  ? moment(value.beginTime).format(`YYYY-MM-DD ${value.date}:00:00`)
                  : value.startdate || moment(value.date).format('YYYY-MM-DD 00:00:00'),
              addTimeEnd:
                pointdate === true
                  ? moment(value.endTime).format(`YYYY-MM-DD ${value.date}:59:59`)
                  : value.enddate ||
                  (value.timeType === 'Y'
                    ? moment(value.date)
                      .endOf('month')
                      .format('YYYY-MM-DD 23:59:59')
                    : moment(value.date).format('YYYY-MM-DD 23:59:59')),
            },
          });
        }
        break;
      // *******饼+线(故障系统模块情况)
      case '故障系统模块情况':
        dispatch({
          type: 'fault/getfaultQueryList',
          payload: {
            pageNum: page,
            pageSize: size,
            registerModel: value.type || value.name,
            addTimeBegin:
              pointdate === true
                ? moment(value.beginTime).format(`YYYY-MM-DD ${value.date}:00:00`)
                : value.startdate || moment(value.date).format('YYYY-MM-DD 00:00:00'),
            addTimeEnd:
              pointdate === true
                ? moment(value.endTime).format(`YYYY-MM-DD ${value.date}:59:59`)
                : value.enddate ||
                (value.timeType === 'Y'
                  ? moment(value.date)
                    .endOf('month')
                    .format('YYYY-MM-DD 23:59:59')
                  : moment(value.date).format('YYYY-MM-DD 23:59:59')),
          },
        });
        break;
      // *******饼(故障工单处理及时率)
      case '故障工单超时情况':
        dispatch({
          type: 'fault/getfaultQueryList',
          payload: {
            pageNum: page,
            pageSize: size,
            addTimeBegin: value.startdate,
            addTimeEnd: value.enddate,
            timeoutStatus: value.type,
          },
        });
        break;
      // *******柱(故障登记人Top5)
      case '故障登记人':
        dispatch({
          type: 'fault/getfaultQueryList',
          payload: {
            pageNum: page,
            pageSize: size,
            registerUser: `${value.type}?`,
            addTimeBegin: value.startdate,
            addTimeEnd: value.enddate,
          },
        });
        break;
      // *******柱(故障处理人Top5)
      case '故障处理人':
        dispatch({
          type: 'fault/getfaultQueryList',
          payload: {
            pageNum: page,
            pageSize: size,
            handler: `${value.type}?`,
            addTimeBegin: value.startdate,
            addTimeEnd: value.enddate,
          },
        });
        break;
      // *******饼图(提交故障报告情况)
      case '提交故障报告情况':
        dispatch({
          type: 'fault/getfaultQueryList',
          payload: {
            pageNum: page,
            pageSize: size,
            addTimeBegin: value.startdate,
            addTimeEnd: value.enddate,
            finishReportSign: value.type,
          },
        });
        break;
      // 饼图中心点击总数(all)
      case 'blametotal':
        dispatch({
          type: 'fault/getfaultQueryList',
          payload: {
            pageNum: page,
            pageSize: size,
            addTimeBegin: value.time1,
            addTimeEnd: value.time2,
            blame: '总数',
          },
        });
        break;
      case 'typetotal':
        dispatch({
          type: 'fault/getfaultQueryList',
          payload: {
            pageNum: page,
            pageSize: size,
            addTimeBegin: value.time1,
            addTimeEnd: value.time2,
            type: '件',
          },
        });
        break;
      case 'hardwaretotal':
        dispatch({
          type: 'fault/getfaultQueryList',
          payload: {
            pageNum: page,
            pageSize: size,
            addTimeBegin: value.time1,
            addTimeEnd: value.time2,
            type: '硬件',
          },
        });
        break;
      case 'softwaretotal':
        dispatch({
          type: 'fault/getfaultQueryList',
          payload: {
            pageNum: page,
            pageSize: size,
            addTimeBegin: value.time1,
            addTimeEnd: value.time2,
            type: '软件',
          },
        });
        break;
      case 'worksystemtotal':
        dispatch({
          type: 'fault/getfaultQueryList',
          payload: {
            pageNum: page,
            pageSize: size,
            addTimeBegin: value.time1,
            addTimeEnd: value.time2,
            registerModel: '总数',
          },
        });
        break;
      case 'timeouttotal':
        dispatch({
          type: 'fault/getfaultQueryList',
          payload: {
            pageNum: page,
            pageSize: size,
            addTimeBegin: value.time1,
            addTimeEnd: value.time2,
            timeoutStatus: '总数',
          },
        });
        break;
      case 'reporttotal':
        dispatch({
          type: 'fault/getfaultQueryList',
          payload: {
            pageNum: page,
            pageSize: size,
            addTimeBegin: value.time1,
            addTimeEnd: value.time2,
            finishReportSign: '总数',
          },
        });
        break;
      default:
        break;
    }
  };

  // 获取数据
  useEffect(() => {
    if (drawerdata) {
      searchdata(drawerdata, paginations.current, paginations.pageSize);
    }
  }, [drawerdata]);

  const onShowSizeChange = (page, size) => {
    searchdata(drawerdata, 1, size);
    setPageinations({
      ...paginations,
      current: 1,
      pageSize: size,
    });
  };

  const changePage = page => {
    searchdata(drawerdata, page, paginations.pageSize);
    setPageinations({
      ...paginations,
      current: page,
    });
  };

  const pagination = {
    showSizeChanger: true,
    onShowSizeChange: (page, size) => onShowSizeChange(page, size),
    current: paginations.current,
    pageSize: paginations.pageSize,
    total: faultQueryList.total,
    showTotal: total => `总共  ${total}  条记录`,
    onChange: page => changePage(page),
  };

  // 取消
  const hanldleCancel = () => {
    ChangeVisible(false);
    setPageinations({
      ...paginations,
      current: 1,
      pageSize: 15,
    });
  };

  //  下载 /导出功能
  const download = value => {
    const exportColumns = columns.map(item => {
      return {
        column: item.dataIndex,
        field: item.title,
      };
    });
    const pointdate = value.date && Array.from(value.date).length === 2;
    switch (value.staticName) {
      // *******Card卡片(故障工单情况/系统故障率、可用率/故障数量统计情况)
      // 1.故障工单情况（故障工单(故障总数)，已处理，未处理，完成率(不做攥取)）
      case '故障总数':
        dispatch({
          type: 'fault/faultQuerydownload',
          payload: {
            columns: JSON.stringify(exportColumns),
            ids: selectedKeys.toString(),
            addTimeBegin: value.time1,
            addTimeEnd: value.time2,
          },
        }).then(res => {
          const filename = `故障查询_${moment().format('YYYY-MM-DD HH:mm')}.xlsx`;
          const blob = new Blob([res]);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        });
        break;
      case '已处理':
        dispatch({
          type: 'fault/faultQuerydownload',
          payload: {
            columns: JSON.stringify(exportColumns),
            ids: selectedKeys.toString(),
            status: '255',
            addTimeBegin: value.time1,
            addTimeEnd: value.time2,
          },
        }).then(res => {
          const filename = `故障查询_${moment().format('YYYY-MM-DD HH:mm')}.xlsx`;
          const blob = new Blob([res]);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        });
        // setDownVal({ ...downVal, status: '255' });
        break;
      case '未处理':
        dispatch({
          type: 'fault/faultQuerydownload',
          payload: {
            columns: JSON.stringify(exportColumns),
            ids: selectedKeys.toString(),
            status: '未关闭',
            addTimeBegin: value.time1,
            addTimeEnd: value.time2,
          },
        }).then(res => {
          const filename = `故障查询_${moment().format('YYYY-MM-DD HH:mm')}.xlsx`;
          const blob = new Blob([res]);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        });
        break;
      // 2.系统故障率、可用率(不做攥取)
      // 3.故障数量统计情况(故障总数(同故障工单的总数)，主站故障，非主站故障)
      case '主站故障':
        dispatch({
          type: 'fault/faultQuerydownload',
          payload: {
            columns: JSON.stringify(exportColumns),
            ids: selectedKeys.toString(),
            master: '是',
            addTimeBegin: value.time1,
            addTimeEnd: value.time2,
          },
        }).then(res => {
          const filename = `故障查询_${moment().format('YYYY-MM-DD HH:mm')}.xlsx`;
          const blob = new Blob([res]);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        });
        break;
      case '非主站故障':
        dispatch({
          type: 'fault/faultQuerydownload',
          payload: {
            columns: JSON.stringify(exportColumns),
            ids: selectedKeys.toString(),
            master: '否',
            addTimeBegin: value.time1,
            addTimeEnd: value.time2,
          },
        }).then(res => {
          const filename = `故障查询_${moment().format('YYYY-MM-DD HH:mm')}.xlsx`;
          const blob = new Blob([res]);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        });
        break;
      // *******饼+线(故障责任单位情况)
      case '故障责任单位情况':
        dispatch({
          type: 'fault/faultQuerydownload',
          payload: {
            columns: JSON.stringify(exportColumns),
            ids: selectedKeys.toString(),
            blame: value.type || value.name,
            addTimeBegin:
              pointdate === true
                ? moment(value.beginTime).format(`YYYY-MM-DD ${value.date}:00:00`)
                : value.startdate || moment(value.date).format('YYYY-MM-DD 00:00:00'),
            addTimeEnd:
              pointdate === true
                ? moment(value.endTime).format(`YYYY-MM-DD ${value.date}:59:59`)
                : value.enddate ||
                (value.timeType === 'Y'
                  ? moment(value.date)
                    .endOf('month')
                    .format('YYYY-MM-DD 23:59:59')
                  : moment(value.date).format('YYYY-MM-DD 23:59:59')),
          },
        }).then(res => {
          const filename = `故障查询_${moment().format('YYYY-MM-DD HH:mm')}.xlsx`;
          const blob = new Blob([res]);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        });
        break;
      // *******(饼+线)*3个(故障类型统计分析-[故障类型总情况+故障类型趋势分析]，[硬件故障情况+硬件故障趋势分析]，[软件故障情况+软件故障趋势分析])
      case '故障类型总情况':
        if (value.name === '总数') {
          // 线图
          dispatch({
            type: 'fault/faultQuerydownload',
            payload: {
              columns: JSON.stringify(exportColumns),
              ids: selectedKeys.toString(),
              type: '件',
              addTimeBegin:
                pointdate === true
                  ? moment(value.beginTime).format(`YYYY-MM-DD ${value.date}:00:00`)
                  : value.startdate || moment(value.date).format('YYYY-MM-DD 00:00:00'),
              addTimeEnd:
                pointdate === true
                  ? moment(value.endTime).format(`YYYY-MM-DD ${value.date}:59:59`)
                  : value.enddate ||
                  (value.timeType === 'Y'
                    ? moment(value.date)
                      .endOf('month')
                      .format('YYYY-MM-DD 23:59:59')
                    : moment(value.date).format('YYYY-MM-DD 23:59:59')),
            },
          }).then(res => {
            const filename = `故障查询_${moment().format('YYYY-MM-DD HH:mm')}.xlsx`;
            const blob = new Blob([res]);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
          });
        } else if (value.name === '非主站故障') {
          // 曲线
          dispatch({
            type: 'fault/faultQuerydownload',
            payload: {
              columns: JSON.stringify(exportColumns),
              ids: selectedKeys.toString(),
              master: '否',
              addTimeBegin:
                pointdate === true
                  ? moment(value.beginTime).format(`YYYY-MM-DD ${value.date}:00:00`)
                  : value.startdate || moment(value.date).format('YYYY-MM-DD 00:00:00'),
              addTimeEnd:
                pointdate === true
                  ? moment(value.endTime).format(`YYYY-MM-DD ${value.date}:59:59`)
                  : value.enddate ||
                  (value.timeType === 'Y'
                    ? moment(value.date)
                      .endOf('month')
                      .format('YYYY-MM-DD 23:59:59')
                    : moment(value.date).format('YYYY-MM-DD 23:59:59')),
            },
          }).then(res => {
            const filename = `故障查询_${moment().format('YYYY-MM-DD HH:mm')}.xlsx`;
            const blob = new Blob([res]);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
          });
        } else if (value.name === 'XX主站故障') {
          // 曲线
          dispatch({
            type: 'fault/faultQuerydownload',
            payload: {
              columns: JSON.stringify(exportColumns),
              ids: selectedKeys.toString(),
              master: '是',
              addTimeBegin:
                pointdate === true
                  ? moment(value.beginTime).format(`YYYY-MM-DD ${value.date}:00:00`)
                  : value.startdate || moment(value.date).format('YYYY-MM-DD 00:00:00'),
              addTimeEnd:
                pointdate === true
                  ? moment(value.endTime).format(`YYYY-MM-DD ${value.date}:59:59`)
                  : value.enddate ||
                  (value.timeType === 'Y'
                    ? moment(value.date)
                      .endOf('month')
                      .format('YYYY-MM-DD 23:59:59')
                    : moment(value.date).format('YYYY-MM-DD 23:59:59')),
            },
          }).then(res => {
            const filename = `故障查询_${moment().format('YYYY-MM-DD HH:mm')}.xlsx`;
            const blob = new Blob([res]);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
          });
        } else {
          dispatch({
            type: 'fault/faultQuerydownload',
            payload: {
              columns: JSON.stringify(exportColumns),
              ids: selectedKeys.toString(),
              type: value.type || value.name,
              addTimeBegin:
                pointdate === true
                  ? moment(value.beginTime).format(`YYYY-MM-DD ${value.date}:00:00`)
                  : value.startdate || moment(value.date).format('YYYY-MM-DD 00:00:00'),
              addTimeEnd:
                pointdate === true
                  ? moment(value.endTime).format(`YYYY-MM-DD ${value.date}:59:59`)
                  : value.enddate ||
                  (value.timeType === 'Y'
                    ? moment(value.date)
                      .endOf('month')
                      .format('YYYY-MM-DD 23:59:59')
                    : moment(value.date).format('YYYY-MM-DD 23:59:59')),
            },
          }).then(res => {
            const filename = `故障查询_${moment().format('YYYY-MM-DD HH:mm')}.xlsx`;
            const blob = new Blob([res]);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
          });
        }
        break;
      case '硬件故障情况':
        if (value.name === '总数') {
          // 曲线
          dispatch({
            type: 'fault/faultQuerydownload',
            payload: {
              columns: JSON.stringify(exportColumns),
              ids: selectedKeys.toString(),
              type: '硬件',
              addTimeBegin:
                pointdate === true
                  ? moment(value.beginTime).format(`YYYY-MM-DD ${value.date}:00:00`)
                  : value.startdate || moment(value.date).format('YYYY-MM-DD 00:00:00'),
              addTimeEnd:
                pointdate === true
                  ? moment(value.endTime).format(`YYYY-MM-DD ${value.date}:59:59`)
                  : value.enddate ||
                  (value.timeType === 'Y'
                    ? moment(value.date)
                      .endOf('month')
                      .format('YYYY-MM-DD 23:59:59')
                    : moment(value.date).format('YYYY-MM-DD 23:59:59')),
            },
          }).then(res => {
            const filename = `故障查询_${moment().format('YYYY-MM-DD HH:mm')}.xlsx`;
            const blob = new Blob([res]);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
          });
        } else {
          dispatch({
            type: 'fault/faultQuerydownload',
            payload: {
              columns: JSON.stringify(exportColumns),
              ids: selectedKeys.toString(),
              type: value.type || value.name,
              addTimeBegin:
                pointdate === true
                  ? moment(value.beginTime).format(`YYYY-MM-DD ${value.date}:00:00`)
                  : value.startdate || moment(value.date).format('YYYY-MM-DD 00:00:00'),
              addTimeEnd:
                pointdate === true
                  ? moment(value.endTime).format(`YYYY-MM-DD ${value.date}:59:59`)
                  : value.enddate ||
                  (value.timeType === 'Y'
                    ? moment(value.date)
                      .endOf('month')
                      .format('YYYY-MM-DD 23:59:59')
                    : moment(value.date).format('YYYY-MM-DD 23:59:59')),
            },
          }).then(res => {
            const filename = `故障查询_${moment().format('YYYY-MM-DD HH:mm')}.xlsx`;
            const blob = new Blob([res]);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
          });
        }
        break;
      case '软件故障情况':
        if (value.name === '总数') {
          // 曲线
          dispatch({
            type: 'fault/faultQuerydownload',
            payload: {
              columns: JSON.stringify(exportColumns),
              ids: selectedKeys.toString(),
              type: '软件',
              addTimeBegin:
                pointdate === true
                  ? moment(value.beginTime).format(`YYYY-MM-DD ${value.date}:00:00`)
                  : value.startdate || moment(value.date).format('YYYY-MM-DD 00:00:00'),
              addTimeEnd:
                pointdate === true
                  ? moment(value.endTime).format(`YYYY-MM-DD ${value.date}:59:59`)
                  : value.enddate ||
                  (value.timeType === 'Y'
                    ? moment(value.date)
                      .endOf('month')
                      .format('YYYY-MM-DD 23:59:59')
                    : moment(value.date).format('YYYY-MM-DD 23:59:59')),
            },
          }).then(res => {
            const filename = `故障查询_${moment().format('YYYY-MM-DD HH:mm')}.xlsx`;
            const blob = new Blob([res]);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
          });
        } else {
          dispatch({
            type: 'fault/faultQuerydownload',
            payload: {
              columns: JSON.stringify(exportColumns),
              ids: selectedKeys.toString(),
              type: value.type || value.name,
              addTimeBegin:
                pointdate === true
                  ? moment(value.beginTime).format(`YYYY-MM-DD ${value.date}:00:00`)
                  : value.startdate || moment(value.date).format('YYYY-MM-DD 00:00:00'),
              addTimeEnd:
                pointdate === true
                  ? moment(value.endTime).format(`YYYY-MM-DD ${value.date}:59:59`)
                  : value.enddate ||
                  (value.timeType === 'Y'
                    ? moment(value.date)
                      .endOf('month')
                      .format('YYYY-MM-DD 23:59:59')
                    : moment(value.date).format('YYYY-MM-DD 23:59:59')),
            },
          }).then(res => {
            const filename = `故障查询_${moment().format('YYYY-MM-DD HH:mm')}.xlsx`;
            const blob = new Blob([res]);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
          });
          // setDownVal({ ...downVal, type: value.type || value.name });
        }
        break;
      // *******饼+线(故障系统模块情况)
      case '故障系统模块情况':
        dispatch({
          type: 'fault/faultQuerydownload',
          payload: {
            columns: JSON.stringify(exportColumns),
            ids: selectedKeys.toString(),
            registerModel: value.type || value.name,
            addTimeBegin:
              pointdate === true
                ? moment(value.beginTime).format(`YYYY-MM-DD ${value.date}:00:00`)
                : value.startdate || moment(value.date).format('YYYY-MM-DD 00:00:00'),
            addTimeEnd:
              pointdate === true
                ? moment(value.endTime).format(`YYYY-MM-DD ${value.date}:59:59`)
                : value.enddate ||
                (value.timeType === 'Y'
                  ? moment(value.date)
                    .endOf('month')
                    .format('YYYY-MM-DD 23:59:59')
                  : moment(value.date).format('YYYY-MM-DD 23:59:59')),
          },
        }).then(res => {
          const filename = `故障查询_${moment().format('YYYY-MM-DD HH:mm')}.xlsx`;
          const blob = new Blob([res]);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        });
        // setDownVal({ ...downVal, registerModel: value.type || value.name });
        break;
      // *******饼(故障工单处理及时率)
      case '故障工单超时情况':
        dispatch({
          type: 'fault/faultQuerydownload',
          payload: {
            columns: JSON.stringify(exportColumns),
            ids: selectedKeys.toString(),
            timeoutStatus: value.type,
            addTimeBegin: value.startdate,
            addTimeEnd: value.enddate,
          },
        }).then(res => {
          const filename = `故障查询_${moment().format('YYYY-MM-DD HH:mm')}.xlsx`;
          const blob = new Blob([res]);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        });
        // setDownVal({ ...downVal, timeoutStatus: value.type });
        break;
      // *******柱(故障登记人Top5)
      case '故障登记人':
        dispatch({
          type: 'fault/faultQuerydownload',
          payload: {
            columns: JSON.stringify(exportColumns),
            ids: selectedKeys.toString(),
            registerUser: value.type,
            addTimeBegin: value.startdate,
            addTimeEnd: value.enddate,
          },
        }).then(res => {
          const filename = `故障查询_${moment().format('YYYY-MM-DD HH:mm')}.xlsx`;
          const blob = new Blob([res]);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        });
        // setDownVal({ ...downVal, registerUser: value.type });
        break;
      // *******柱(故障处理人Top5)
      case '故障处理人':
        dispatch({
          type: 'fault/faultQuerydownload',
          payload: {
            columns: JSON.stringify(exportColumns),
            ids: selectedKeys.toString(),
            handler: value.type,
            addTimeBegin: value.startdate,
            addTimeEnd: value.enddate,
          },
        }).then(res => {
          const filename = `故障查询_${moment().format('YYYY-MM-DD HH:mm')}.xlsx`;
          const blob = new Blob([res]);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        });
        // setDownVal({ ...downVal, handler: value.type });
        break;
      // *******饼图(提交故障报告情况)
      case '提交故障报告情况':
        dispatch({
          type: 'fault/faultQuerydownload',
          payload: {
            columns: JSON.stringify(exportColumns),
            ids: selectedKeys.toString(),
            finishReportSign: value.type,
            addTimeBegin: value.startdate,
            addTimeEnd: value.enddate,
          },
        }).then(res => {
          const filename = `故障查询_${moment().format('YYYY-MM-DD HH:mm')}.xlsx`;
          const blob = new Blob([res]);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        });
        break;
      // 饼图中心点击总数(all)
      case 'blametotal':
        dispatch({
          type: 'fault/faultQuerydownload',
          payload: {
            columns: JSON.stringify(exportColumns),
            ids: selectedKeys.toString(),
            blame: '总数',
            addTimeBegin: value.time1,
            addTimeEnd: value.time2,
          },
        }).then(res => {
          const filename = `故障查询_${moment().format('YYYY-MM-DD HH:mm')}.xlsx`;
          const blob = new Blob([res]);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        });
        break;
      case 'typetotal':
        dispatch({
          type: 'fault/faultQuerydownload',
          payload: {
            columns: JSON.stringify(exportColumns),
            ids: selectedKeys.toString(),
            type: '件',
            addTimeBegin: value.time1,
            addTimeEnd: value.time2,
          },
        }).then(res => {
          const filename = `故障查询_${moment().format('YYYY-MM-DD HH:mm')}.xlsx`;
          const blob = new Blob([res]);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        });
        break;
      case 'hardwaretotal':
        dispatch({
          type: 'fault/faultQuerydownload',
          payload: {
            columns: JSON.stringify(exportColumns),
            ids: selectedKeys.toString(),
            type: '硬件',
            addTimeBegin: value.time1,
            addTimeEnd: value.time2,
          },
        }).then(res => {
          const filename = `故障查询_${moment().format('YYYY-MM-DD HH:mm')}.xlsx`;
          const blob = new Blob([res]);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        });
        break;
      case 'softwaretotal':
        dispatch({
          type: 'fault/faultQuerydownload',
          payload: {
            columns: JSON.stringify(exportColumns),
            ids: selectedKeys.toString(),
            type: '软件',
            addTimeBegin: value.time1,
            addTimeEnd: value.time2,
          },
        }).then(res => {
          const filename = `故障查询_${moment().format('YYYY-MM-DD HH:mm')}.xlsx`;
          const blob = new Blob([res]);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        });
        break;
      case 'worksystemtotal':
        dispatch({
          type: 'fault/faultQuerydownload',
          payload: {
            columns: JSON.stringify(exportColumns),
            ids: selectedKeys.toString(),
            registerModel: '总数',
            addTimeBegin: value.time1,
            addTimeEnd: value.time2,
          },
        }).then(res => {
          const filename = `故障查询_${moment().format('YYYY-MM-DD HH:mm')}.xlsx`;
          const blob = new Blob([res]);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        });
        break;
      case 'timeouttotal':
        dispatch({
          type: 'fault/faultQuerydownload',
          payload: {
            columns: JSON.stringify(exportColumns),
            ids: selectedKeys.toString(),
            timeoutStatus: '总数',
            addTimeBegin: value.time1,
            addTimeEnd: value.time2,
          },
        }).then(res => {
          const filename = `故障查询_${moment().format('YYYY-MM-DD HH:mm')}.xlsx`;
          const blob = new Blob([res]);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        });
        break;
      case 'reporttotal':
        dispatch({
          type: 'fault/faultQuerydownload',
          payload: {
            columns: JSON.stringify(exportColumns),
            ids: selectedKeys.toString(),
            finishReportSign: '总数',
            addTimeBegin: value.time1,
            addTimeEnd: value.time2,
          },
        }).then(res => {
          const filename = `故障查询_${moment().format('YYYY-MM-DD HH:mm')}.xlsx`;
          const blob = new Blob([res]);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        });
        break;
      default:
        break;
    }
  };

  const setTableHeight = () => {
    let height = 500;
    const clientHeight = window.document?.body?.clientHeight || 500;
    height = clientHeight - 400;
    return height;
  };

  return (
    <>
      <Drawer
        visible={visible}
        width={1500}
        title={drawerdata.drawtitle}
        onClose={hanldleCancel}
        bodyStyle={{ paddingBottom: 60 }}
        destroyOnClose
      >
        <div style={{ marginBottom: 24 }}>
          <Popconfirm title="确定导出数据？" onConfirm={() => download(drawerdata)}>
            <Button type="primary">导出数据</Button>
          </Popconfirm>
        </div>
        <Table
          columns={columns}
          loading={loading}
          dataSource={faultQueryList.rows || []}
          rowKey={record => record.id}
          pagination={pagination}
          rowSelection={rowSelection}
          scroll={{ x: 1300, y: setTableHeight() }}
        />
      </Drawer>
    </>
  );
}

export default connect(({ fault, loading }) => ({
  faultQueryList: fault.faultQueryList,
  loading: loading.models.fault,
}))(ChartDrawer);
