import React, {
  useEffect,
  useRef,
  useState
} from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import {
  Button,
  Card,
  message,
  Form,
} from 'antd';

import { PageHeaderWrapper } from '@ant-design/pro-layout';
import EditContext from '@/layouts/MenuContext';
import Registrat from './components/Registrat';

const forminladeLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 22 },
  },
};


let shift;
let succession;
let shiftName;
function NewHandover(props) {
  const pagetitle = props.route.name;
  const {
    dispatch,
    location: { query: { id,type } },
    tabdata,
    loading,
    currentUserarr,
    shiftGrouparr,
    logbookIddetail,
    shiftSearcharr,
    searchUsersarr
  } = props;

  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表

  const ContentRef = useRef(null);

  const formDetail = () => {
    dispatch({
      type: 'shifthandover/fetchlogbookId',
      payload: id
    })
  }

  const handleSave = () => { // 保存
    const values = ContentRef.current.getVal();
    ContentRef.current.Forms((err) => {
      if (!err) {
        return dispatch({
          type: 'shifthandover/fetchlogbookSave',
          payload: {
            id,
            ...values,
            dutyBeginTime: moment(values.dutyBeginTime).format('YYYY-MM-DD HH:mm:ss'),
            dutyEndTime: moment(values.dutyEndTime).format('YYYY-MM-DD HH:mm:ss'),
            registerTime: moment(values.registerTime).format('YYYY-MM-DD HH:mm:ss'),
            handoverTime: moment(values.handoverTime).format('YYYY-MM-DD HH:mm:ss'),
            receiveTime: moment(values.receiveTime).format('YYYY-MM-DD HH:mm:ss'),
            attachment: files.ischange ? JSON.stringify(files.arr) : ''
          }
        }).then(res => {
          if (res.code === 200) {
            formDetail()
            message.info(res.msg)
          }
        })
      }

    })
  }

  useEffect(() => {
    if (files.ischange) {
      handleSave()
    }
  }, [files])

  const handleclose = () => { // 返回
    router.push({
      pathname: `/ITSM/dutymanage/dutyhandovermanage/mydutyhandover`,
      query: { tabid: sessionStorage.getItem('tabid'), closecurrent: true },
    });
  };



  useEffect(() => {
    dispatch({
      type: 'shifthandover/fetchcurrentUser'
    })

    if (id) {
      formDetail()
    }
  }, [id])



  useEffect(() => {
    if (currentUserarr && currentUserarr.groupId) {
      dispatch({
        type: 'shifthandover/fetchshiftGroup',
        payload: { groupId: currentUserarr.groupId }
      })
    }
  }, [currentUserarr])

  if (shiftGrouparr && (shiftGrouparr.length) > 0) {
    shift = (shiftGrouparr).map(item => {
      return {
        beginTime: item.beginTime,
        endTime: item.endTime,
        groupName: item.groupName,
        groupId: item.groupId,
        shiftName: item.shiftName,
        id: item.id,
      }
    })
  }

  useEffect(() => {
    if (currentUserarr && currentUserarr.groupId) {
      dispatch({
        type: 'dutyandtypesetting/staffSearch',
        payload: {
          groupId: currentUserarr.groupId,
          current: 1,
          size: 1000
        }
      })
    }
  }, [currentUserarr])



  if (searchUsersarr && searchUsersarr.records && (searchUsersarr.records).length > 0) {
    succession = (searchUsersarr.records).map(item => {
      return {
        id: item.id,
        heirName: item.staffName,
        userId:item.userId,
      }
    })
  }

  console.log(searchUsersarr,'searchUsersarr')

  if (shiftSearcharr && shiftSearcharr.records && (shiftSearcharr.records.length) > 0) {
    shiftName = (shiftSearcharr.records).map(item => {
      return {
        shiftName: item.shiftName,
        id: item.id
      }
    })
  }

  console.log(shiftName, 'shiftName')

  // // 重置表单信息
  // useEffect(() => {
  //     if (tabnew) {
  //         ContentRef.current.resetVal();
  //     }
  // }, [tabnew]);

  // // 获取页签信息
  // useEffect(() => {
  //     if (location.state && location.state.cache) {
  //         const values = ContentRef.current.getVal();
  //         dispatch({
  //             type: 'viewcache/gettabstate',
  //             payload: {
  //                 cacheinfo: { ...values },
  //                 tabid: sessionStorage.getItem('tabid')
  //             },
  //         });
  //     }
  // }, [location])
  const handleDelete = () => {
    return dispatch({
      type: 'shifthandover/fetchlogbookDel',
      payload: { id }
    }).then(res => {
      if (res.code === 200) {
        router.push({
          pathname: `/ITSM/dutymanage/dutyhandovermanage/mydutyhandover/handoverdetail`,
          query: {
            mainId: id,
            closetab: true,
          },
        });

        router.push({
          pathname: `/ITSM/dutymanage/dutyhandovermanage/mydutyhandover`,
          query: { pathpush: true },
          state: { cache: false },
        });
      } else {
        message.error(res.msg);
      }
    })
  }

  const logbookTransfer = () => {
    return dispatch({
      type: 'shifthandover/fetchlogbookTransfer',
      payload: { id }
    }).then(res => {
      if (res.code === 200) {
        router.push({
          pathname: `/ITSM/dutymanage/dutyhandovermanage/mydutyhandover/handoverdetail`,
          query: {
            mainId: id,
            closetab: true,
          },
        });

        router.push({
          pathname: `/ITSM/dutymanage/dutyhandovermanage/mydutyhandover`,
          query: { pathpush: true },
          state: { cache: false },
        });
        message.info(res.msg);
      } else {
        message.error(res.msg);
      }
    })
  }

  const download = () => {
    dispatch({
      type: 'performanceappraisal/scorecardPrint',
      payload: {id},
    }).then(res => {
      const filename = '下载.doc';
      const blob = new Blob([res]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };


  const extrabutton = (
    <>
      {
        id && (
          <Button
            type="danger"
            ghost
            style={{ marginRight: 8 }}
            onClick={handleDelete}
          >
            删除
          </Button >
        )
      }

      {
        id && (
          <Button
            type="primary"
            style={{ marginRight: 8 }}
            onClick={() => download()}
          >
            导出WORD
          </Button>
        )
      }


      <Button
        type="primary"
        style={{ marginRight: 8 }}
        onClick={() => handleSave()}
      >
        保存
      </Button>

      {
        id && logbookIddetail.handoverStatus === '待接班'&& (
          <Button
            type="primary"
            style={{ marginRight: 8 }}
            onClick={() => logbookTransfer()}
          >
            确认交班
          </Button>
        )
      }

      <Button onClick={handleclose}>关闭</Button>
    </>
  )

  return (
    <PageHeaderWrapper title={pagetitle} extra={extrabutton}>
      <Card>
        {
          loading === false && (
            <Registrat
              forminladeLayout={forminladeLayout}
              files={(logbookIddetail && logbookIddetail.attachment) ? JSON.parse(logbookIddetail.attachment) : []}
              wrappedComponentRef={ContentRef}
              currentUserarr={currentUserarr}
              formrecord={id ? logbookIddetail : {}}
              shiftinfo={shift}
              successioninfo={succession}
              shiftNameinfo={shiftName}
              ChangeFiles={newvalue => {
                setFiles(newvalue);
              }}
              type={type}
            />
          )
        }

      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ shifthandover, dutyandtypesetting, shiftsandholidays, loading }) => ({
    currentUserarr: shifthandover.currentUserarr,
    searchUsersarr: dutyandtypesetting.searchUsersarr,
    shiftSearcharr: shiftsandholidays.shiftSearcharr,
    shiftGrouparr: shifthandover.shiftGrouparr,
    logbookIddetail: shifthandover.logbookIddetail,
    loading: loading.models.shifthandover
  }))(NewHandover),
);