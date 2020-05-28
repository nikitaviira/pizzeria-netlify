export default interface ILoginResponse {
    token: string;
    userInfo: {
        username: string;
        roles: string[];
        fullName: string;
    };
}
