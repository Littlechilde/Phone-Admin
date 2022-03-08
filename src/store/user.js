import {UserInfo } from '../api/api'
import router, { asyncRoutes } from '../router';

const state = {
    token: localStorage.getItem('token'),
    roles: [],
    menus: []
}

const mutations = {
    SET_ROLES: (state, roles) => {
        state.roles = roles
    },
    SET_MENUS: (state, menus) => {
        state.menus = menus
    }
}

const actions = {
    /* getUserInfo */
    GetInfo({ commit }, token) {
        return new Promise((resolve, reject) => {
            UserInfo(token).then(response => {
                const { code, data } = response.data
                if (code == 200) {
                    commit('SET_AVATAR', data.avatar)
                    commit('SET_USERNAME', data.username)
                    commit('SET_ROLES', data.roles)
                    commit('SET_MENUS', data.menus)
                    resolve(response.data)
                }
            }).catch(error => {
                reject(error)
            })
        })
    },
    /* 用户登出 */
    LogoutResult({ commit }) {
        commit('SET_ROLES', '')
        commit('SET_MENUS', '')
        /* 清楚动态路由 */
        asyncRoutes.forEach((item) => {
            router.removeRoute(item.name)
        });
        localStorage.clear();
    }
}

export default {
    namespaced: true, //开启命名空间
    state,
    mutations,
    actions,
}