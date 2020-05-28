export default interface IOrder {
    paymentMethod: string;
    orderItems: { pizzaId: string; quantity: number }[];
    deliveryInfo: {
        street: string;
        apartmentNumber: string;
        postCode: string;
        town: string;
        phoneNumber: string;
        orderNotes: string;
    };
}
