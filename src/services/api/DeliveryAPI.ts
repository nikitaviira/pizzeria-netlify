import Repository from '../Repository';
import {AxiosResponse} from 'axios';
import IDeliveryType from '@/domain/IDeliveryType';
import IIDeliveryNotAssigned from '@/domain/IIDeliveryNotAssigned';
import IDeliveryAssigned from '@/domain/IDeliveryAssigned';
import IDeliveryEdit from '@/domain/IDeliveryEdit';

export default {

    getAllDeliveryTypes(): Promise<AxiosResponse<IDeliveryType[]>> {
        return Repository().get('v1.1/Delivery/GetAllDeliveryTypes');
    },

    getAllNonAssignedDeliveries(): Promise<AxiosResponse<IIDeliveryNotAssigned[]>> {
        return Repository().get(`v1.1/Delivery/GetAllNonAssignedDeliveries`);
    },

    getAllAssignedToUserDeliveries(): Promise<AxiosResponse<IDeliveryAssigned[]>> {
        return Repository().get(`v1.1/Delivery/GetAllAssignedToUserDeliveries`);
    },

    assignUserToDelivery(id: string, delivery: IDeliveryEdit): Promise<AxiosResponse<any>> {
        return Repository().put(`v1.1/Delivery/AssignUserToDelivery/${id}`, delivery);
    },

    removeUserFromDelivery(id: string): Promise<AxiosResponse<any>> {
        return Repository().put(`v1.1/Delivery/RemoveUserFromDelivery/${id}`);
    },

    markDeliveryAsFinished(id: string): Promise<AxiosResponse<any>> {
        return Repository().put(`v1.1/Delivery/MarkDeliveryAsFinished/${id}`);
    },
};
