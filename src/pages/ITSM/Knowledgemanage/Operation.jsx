import React, { useState, useRef } from 'react';
import router from 'umi/router';
import { Collapse, Button } from 'antd';
import styles from '@/utils/utils.less';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import EditContext from '@/layouts/MenuContext';              // 引用上下文管理组件
import Content from './components/Content';
import Examine from './components/Examine';

const { Panel } = Collapse;

function Operation(props) {
  const { location: { state: { runpath, title } } } = props;
  const [activeKey, setActiveKey] = useState(['formpanel']);
  const ContentRef = useRef(null);
  const ExmaineRef = useRef(null);
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
    router.push({
      pathname: runpath,
      query: { pathpush: true },
      state: { cache: false }
    });
  };
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
    <PageHeaderWrapper title={title === '知识审核' ? '知识审核' : '编辑知识'} extra={operations}>
      <div className={styles.ordercollapse}>
        <Collapse
          expandIconPosition="right"
          activeKey={activeKey}
          bordered={false}
          onChange={callback}
        >

          {title !== '知识审核' && (
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
          {title === '知识审核' && (
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
        </Collapse>
      </div >
    </PageHeaderWrapper>
  );
}

export default Operation;