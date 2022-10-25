import Vue from 'vue'
import Router from 'vue-router'

import Welcome from "../views/home/home";
import Index from "../views/layout";
import BaseBoat from "../views/baseboat/BaseBoat";
import Nationality from "../views/system/Nationality";
import forecast from "../views/forecastManagement/forecast";
import Dock from "../views/system/Dock";
import WordPort from "../views/system/WordPort";
import system from "../views/system/System"
Vue.use(Router);

const VueRouterPush = Router.prototype.push
Router.prototype.push = function push (to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

export default new Router({
  linkExactActiveClass: "act",
  mode: "history",
  routes: [


    {
      path : '/',
      name:'AllIndex',
      component:Index,
      redirect:{name : '首页'},
      children:[
        {
          path : 'home',
          name:'首页',
          component:Welcome

        },

        {
          path : 'baseboat',
          name:'船舶信息',
          component:BaseBoat,
          meta:{title:"船舶信息"}
        },
        {
          path : 'forecastManagement',
          name:'预报管理',
          component :forecast,
          meta:{title:"预报管理"}
        },
        {
          path:'system',
          name : '系统管理',
          component:system,
          meta:{title:"系统管理"},
          redirect: 'noRedirect',
          children:[
            {
              path : '/nationality',
              name:'国籍管理',
              component :Nationality,
              meta:{title:"国籍管理"}
            },

            {
              path : '/dock',
              name:'码头管理',
              component :Dock,
              meta:{title:"码头管理"}
            },
            {
              path : '/wordPort',
              name:'港口管理',
              component :WordPort,
              meta:{title:"港口管理"}
            },
          ]
        },



        ]
    },
  ]
})

