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
function NewHandover(props) {
  const pagetitle = props.route.name;
  const {
    dispatch,
    location: { query: { id } },
    tabdata,
    loading,
    currentUserarr,
    shiftGrouparr,
    logbookIddetail
  } = props;

  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  console.log('files: ', files);

  const ContentRef = useRef(null);

  const handleSave = () => { // 保存
    const values = ContentRef.current.getVal();
    ContentRef.current.Forms((err) => {
      if (!err) {
        return dispatch({
          type: 'shifthandover/fetchlogbookSave',
          payload: {
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
      dispatch({
        type: 'shifthandover/fetchlogbookId',
        payload: id
      })
    }
  }, [id])



  useEffect(() => {
    if (currentUserarr.groupId) {
      dispatch({
        type: 'shifthandover/fetchshiftGroup',
        payload: { groupId: currentUserarr.groupId }
      })
    }
  }, [currentUserarr])

  if (shiftGrouparr && shiftGrouparr.length > 0) {
    shift = shiftGrouparr.map(item => {
      return {
        beginTime: item.beginTime,
        endTime: item.endTime,
        groupName: item.groupName,
        groupId: item.groupId,
        shiftName: item.shiftName,
        id: item.id
      }
    })
  }

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
        message.info(res.msg);
      } else {
        message.error(res.msg);
      }
    })
  }

  console.log(11)

  const logbookTransfer = (id) => {
    return dispatch({
      type: 'shifthandover/fetchlogbookTransfer',
      payload: id
    }).then(res => {
      if (res.code === 200) {
        message.info(res.msg);
      } else {
        message.error(res.msg);
      }
    })
  }

  const extrabutton = (
    <>
      <Button
        type="danger"
        ghost
        style={{ marginRight: 8 }}
        onClick={handleDelete}
      >删除</Button >
      <Button
        type="primary"
        style={{ marginRight: 8 }}
        onClick={() => handleSave()}
      >
        导出WORD
      </Button>
      <Button
        type="primary"
        style={{ marginRight: 8 }}
        onClick={() => handleSave()}
      >
        保存
      </Button>
      <Button
        type="primary"
        style={{ marginRight: 8 }}
        onClick={() => logbookTransfer()}
      >
        确认交班
      </Button>
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
              files={logbookIddetail.attachment ? JSON.parse(logbookIddetail.attachment) : []}
              wrappedComponentRef={ContentRef}
              currentUserarr={currentUserarr}
              formrecord={logbookIddetail}
              shiftinfo={shift}
              ChangeFiles={newvalue => {
                setFiles(newvalue);
              }}
            />
          )
        }

      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ shifthandover, loading }) => ({
    currentUserarr: shifthandover.currentUserarr,
    shiftGrouparr: shifthandover.shiftGrouparr,
    logbookIddetail: shifthandover.logbookIddetail,
    loading: loading.models.shifthandover
  }))(NewHandover),
);