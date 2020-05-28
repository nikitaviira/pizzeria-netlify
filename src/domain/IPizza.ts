import ICrust from '@/domain/ICrust';
import IPizzaSize from '@/domain/IPizzaSize';
import ICutStyle from '@/domain/ICutStyle';

export default interface IPizza {
    id: string;

    crustId: string;
    crust: ICrust;

    pizzaSizeId: string;
    pizzaSize: IPizzaSize;

    cutStyleId: string;
    cutStyle: ICutStyle;
}
