import Vue from 'vue'
import Router from 'vue-router'

import Welcome from "../components/Welcome";
import AllBoat from "../pages/AllBoat";
import AllIndex from "../components/AllIndex";
import Management from "../pages/Management";
import BaseBoat from "../pages/BaseBoat";
import Nationality from "../pages/Nationality";
import forecast from "../pages/forecast";
import Dock from "../pages/Dock";
import WordPort from "../pages/WordPort"
Vue.use(Router);

const VueRouterPush = Router.prototype.push
Router.prototype.push = function push (to) {
  return VueRouterPush.call(this, to).catch(err => err)
}
//加上这段代码就解决了
export default new Router({
  linkExactActiveClass: "act",
  mode: "history",
  routes: [
    {
      path : '/',
      name:'AllIndex',
      component:AllIndex,
      redirect:{name : 'Welcome'},
      children:[{
        path: '/AllBoat',
        name: 'AllBoat',
        component: AllBoat
      },
        {
          path : '/Welcome',
          name:'Welcome',
          component:Welcome

        },{
        path:'/AllIndex',
          name : 'AllIndex',
          component : AllIndex
        },
        {
          path : '/Management',
          name:'Management',
          component:Management
        },
        {
          path : '/BaseBoat',
          name:'BaseBoat',
          component:BaseBoat
        },
        {
          path : '/Nationality',
          name:'Nationality',
          component :Nationality
        },
        {
          path : '/forecast',
          name:'forecast',
          component :forecast
        },
        {
          path : '/dock',
          name:'Dock',
          component :Dock
        },
        {
          path : '/WordPort',
          name:'WordPort',
          component :WordPort
        },

        ]
    }
  ]
})

