import { createStore } from 'vuex';
import user from './user';
import auth from './auth';

//创建并暴露store
const store = createStore({
  modules: {
    user,
    auth,
  },
});
export default store;
