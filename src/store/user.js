import {userInfo } from '../api/user'
import router, { asyncRoutes } from '../router';

const state = {
    roles: [],
    openKeys:JSON.parse(localStorage.getItem("openKeys")) || [],
    userId:'',
    username:localStorage.getItem('username') || 'admin'
}

const mutations = {
    SET_ROLES: (state, roles) => {
        state.userId = roles
    },
    SET_USERNAME: (state, name) => {
        state.username = name
    },
    SET_KEYS: (state, openKeys) => {
        state.openKeys = openKeys
    }
}

const actions = {
    /* getUserInfo */
    GetInfo({ commit }, userId) {
        return new Promise((resolve, reject) => {
            userInfo({userId}).then(response => {
                const { code, data } = response
                if (!code) {
                    commit('SET_USERNAME', data.username);
                    commit('SET_ROLES', data.userId);
                    localStorage.setItem('username',data.username);
                    // commit('SET_AVATAR', data.avatar)
                    // commit('SET_MENUS', data.menus)
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
        commit('SET_USERNAME', '')
        // commit('SET_MENUS', '')
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