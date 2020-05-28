import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import IPizzaCartItem from '@/domain/IPizzaCartItem';

@Module({ namespaced: true })
class Cart extends VuexModule {

    cartCached: string | null = localStorage.getItem('orderCart');
    orderCart: IPizzaCartItem[] = this.cartCached !== null
        ? JSON.parse(this.cartCached)
        : [];

    get getCart() {
        return this.orderCart;
    }

    get getCartLength() {
        return this.orderCart.length;
    }

    @Mutation
    ADD_ITEM(item: IPizzaCartItem): void {
        this.orderCart.push(item);
    }

    @Mutation
    UPDATE_ITEM(item: IPizzaCartItem): void {
        for (let i = 0; i < this.orderCart.length; i++) {
            if (this.orderCart[i].id === item.id) {
                this.orderCart[i] = item;
                break;
            }
        }
    }

    @Mutation
    DELETE_ITEM(index: number): void {
        this.orderCart.splice(index, 1);
    }

    @Mutation
    DELETE_ALL_ITEMS(): void {
        this.orderCart = [];
    }

    @Action
    addItem(item: IPizzaCartItem): void {
        this.context.commit('ADD_ITEM', item);
        localStorage.setItem('orderCart', JSON.stringify(this.orderCart));
    }

    @Action
    updateItem(item: IPizzaCartItem): Promise<void> {
        return new Promise((resolve, reject) => {
            this.context.commit('UPDATE_ITEM', item);
            localStorage.setItem('orderCart', JSON.stringify(this.orderCart));
            resolve();
        });
    }

    @Action
    removeItem(index: number): Promise<number> {
        return new Promise((resolve, reject) => {
            this.context.commit('DELETE_ITEM', index);
            localStorage.setItem('orderCart', JSON.stringify(this.orderCart));
            resolve(this.getCartLength);
        });
    }

    @Action
    removeAll(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.context.commit('DELETE_ALL_ITEMS');
            localStorage.setItem('orderCart', JSON.stringify(this.orderCart));
            resolve();
        });
    }
}
export default Cart;
