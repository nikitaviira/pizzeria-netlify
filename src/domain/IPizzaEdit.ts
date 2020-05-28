export default interface IPizzaEdit {
    id: string;

    crustId: string;
    pizzaSizeId: string;
    cutStyleId: string;

    itemsOnPizza: { ingredientId: string; quantity: number }[];
}
