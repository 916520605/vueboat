import Vue from 'vue'
import Router from 'vue-router'

import home from "../views/home/home";
import Index from "../views/layout";
import BaseBoat from "../views/baseboat/BaseBoat";
import Nationality from "../views/system/Nationality";
import forecast from "../views/forecastManagement/forecast";
import Dock from "../views/system/supplier/Dock";
import WordPort from "../views/system/WordPort";
import system from "../views/system/System";
import suppier from "../views/system/supplier/supplier";
import pilotstation from "../views/system/supplier/pilotstation";
import tugcompany from "../views/system/supplier/tugcompany"
import Error404 from "../views/error/404";
import Error401 from "../views/error/401";
import Error500 from "../views/error/500";
import Dictionary from "../views/system/Dictionary";
import DictData from "../views/system/DictData";
import Delegation from "../views/delegation/Delegation";

Vue.use(Router);

const VueRouterPush = Router.prototype.push
Router.prototype.push = function push(to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

export default new Router({
  linkExactActiveClass: "act",
  mode: "history",
  routes: [

    {
      path: '/404error',
      component: Error404,
      name:'error404'
    },
    {
      path:'/401error',
      component:Error401,
      name:'error401'
    },
    {
      path:'/500error',
      component:Error500,
      name:'error500'
    },
    {
      path: '/',
      name: 'Index',
      component: Index,
      redirect: {name: '首页'},
      children: [
        {
          path: 'home',
          name: '首页',
          component: home

        },
        {
          path:'dict-data:id',
          component:DictData,
          name:'字典数据',
          hidde:true,
          meta: {title: "字典数据"}
        },
        
        {
          path: 'baseboat',
          name: '船舶信息',
          component: BaseBoat,
          meta: {title: "船舶信息"}
        },
        {
          path: 'forecastManagement',
          name: '预报管理',
          component: forecast,
          meta: {title: "预报管理"}
        },
        {
          path: 'system',
          name: '系统管理',
          component: system,
          meta: {title: "系统管理"},
          redirect: 'noRedirect',
          children: [
            {
              path: '/nationality',
              name: '国籍管理',
              component: Nationality,
              meta: {title: "国籍管理"}
            },
            {
              path: '/wordPort',
              name: '港口管理',
              component: WordPort,
              meta: {title: "港口管理"}
            },
            {
              path:'/dictionary',
              name:'字典管理',
              component:Dictionary,
              meta:{title: '字典管理'}
            },
            {
              path:'/delegation',
              name:'委托方管理',
              component:Delegation,
              meta:{title: '委托方管理'}
            },
            {
              path: '/supplier',
              name: '供应商管理',
              component: suppier,
              redirect: 'noRedirect',
              meta: {title: "供应商管理"},
              children: [
                {
                  path: '/dock',
                  name: '码头管理',
                  component: Dock,
                  meta: {title: "码头管理"}
                },
                {
                  path: '/pilotsation',
                  name: '引航站',
                  component: pilotstation,
                  meta: {title: '引航站'}
                },
                {
                  path: '/tugcompany',
                  name: '拖轮公司',
                  component: tugcompany,
                  meta: {title: '拖轮公司'}
                },

              ],
            },
          ]
        },


      ]
    },
    {
      path:'*',
      component:Error404
    },
  ]
})

