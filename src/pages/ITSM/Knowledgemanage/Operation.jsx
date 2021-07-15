import React, { useState, useRef, useContext, useEffect } from 'react';
import router from 'umi/router';
import { Collapse, Button } from 'antd';
import styles from '@/utils/utils.less';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import EditContext from '@/layouts/MenuContext';              // 引用上下文管理组件
import Content from './components/Content';
import Examine from './components/Examine';


const { Panel } = Collapse;

function Operation(props) {
  const [activeKey, setActiveKey] = useState(['formpanel']);
  const ContentRef = useRef(null);
  const ExmaineRef = useRef(null);
  const { currenttab } = useContext(EditContext);
  const { state: { menuDesc, title, runpath } } = currenttab;
  console.log(currenttab)
  const callback = key => {
    setActiveKey(key);
  };
  const handleSave = () => {
    const values = ContentRef.current.getVal();
    console.log(values);
    ContentRef.current.Forms((err) => {

    })
  }
  const handleclose = () => {
    if (runpath) {
      router.push({
        pathname: runpath,
        query: { pathpush: true },
        state: { cache: false }
      });
    }
  };
  useEffect(() => {
    if (title && title === '知识审核') {
      setActiveKey(['formpanel', '1'])
    };
    if (title && title === '知识查询') {
      setActiveKey(['1', '2'])
    };
  }, [title])
  const operations = (
    <>
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
        onClick={() => { handleSave() }}
      >
        提交
      </Button>
      <Button onClick={handleclose}>返回</Button>
    </>
  )
  return (
    <PageHeaderWrapper title={title} extra={operations} >
      <div className={styles.ordercollapse}>
        <Collapse
          expandIconPosition="right"
          activeKey={activeKey}
          bordered={false}
          onChange={callback}
        >

          {(title === '我的知识' || title === '知识维护') && (
            <Panel header='知识收录' key="formpanel">
              <EditContext.Provider value={{ editable: true }}>
                <Content
                  wrappedComponentRef={ContentRef}
                  formrecord={{}}
                  isedit
                />
              </EditContext.Provider>
            </Panel>
          )}
          {title === '知识审核' && (
            <Panel header='知识收录' key="formpanel">
              <Examine
                wrappedComponentRef={ExmaineRef}
                formrecord={{}}
              />
            </Panel>
          )}
          {(title === '知识审核' || title === '知识查询') && (
            <Panel header='知识收录' key="1">
              <EditContext.Provider value={{ editable: false }}>
                <Content
                  wrappedComponentRef={ContentRef}
                  formrecord={{}}
                  isedit
                  Noediting
                />
              </EditContext.Provider>
            </Panel>
          )}
          {title === '知识查询' && (
            <Panel header='知识收录' key="2">
              <Examine
                wrappedComponentRef={ExmaineRef}
                formrecord={{}}
                Noediting
              />
            </Panel>
          )}
        </Collapse>
      </div >
    </PageHeaderWrapper>
  );
}

export default Operation;