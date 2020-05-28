import Axios from 'axios';
import store from '@/store/index';

export default () => {
    return Axios.create({
        baseURL: store.state.baseURL
    });
};
