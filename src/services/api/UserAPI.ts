import Repository from '../Repository';
import { AxiosResponse } from 'axios';
import ILoginResponse from '@/domain/ILoginResponse';
import ILoginCredentials from '@/domain/ILoginCredentials';
import IRegisterCredentials from '@/domain/IRegisterCredentials';

export default {

    login(credentials: ILoginCredentials): Promise<AxiosResponse<ILoginResponse>> {
        return Repository().post('v1.0/account/login', credentials);
    },

    register(credentials: IRegisterCredentials): Promise<AxiosResponse<any>> {
        return Repository().post('v1.0/account/register', credentials);
    }

};
