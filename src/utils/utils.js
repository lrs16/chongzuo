import React from 'react';
import { parse } from 'querystring';
import pathRegexp from 'path-to-regexp';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { RedditSquareFilled } from '@ant-design/icons';
/* eslint no-useless-escape:0 import/prefer-default-export:0 */
import { notification, Icon } from 'antd';

const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
export const isUrl = path => reg.test(path);
export const isAntDesignPro = () => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }

  return window.location.hostname === 'preview.pro.ant.design';
}; // 给官方演示站点用，用于关闭真实开发环境不需要使用的特性

export const isAntDesignProOrDev = () => {
  const { NODE_ENV } = process.env;

  if (NODE_ENV === 'development') {
    return true;
  }

  return isAntDesignPro();
};
export const getPageQuery = () => parse(window.location.href.split('?')[1]);
/**
 * props.route.routes
 * @param router [{}]
 * @param pathname string
 */

// 获取路由权限
export const getAuthorityFromRouter = (router, configrouter, pathname) => {
  if (pathname === `/`) {
    const redireturl = configrouter[0];
    const authority = router.find(obj => {
      return obj.menuUrl === redireturl.redirect;
    });
    if (authority) return authority?.menuauth;
    // return undnefined;
  }
  const authority = router.find(({ menuUrl }) => menuUrl && pathRegexp(menuUrl).exec(pathname));
  if (authority) return authority?.menuauth;
  return undefined;
};

export const store = {
  save: (name, value, type = 'localtorage') => {
    if ((type || '').toLocaleLowerCase() === 'localstorage') {
      localStorage.setItem(name, JSON.stringify(value));
    } else if ((type || '').toLocaleLowerCase() === 'sessionstorage') {
      sessionStorage.setItem(name, JSON.stringify(value));
    }
  },
  // eslint-disable-next-line consistent-return
  get: (name, type = 'localStorage') => {
    if ((type || '').toLocaleLowerCase() === 'localstorage') {
      return JSON.parse(localStorage.getItem(name) || '{}');
    }
    if ((type || '').toLocaleLowerCase() === 'sessionstorage') {
      return JSON.parse(sessionStorage.getItem(name) || '{}');
    }
  },
};

export const openNotification = (data) => {
  // const arr = data.reverse();
  const arr = data.map(item => ({ ...item }))
  notification.error({
    placement: 'topLeft',
    duration: 3,
    message: '请填写以下表单信息：',
    description: <>
      {arr?.map((obj, i) => <div key={i.toString()}>
        {obj?.errors?.map((item, j) => <span key={`${item.field}${j.toString()}`}>{(i + 1).toString()}、{item.message}</span>)}
      </div>)}
    </>,
    icon: <Icon type="close-circle" theme="twoTone" twoToneColor='#f5222d' />,
    key: sessionStorage.getItem('tabid')
  });
  setTimeout(() => {
    const notificationBox = document.getElementsByClassName('ant-notification-topLeft');
    if (notificationBox[0]) {
      const scrollWidth = document.body.clientWidth / 2
      const boxWidth = notificationBox[0].offsetWidth / 2;
      notificationBox[0].style.left = `${scrollWidth - boxWidth}px`;
    }
  }, 50)
};
