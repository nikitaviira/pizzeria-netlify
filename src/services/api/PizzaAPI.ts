import Repository from '../Repository';
import {AxiosResponse} from 'axios';
import IPizzaParameters from '@/domain/IPizzaParameters';
import IIngredient from '@/domain/IIngredient';
import IIngredientDetails from '@/domain/IIngredientDetails';
import IPizzaCreate from '@/domain/IPizzaCreate';
import IPizzaEdit from '@/domain/IPizzaEdit';

export default {

    getPizzaParameters(): Promise<AxiosResponse<IPizzaParameters>> {
        return Repository().get('v1.1/Pizza/GetPizzaParameters');
    },

    getIngredientsByCategory(category: string): Promise<AxiosResponse<IIngredient[]>> {
        return Repository().get(`v1.1/Pizza/GetIngredientsByType/${category}`);
    },

    getTemplateIngredients(templateName: string): Promise<AxiosResponse<IIngredientDetails[]>> {
        return Repository().get(`v1.1/Pizza/GetTemplateItems/${templateName}`);
    },

    createPizzaWithIngredients(pizza: IPizzaCreate): Promise<AxiosResponse<{ pizzaId: string }>> {
        return Repository().post('v1.1/Pizza/CreatePizzaWithIngredients', pizza);
    },

    editPizzaWithIngredients(id: string, pizza: IPizzaEdit): Promise<AxiosResponse<any>> {
        return Repository().put(`v1.1/Pizza/UpdatePizzaWithIngredients/${id}`, pizza);
    }

};
