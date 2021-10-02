/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout from '@ant-design/pro-layout'; // , { DefaultFooter }
import React, { useEffect, useState } from 'react';
import Link from 'umi/link';
import router from 'umi/router';
import { connect } from 'dva';
import { Result, Button, Tabs, List, Icon } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import MenuContext from '@/layouts/MenuContext';
import { getAuthorityFromRouter } from '@/utils/utils';
import { setTabClickNum } from '@/services/api';
// import TobTabHoc from './TopTabHoc';
import logo from '../../public/menulogo.png';
// import Layout from './BlankLayout';
// import PageTab from './PageTab';
import Tabrouters from './Tabrouters';



const { TabPane } = Tabs;

const homepane = [{
  name: '首页',
  itemPath: '/ITSM/home',
  id: '1444116690453917698',
  closable: false,
  state: { cache: false },
},
// {
//   name: "作业管理",
//   id: "1430857478042976257",
//   itemPath: "/automation/automatedjob/jobmanagement",
//   query: {},
//   state: { cache: false, cacheinfo: {} },
//   data: { cacheinfo: {} }
// },
]

const noMatch = (
  <Result
    status="403"
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);


const menuDataRender = menuList =>
  menuList.map(item => {
    const localItem = { ...item, children: item.children ? menuDataRender(item.children) : [] };
    // const localItem = { ...item, children: [] };
    return Authorized.check(item.authority, localItem, null);
  });

const topMenuDataRender = menuList =>
  menuList.map(item => {
    const localItem = { ...item, children: [], routes: [] };
    return Authorized.check(item.authority, localItem, null);
  });

