import {Component, Vue} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import IPizzaCartItem from '@/domain/IPizzaCartItem';
import currency from 'currency.js';

const cart = namespace('cart');

@Component
export default class MoneyCounter extends Vue {
    @cart.Getter getCart!: IPizzaCartItem[];

    getItemPrice(pizza: IPizzaCartItem): string {

        let value = currency(0, { symbol: '€', precision: 2 })
            .add(pizza.pizzaSize.price)
            .add(pizza.crust.price);

        for (const ingredient of pizza.ingredients) {
            const ingredientPrice = currency(ingredient.details.price,
                { symbol: '€', precision: 2, decimal: ',' });
            value = value.add(ingredientPrice.multiply(ingredient.count));
        }

        return value.format(true);
    }

    getCartTotalPrice(withDeliveryPrice?: boolean): string {

        let value = currency(0, { symbol: '€', precision: 2 });

        for (const cartItem of this.getCart) {
            value = value.add(this.getItemPrice(cartItem)).multiply(cartItem.amount);
        }

        return withDeliveryPrice
            ? value.add(3.5).format(true)
            : value.format(true);
    }
}
