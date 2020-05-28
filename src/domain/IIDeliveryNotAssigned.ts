export default interface IIDeliveryNotAssigned {
    id: string;

    street: string;
    apartmentNumber: string;
    postCode: string;
    town: string;
    phoneNumber: string;
    orderNotes: string;

    orderNumber: string;
    username: string;

    createdAt: Date;
}
