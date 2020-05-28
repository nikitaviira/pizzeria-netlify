import Repository from '../Repository';
import {AxiosResponse} from 'axios';
import IOrder from '@/domain/IOrder';
import IUserOrder from '@/domain/IUserOrder';
import IReviewCreate from '@/domain/IReviewCreate';
import IReviews from '@/domain/IReviews';

export default {

    createOrder(order: IOrder): Promise<AxiosResponse<any>> {
        return Repository().post('v1.1/Order/CreateOrder', order);
    },

    deleteOrder(id: string): Promise<AxiosResponse<any>> {
        return Repository().delete(`v1.1/Order/DeleteOrder/${id}`);
    },

    getAllUserUnfinishedOrders(): Promise<AxiosResponse<IUserOrder[]>> {
        return Repository().get(`v1.1/Order/GetAllUserUnfinishedOrders`);
    },

    getAllUserFinishedOrders(pageNumber: number): Promise<AxiosResponse<IUserOrder[]>> {
        return Repository().get(`v1.1/Order/GetAllUserFinishedOrders/?pageNumber=${pageNumber}`);
    },

    createReview(review: IReviewCreate): Promise<AxiosResponse<any>> {
        return Repository().post('v1.1/Order/CreateReview', review);
    },

    getReviewsPerPage(pageNumber: number): Promise<AxiosResponse<IReviews>> {
        return Repository().get(`v1.1/Order/GetReviewsPerPage/?pageNumber=${pageNumber}`);
    },
};