const BasicLayout = props => {
  const {
    loading,
    dispatch,
    children,
    settings,
    location = {
      pathname: '/',
    },
    Userauth,
    menuData,
    menulist,
    cacheinfo,
    tabid,
    savecache,
  } = props;

  const url = location.pathname;

  const [toptabs, setTopTabs] = useState([...homepane]);
  const [activeKey, setActiveKey] = useState('1444116690453917698');
  const [tabmenu, setTabMenu] = useState({ x: 0, y: 0, v: 'none' });
  const [alonepath, setAlonepath] = useState([]);
  const [multiplepath, setMultiplepath] = useState([]);
  const [currenttab, setCurrentTab] = useState('');

  const clearcache = () => {
    dispatch({
      type: 'viewcache/cleardata',
    });
  }

  const getcache = () => {
    dispatch({
      type: 'viewcache/fetch',
      payload: {
        newtab: true,
        tabid: activeKey,
      },
    });
  }

  // 待研究
  // const getChildren = (v) => {
  //   return React.Children.map(children, child => {
  //     return React.cloneElement(child, {
  //       new: v,
  //     });
  //   })
  // }

  // 初始强制跳转首页
  useEffect(() => {
    if (toptabs.length === 1 && url !== '/ITSM/home') {
      clearcache();         // 清缓存
      router.push({
        pathname: '/ITSM/home',
        query: {}
      });
    }
  }, []);

  // 打开最末的标签
  const lasttabactive = (tabs) => {
    const end = tabs.slice(-1)[0];
    const target = alonepath.filter(item => item.path === end.itemPath)[0];
    const multipletarget = multiplepath.filter(item => item.path === end.itemPath)[0];
    setActiveKey(end.id);
    router.push({
      pathname: end.itemPath,
      query: (target || multipletarget || (end.query && end.query.Id)) ? end.query : {},
      state: (end.data && end.data.cacheinfo) ? { cacheinfo: end.data.cacheinfo } : { ...end.state, cache: false },
    });
    if (multipletarget && end.data && end.data.cacheinfo) {
      clearcache();
      dispatch({
        type: 'viewcache/sendcache',
        payload: {
          tabdata: end.data.cacheinfo,
          tabid: end.id,
        },
      });
    }
  }

  // 更新页签信息
  const ChangetabQuery = (newquery) => {
    const target = toptabs.filter(item => item.id === newquery.mainId)[0];
    if (target) {
      delete target.query.updatetab;
      target.query = newquery;
      // target.id = newquery.mainId;
      const newData = toptabs.map(item => {
        return item.id === target.id ? target : item
      });
      setTopTabs(newData)
    };
  };

  // 监听列表跳转详情页的路由,处理完成路转回待办列表
  //  待办跳转处理用mainId做为标签id并传编号orderNo用于标签标题显示,查询跳转详情用编号No做为标签id
  useEffect(() => {
    const tabtargetid = toptabs.filter(item => location.query.No ? item.id === location.query.No : item.id === location.query.mainId)[0];      //  已有mindId或No标签
    const tabtargetpath = toptabs.filter(item => item.itemPath === url)[0];                          //  已有非工单处理路由
    const target = alonepath.filter(item => item.path === url)[0];                                   //  属于工单处理路由
    const menutarget = menulist.filter(item => item.menuUrl === url)[0];                             //  系统管理菜单列表有该路由
    const targetmultiple = multiplepath.filter(item => item.path === location.pathname)[0];          //  属于登记类打开同一个链接多页签

    // 已有标签,且不属于登记类和作业计划
    if (tabtargetpath && !targetmultiple && tabtargetpath && (tabtargetpath.query && tabtargetpath.query.Id === undefined)) {
      setActiveKey(tabtargetpath.id);
    };
    // 从页面添加多条登记类，如作业计划
    if (location.query.addtab && targetmultiple) {
      const { menuDesc } = menutarget;
      const targettype = toptabs.filter(item => item.type === targetmultiple.type);
      const num = targettype.length;
      const endid = num === 0 ? 0 : Number(targettype.slice(-1)[0].id.replace(/[^0-9]/ig, "")) + 1;
      const panels = {
        name: menuDesc,
        type: targetmultiple.type,
        id: `${targetmultiple.type}${endid}`,
        query: { ...location.query, tabid: `${targetmultiple.type}${endid}` },
        state: { ...location.state, cache: false },
        itemPath: targetmultiple.path,
        closable: true
      };
      delete panels.query.addtab;
      if (targettype[0]) {
        getcache();    // 获取旧页签数据
        toptabs.push(panels);
        lasttabactive(toptabs);
      } else {
        // 增加登记页签
        toptabs.push(panels);
        lasttabactive(toptabs);
      };
    }
    if (tabtargetid) {
      // 已有标签的工单详情或工单
      const id = location.query.No ? location.query.No : location.query.mainId;
      setActiveKey(id);
    } else if (target && menutarget) {
      // 属于工单详情
      if (location.query.No) {
        const panels = {
          name: `${menutarget.menuDesc}${location.query.No}`,
          id: location.query.No,
          itemPath: url,
          query: location.query,
          closable: true
        };
        toptabs.push(panels);
        setActiveKey(location.query.No);
      } else if (location.query.mainId) {
        // 属于工单
        const panels = {
          name: `${menutarget.menuDesc}${location.query.orderNo}`,
          id: location.query.mainId,
          itemPath: url,
          query: location.query,
          closable: true
        };
        toptabs.push(panels);
        setActiveKey(location.query.mainId);
      };
    };
    // 处理完毕且待办列表已关闭需跳转回待办列表，添加待办列表新签标
    if (location.query.pathpush && !tabtargetid && !target && !tabtargetpath && menutarget) {
      const { menuDesc, id, menuUrl } = menutarget;
      const targetid = toptabs.filter(item => item.id === id)[0];
      const panels = {
        name: menuDesc,
        id,
        itemPath: menuUrl,
        query: {},
        state: targetid ? { ...targetid.state, cache: false } : {},
        closable: true
      };
      toptabs.push(panels);
      setActiveKey(id);
    };
  }, [location])

  // 工单处理后跳转列表页关闭工单页签
  useEffect(() => {
    // 跳转时关闭页签
    if (location.state) {
      if (location.state.closetabid) {
        const newtabs = toptabs.filter(item => item.id !== location.state.closetabid);
        setTopTabs([...newtabs]);
      };
      // 更新页签信息
      if (location.state.updatetab) {
        ChangetabQuery(location.query)
      };
      if (location.state.dynamicpath) {
        const tabtargetid = toptabs.filter(item => item.id === location.query.Id)[0];
        if (tabtargetid) {
          const target = toptabs.filter(item => item.id === tabtargetid.id)[0];
          if (target) {
            target.state = location.state;
            target.name = `${location.state.menuDesc}${target.id}`
            const newData = toptabs.map(item => {
              return item.id === target.id ? target : item
            });
            setTopTabs(newData);
            setCurrentTab({ ...target })
          };
          setActiveKey(tabtargetid.id);
        } else if (location.query.Id && location.state.menuDesc) {
          const panels = {
            name: `${location.state.menuDesc}${location.query.Id}`,
            id: location.query.Id,
            itemPath: url,
            query: location.query,
            state: { ...location.state, dynamicpath: false },
            closable: true
          };
          toptabs.push(panels);
          setActiveKey(location.query.Id);
        };
      }
    }
  }, [location.state])

  // 关闭页签
  useEffect(() => {
    // 工单处理后关闭页签
    if (location.query.closetab && location.query.mainId) {
      const newtabs = toptabs.filter(item => item.id !== location.query.mainId);
      setTopTabs([...newtabs]);
      lasttabactive(newtabs)
    }
    // 登记关闭页签
    if (location.query.closecurrent && location.query.tabid) {
      clearcache();
      const newtabs = toptabs.filter(item => item.id !== location.query.tabid);
      setTopTabs([...newtabs]);
      lasttabactive(newtabs)
    };
    //
  }, [location.query])

  // 表单信息写入页签
  const ChangetabState = () => {
    const target = toptabs.filter(item => item.id === tabid)[0];
    if (target) {
      target.data = cacheinfo;
      target.state = { cache: false };
      const newData = toptabs.map(item => {
        return item.id === target.id ? target : item
      });
      setTopTabs(newData)
    };
  };
  useEffect(() => {
    if (savecache) {
      ChangetabState();
      clearcache();
    }
  }, [savecache])

  const callback = (key) => {
    const target = toptabs.filter(item => item.id === key)[0];
    const multipleurl = multiplepath.filter(item => item.path === target.itemPath)[0];
    if (target) {
      if (multipleurl) {
        clearcache();
        dispatch({
          type: 'viewcache/sendcache',
          payload: {
            tabdata: (target.data && target.data.cacheinfo !== undefined) ? target.data.cacheinfo : {},
            tabid: key,
          },
        });
      };
      router.push({
        pathname: target.itemPath,
        query: target.query,
        state: { ...target.data, cache: false }
      });
      setActiveKey(key);
    }
  };

  const remove = targetKey => {
    clearcache();
    const panes = toptabs.filter(pane => pane.id !== targetKey);
    if (panes.length) {
      setTopTabs([...panes]);
      if (activeKey === targetKey) {
        lasttabactive(panes);
      }
    };
  };
  const onEdit = (targetKey, action) => {
    if (action === 'remove') {
      remove(targetKey)
    };
    setTabMenu({ ...tabmenu, v: 'none' })
  };

  const handletopLink = (menuItemProps) => {
    const target = props.route.routes[0].routes.filter(item => item.path === menuItemProps.itemPath)[0];   // comfig配置的路由
    const targetpath = target.routes[0].redirect;                                                // 获取此路由下redirect的路由
    const targetmenu = menulist.filter(item => item.menuUrl === targetpath)[0];                  // 系统管理菜单列表获取redirect路由信息
    const { id, menuUrl } = targetmenu;
    const targetlink = toptabs.filter(item => item.id === id)[0];                                // 标签中是否已含有redirect的路由
    if (!targetlink && targetmenu) {
      const panels = { name: targetmenu.menuDesc, id, itemPath: menuUrl, query: location.query, closable: true, state: { cache: false }, };
      toptabs.push(panels);
    };
    setActiveKey(id);
  };

  const handleLink = (menuItemProps) => {
    const { name, id, itemPath } = menuItemProps;
    const target = toptabs.filter(item => item.id === id)[0];
    const targetmultiple = multiplepath.filter(item => item.path === itemPath)[0];
    if (!targetmultiple) {
      // 非登记类打开单页签
      if (!target) {
        // 已有页签打开页签
        const panels = { name, id, itemPath, query: {}, closable: true, state: { cache: false }, };
        toptabs.push(panels);
        lasttabactive(toptabs);
      } else {
        // 无该页签新增页签
        router.push({
          pathname: target.itemPath,
          query: { ...target.query },
          state: { cache: false }
        });
        setActiveKey(id);
      };
    } else {
      // 登记类打开相同多页签
      const targettype = toptabs.filter(item => item.type === targetmultiple.type);
      const num = targettype.length;
      const endid = num === 0 ? 0 : Number(targettype.slice(-1)[0].id.replace(/[^0-9]/ig, "")) + 1;
      if (targettype[0]) {
        getcache();    // 获取旧页签数据
        const panels = {
          name,
          type: targetmultiple.type,
          id: `${targetmultiple.type}${endid}`,
          query: { tabid: `${targetmultiple.type}${endid}` },
          state: { cache: false },
          itemPath,
          closable: true
        };
        toptabs.push(panels);
        lasttabactive(toptabs);
      } else {
        // 增加登记页签
        const panels = {
          name,
          type: targetmultiple.type,
          id: `${targetmultiple.type}${endid}`,
          query: { tabid: `${targetmultiple.type}${endid}` },
          state: { cache: false },
          itemPath,
          closable: true
        };
        toptabs.push(panels);
        lasttabactive(toptabs);
      };
    };
    setTabClickNum({ menuId: id });
  };

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
    if (dispatch) {
      dispatch({
        type: 'user/fetchMenu',
      });
    }
  }, []);


  // 缓存tabid
  useEffect(() => {
    sessionStorage.setItem('tabid', activeKey);
    const tabmsg = toptabs.filter(item => item.id === activeKey)[0];
    setCurrentTab({ ...tabmsg })
  }, [activeKey]);

  // 获取后端路由后为菜单添加用户权限,如果是"/"从config中获取rediret路由再获取该路由权限
  const authorized = getAuthorityFromRouter(menulist, props.route.routes[0].routes, location.pathname);

  // 根据当前url变化获取左侧菜单数据
  const pathArr = location.pathname.split('/');
  const path = `/${pathArr[1]}`;
  // const routeData = props.route.routes;
  const routeData = menuData;
  let leftRoute = {};
  routeData.map(item => {
    if (item.path === path) {
      leftRoute = item;
      return true;
    }
    return false;
  });

  return (
    <div onClick={() => setTabMenu({ ...tabmenu, v: 'none' })}>
      <Tabrouters
        Changealonepath={v => setAlonepath(v)}
        Changemultiple={v => setMultiplepath(v)}
      />
      <ProLayout
        loading={loading}
        layout="topmenu"
        fixedHeader
        logo={logo}
        menuItemRender={(menuItemProps, defaultDom) => {
          if (menuItemProps.isUrl || menuItemProps.children) {
            return defaultDom;
          };
          const rutersave = () => {
            router.push({
              pathname: location.pathname,
              state: { ...location.state, cache: true },
            });
          };
          return (
            <>
              <Link
                to={menuItemProps.path}
                onClick={() => handletopLink(menuItemProps)}
                onMouseDown={() => { rutersave() }}
              >
                {defaultDom}
              </Link>
            </>
          );
        }}
        menuDataRender={() => topMenuDataRender(menuData)}
        formatMessage={formatMessage}
        rightContentRender={rightProps => <RightContent {...rightProps} />}
        {...settings}
        route={menuData}
        disableContentMargin
        disableMobile // 禁用手机端菜单，不然手机端下会表现异常
      >
        <ProLayout
          // layout={'sidemenu'}
          fixSiderbar
          headerRender={false}
          menuHeaderRender={false}
          siderWidth={280}
          navTheme="light"
          // onCollapse={handleMenuCollapse}
          menuItemRender={(menuItemProps, defaultDom) => {
            if (menuItemProps.isUrl || menuItemProps.children) {
              return defaultDom;
            };
            const targetmultiple = multiplepath.filter(item => item.path === menuItemProps.itemPath)[0];
            const endid = () => {
              if (targetmultiple) {
                const targettype = toptabs.filter(item => item.type === targetmultiple.type);
                const num = targettype.length;
                return num === 0 ? 0 : Number(targettype.slice(-1)[0].id.replace(/[^0-9]/ig, "")) + 1;
              }
              return null
            };
            const rutersave = () => {
              router.push({
                pathname: location.pathname,
                state: { ...location.state, cache: true },
              });
            };
            const CleartabState = () => {
              const target = toptabs.filter(item => item.id === tabid)[0];
              if (target) {
                delete target.data
                if (target.state) {
                  target.state.cache = false;
                  target.state.refresh = true;
                };
                const newData = toptabs.map(item => {
                  return item.id === target.id ? target : item
                });
                setTopTabs(newData)
              };
            };
            return (
              <>
                {targetmultiple && (
                  <Link
                    to={{
                      pathname: menuItemProps.path,
                      query: { tabid: `${targetmultiple.type}${endid()}` },
                      state: {
                        cache: false,
                      },
                    }}
                    onClick={() => { handleLink(menuItemProps); CleartabState() }}
                    onMouseDown={() => { rutersave() }}
                  >{defaultDom}</Link>
                )}
                {!targetmultiple && (
                  <Link to={{
                    pathname: menuItemProps.path,
                    state: { cache: false, reset: true },
                  }}
                    onClick={() => { handleLink(menuItemProps); CleartabState() }}
                    onMouseDown={() => { rutersave() }}
                  >{defaultDom}</Link>
                )}
              </>
            );
          }}
          breadcrumbRender={(routers = []) => [
            {
              path: '/',
              breadcrumbName: formatMessage({
                id: 'menu.home',
                defaultMessage: 'Home',
              }),
            },
            ...routers,
          ]}
          itemRender={(route, params, routes, paths) => {
            const first = routes.indexOf(route) === 0;
            return first ? (
              <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
            ) : (
              <span>{route.breadcrumbName}</span>
            );
          }}
          menuDataRender={menuDataRender}
          route={leftRoute}
        // footerRender={footerRender}
        >
          <Button href="#toTop" size="large" type="danger" icon="arrow-up" style={{ zIndex: 9999, position: 'fixed', right: 20, bottom: 0 }} />
          <div
            id='toTop'
            onMouseDown={(e) => {
              e.preventDefault();
              if (e.button === 0) {
                router.push({
                  pathname: location.pathname,
                  query: location.query,
                  state: { ...location.state, cache: true, reset: false },
                });
              }
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              if (e.button === 2) {
                setTabMenu({ x: e.pageX - 50, y: e.pageY - 40, v: 'block' });
              }
            }}
          // style={{ position: 'fixed', top: 0, zIndex: 999 }}
          >
            <Tabs
              hideAdd
              activeKey={activeKey}
              type='editable-card'
              onChange={(key) => callback(key)}
              onEdit={onEdit}
              style={{ margin: '-24px -24px 0 ', backgroundColor: '#fff', position: 'fixed', width: 'calc(100% - 280px)', zIndex: 999 }}
            >
              {toptabs.map(obj => [
                <TabPane
                  tab={obj.name}
                  key={obj.id}
                  closable={obj.closable}
                >
                  {/* <Authorized authority={Userauth} noMatch={noMatch}>
                      {multipleurl && (
                        <div style={{ padding: '0 24px 0 24px', marginTop: 8, background: '#f1f1f1' }}>
                          {children}
                        </div>
                      )}
                    </Authorized> */}
                </TabPane>,
              ])}
            </Tabs>
          </div>
          {authorized === Userauth && (
            < >
              <Authorized authority={Userauth} noMatch={noMatch}>
                {/* <PageTab>{children}</PageTab> */}
                {/* <MenuContext.Provider value={{ tabnew, cleartabdata }}>
                  <div style={{ marginTop: 10 }}>
                    {children}
                  </div>
                </MenuContext.Provider> */}
                <div style={{ marginTop: 0 }}>
                  <MenuContext.Provider value={{ currenttab }}>
                    {children}
                  </MenuContext.Provider>
                </div>
              </Authorized>
            </>
          )}
          {authorized === 'incontrol' && (
            <Result
              status="403"
              title="403"
              subTitle="Sorry, 您没有此页面的访问权限。"
            // extra={
            //   <Button type="primary">
            //     <Link to="/">返 回</Link>
            //   </Button>
            // }
            />
          )}
          {authorized === undefined && (
            <>
              <Result
                status="404"
                title="404"
                subTitle="Sorry, 您访问的页面不存在"
              // extra={
              //   <Button type="primary">
              //     <Link
              //       to={{
              //         pathname: '/',
              //         query: { tabid: sessionStorage.getItem('tabid'), closecurrent: true }
              //       }}
              //     >返 回</Link>
              //   </Button>
              // }
              />
            </>
          )}
          <List
            bordered
            style={{
              position: 'fixed',
              left: tabmenu.x,
              top: tabmenu.y,
              display: tabmenu.v,
              zIndex: 9999,
              background: '#fff'
            }}>
            <List.Item style={{ padding: '10px 24px', cursor: 'pointer' }}
              onClick={() => {
                // 重置列表查询条件
                router.push({
                  pathname: location.pathname,
                  query: location.query,
                  state: { ...location.state, cache: false, reset: true },
                })
                // 登记类重置表单信息
                getcache();
                dispatch({
                  type: 'viewcache/sendcache',
                  payload: {
                    tabdata: undefined,
                    tabid: activeKey,
                  },
                });
              }}>
              <Icon type="reload" style={{ marginRight: 16 }} />刷新当前页签
            </List.Item>
            <List.Item style={{ padding: '10px 24px', cursor: 'pointer' }}
              onClick={() => {
                const target = toptabs.filter(item => item.id === activeKey)[0];
                if (toptabs.length > 2) { setTopTabs([{ ...homepane[0] }, { ...target }]); }
              }}
            >
              <Icon type="plus-square" style={{ marginRight: 16 }} />关闭其他
            </List.Item>
            <List.Item style={{ padding: '10px 24px', cursor: 'pointer' }}
              onClick={() => {
                if (toptabs.length > 1) { setTopTabs([{ ...homepane[0] }]); }
                clearcache();         // 清缓存
                router.push({
                  pathname: 'home',
                  query: {}
                });
              }}
            >
              <Icon type="close" style={{ marginRight: 16 }} />关闭全部
            </List.Item>
            {/* <List.Item style={{ padding: '10px', cursor: 'pointer' }}>
                <Icon type="vertical-right" style={{ marginRight: 16 }} />关闭左侧所有
                </List.Item>
              <List.Item style={{ padding: '10px', cursor: 'pointer' }}>
                <Icon type="vertical-left" style={{ marginRight: 16 }} /> 关闭右侧所有
                </List.Item> */}
          </List>
        </ProLayout>
      </ProLayout >
    </div>
  );
};

export default connect(({ global, settings, user, viewcache, loading }) => ({
  collapsed: global.collapsed,
  cacheinfo: viewcache.cacheinfo,
  tabid: viewcache.tabid,
  savecache: viewcache.savecache,
  settings,
  Userauth: user.Userauth,
  menuData: user.menuData,
  menulist: user.menulist,
  loading: loading.models.user,
}))(BasicLayout);
