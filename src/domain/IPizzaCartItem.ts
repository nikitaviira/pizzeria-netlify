import ICrust from '@/domain/ICrust';
import IPizzaSize from '@/domain/IPizzaSize';
import ICutStyle from '@/domain/ICutStyle';
import IIngredientDetails from '@/domain/IIngredientDetails';

export default interface IPizzaCartItem {
    id: string;
    name: string;
    crust: ICrust;
    pizzaSize: IPizzaSize;
    cutStyle: ICutStyle;
    amount: number;
    ingredients: IIngredientDetails[];
}
