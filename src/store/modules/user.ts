import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators';
import IRegisterCredentials from '@/domain/IRegisterCredentials';
import UserApi from '@/services/api/UserAPI';
import Axios from 'axios';
import ILoginCredentials from '@/domain/ILoginCredentials';
import IUser from '@/domain/IUser';
import ILoginResponse from '@/domain/ILoginResponse';

@Module({ namespaced: true })
class User extends VuexModule {

    token: string = localStorage.getItem('jwt') || '';
    userCached: string | null = localStorage.getItem('userInfo');

    userInfo: IUser = this.userCached !== null
        ? JSON.parse(this.userCached)
        : { username: '', roles: [], fullName: '' };

    get isLoggedIn(): boolean {
        return !!this.token;
    }

    get getToken(): string {
        return this.token;
    }

    get getUser(): IUser {
        return this.userInfo;
    }

    get getRoles(): string[] {
        return this.userInfo.roles;
    }

    @Mutation
    setUserInfo(payload: ILoginResponse): void {
        this.token = payload.token;
        this.userInfo = payload.userInfo;
    }

    @Mutation
    removeUserInfo(): void {
        this.token = '';
        this.userInfo = { username: '', roles: [], fullName: '' };
    }

    @Action({ rawError: true })
    register(credentials: IRegisterCredentials): Promise<any> {
        return new Promise((resolve, reject) => {
            UserApi.register(credentials)
                .then(() => {
                    resolve();
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    @Action({ rawError: true })
    login(credentials: ILoginCredentials): Promise<any> {
        return new Promise((resolve, reject) => {
            UserApi.login(credentials)
                .then(resp => {
                    const { token, userInfo } = resp.data;

                    localStorage.setItem('userInfo', JSON.stringify(userInfo));
                    localStorage.setItem('jwt', token);

                    this.context.commit('setUserInfo', { token, userInfo });

                    resolve();
                })
                .catch(err => {
                    localStorage.removeItem('jwt');
                    localStorage.removeItem('userInfo');

                    reject(err);
                });
        });
    }

    @Action({ rawError: true })
    logout(): Promise<void> {
        return new Promise((resolve, reject) => {
            localStorage.removeItem('jwt');
            localStorage.removeItem('userInfo');

            this.context.commit('removeUserInfo');
            delete Axios.defaults.headers.common.Authorization;

            resolve();
        });
    }
}
export default User;
