export default interface IDeliveryAssigned {

    id: string;

    street: string;
    apartmentNumber: string;
    postCode: string;
    town: string;
    phoneNumber: string;
    orderNotes: string;

    orderNumber: string;
    deliveryType: string;
    username: string;

    assignedAt: Date;
}
