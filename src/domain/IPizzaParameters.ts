import ICrust from '@/domain/ICrust';
import ICutStyle from '@/domain/ICutStyle';
import IPizzaSize from '@/domain/IPizzaSize';

export default interface IPizzaParameters {
    crusts: ICrust[];
    cutStyles: ICutStyle[];
    pizzaSizes: IPizzaSize[];
}
