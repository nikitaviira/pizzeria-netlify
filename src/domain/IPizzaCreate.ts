export default interface IPizzaCreate {
    crustId: string;
    pizzaSizeId: string;
    cutStyleId: string;

    itemsOnPizza: { ingredientId: string; quantity: number }[];
}
