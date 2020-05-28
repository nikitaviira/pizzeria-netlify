export default interface IUserOrder {

    id: string;

    orderStatus: string;
    orderNumber: string;

    deliveryStatus: string;

    moneyAmount: string;
    paymentMethod: string;

    totalCount: number;
    hasReview: boolean;

    createdAt: Date;
}
