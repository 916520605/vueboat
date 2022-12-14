// 注册vuex

import Vuex from 'vuex'

import Vue from 'vue'
import axios from 'axios'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        wordPort: {},
        dock: {},
        purpose:{}
    }, // 存放数据

    getters: {}, // 计算属性,对store中已有的数据加工处理之后形成新的数据。store中数据发生变化，getter的数据也会发生变化
    

    mutations: {
        AllPort(state,res) {
            state.wordPort=res
        },
        AllDock(state, res) {
            state.dock=res
        },
        AllPurpose(state, res) {
            state.purpose=res
        }
    }, // 修改state中数据的一些方法

    actions: {
        getAllPort(context) {
            axios.post('/wordPort/list').then(res => {
                context.commit('AllPort',res.data)
            })
        },
        getAllDock(context) {
            axios.get('/dock/list').then(res => {
                context.commit('AllDock',res.data.data)
            })
        },

        getPurposesLIst(context) {
            axios.get('/sysDictItem/select').then(res => {
                context.commit('AllPurpose',res.data.data)
            })
        }
    }, // 异步方法

    modules: {} // store模块

})

// 暴露实例

export default store   