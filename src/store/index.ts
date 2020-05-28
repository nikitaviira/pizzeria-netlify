import Vue from 'vue';
import Vuex from 'vuex';
import User from '@/store/modules/user';
import Cart from '@/store/modules/cart';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        baseURL: 'https://pizzeria-nekitosa.azurewebsites.net/api/'
    },
    modules: {
        user: User,
        cart: Cart
    }
});
export default store;
