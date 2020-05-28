import IIngredient from '@/domain/IIngredient';

export default interface IIngredientDetails {
    count: number;
    details: IIngredient;
    template?: boolean;
}
