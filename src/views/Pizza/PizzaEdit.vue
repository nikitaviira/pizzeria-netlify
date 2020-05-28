<template>
    <page-layout pictureName="pizza-main-3" localeTitle="pizzaEdit">
        <template v-slot:content>
            <v-flex xs6 xl5 :offset-xs1="$vuetify.breakpoint.xlOnly">
                <v-card class="elevation-5">
                    <v-overlay
                            absolute
                            opacity="0.6"
                            :value="overlay"
                    >
                        <v-btn
                                color="primary"
                                @click="overlay = false"
                        >
                            {{ $t('customizeIngredientsBtn') }}
                        </v-btn>
                    </v-overlay>
                    <v-toolbar flat dense class="primary" dark>
                        <v-toolbar-title class=" font-weight-bold">{{ $t('ingredients') }}</v-toolbar-title>
                    </v-toolbar>
                    <v-tabs
                            v-model="tab"
                            background-color="primary"
                            dark
                            grow
                            show-arrows
                            center-active
                    >
                        <v-tab>{{ $t('veggyCat') }}</v-tab>
                        <v-tab>{{ $t('meatCat') }}</v-tab>
                        <v-tab>{{ $t('cheeseCat') }}</v-tab>
                        <v-tab>{{ $t('sauceCat') }}</v-tab>
                        <v-tab>{{ $t('otherCat') }}</v-tab>
                    </v-tabs>
                    <v-tabs-items
                            v-model="tab"
                            style="height: 450px; overscroll-behavior-y: contain;"
                            class="overflow-y-auto"
                    >
                        <v-tab-item
                                v-for="category in ['Veggies','Meats','Cheeses','Sauces','Other']"
                                :transition="false"
                                :reverse-transition="false"
                        >
                            <ingredients-card :ingredientCategory="category">
                                <template v-slot:default="{ ingredient }">
                                    <v-btn @click="addIngredient(ingredient)" icon>
                                        <v-icon>mdi-plus</v-icon>
                                    </v-btn>
                                    <v-btn text disabled style="color: white !important;">
                                        {{ getIngredientCount(ingredient.id) }}
                                    </v-btn>
                                    <v-btn @click="removeIngredient(ingredient.id)" icon>
                                        <v-icon>mdi-minus</v-icon>
                                    </v-btn>
                                </template>
                            </ingredients-card>
                        </v-tab-item>
                    </v-tabs-items>
                </v-card>
            </v-flex>
            <v-flex xs6 xl5 :class="$vuetify.breakpoint.smAndDown ? 'mt-5' : ''">
                <v-card class="elevation-5">

                    <v-overlay
                            absolute
                            opacity="0.6"
                            :value="!dataLoaded"
                    >
                        <v-progress-circular
                                width="6"
                                indeterminate
                                color="primary"
                                size="64"
                        ></v-progress-circular>
                    </v-overlay>

                    <v-toolbar flat dense class="primary" dark>
                        <v-toolbar-title class=" font-weight-bold">{{ $t('parameters') }}</v-toolbar-title>
                    </v-toolbar>

                    <div class="pa-4">
                        <pizza-parameter-form
                                btnIcon="mdi-pencil"
                                :btnLoad.sync="btnLoad"
                                :btnText="$t('submitPizzaUpdate')"
                                :error="error ? error : $t(validationErrorLocale)"
                                @submit-form="updatePizza()"
                        >
                            <v-select
                                    v-model="pizza.crust"
                                    :items="crusts"
                                    outlined
                                    :readonly="!dataLoaded || !!error"
                                    :rules="[v => !!v.id || $t('fieldRequired')]"
                                    :item-text="titleLocale"
                                    return-object
                                    item-value="id"
                                    :label="$t('crustChoose')"
                            ></v-select>

                            <v-select
                                    v-model="pizza.cutStyle"
                                    :items="cutStyles"
                                    :item-text="titleLocale"
                                    :readonly="!dataLoaded || !!error"
                                    :rules="[v => !!v.id || $t('fieldRequired')]"
                                    outlined
                                    return-object
                                    item-value="id"
                                    :label="$t('cutChoose')"
                            ></v-select>

                            <v-select
                                    v-model="pizza.pizzaSize"
                                    :items="pizzaSizes"
                                    :rules="[v => !!v.id || $t('fieldRequired')]"
                                    outlined
                                    :readonly="!dataLoaded || !!error"
                                    return-object
                                    :item-text="size => `${size[titleLocale]} (${size.diameter})`"
                                    item-value="id"
                                    :label="$t('sizeChoose')"
                            ></v-select>

                            <v-slider
                                    v-model="pizza.amount"
                                    :label="$t('countChoose')"
                                    step="1"
                                    :min="1"
                                    :max="5"
                                    :thumb-label="true"
                                    ticks
                            ></v-slider>

                            <v-row v-if="dataLoaded" class="font-weight-bold justify-center headline">
                                {{ getItemPrice(pizza) }}
                            </v-row>

                        </pizza-parameter-form>
                    </div>
                </v-card>
            </v-flex>
        </template>
        <template v-slot:alerts>
            <v-dialog
                    v-model="dialog"
                    width="500"
            >
                <v-alert
                        style="margin-bottom: 0;"
                        v-model="dialog"
                        dismissible
                        class="font-weight-bold"
                        type="error"
                        icon="mdi-alert">
                    {{ error ? error : $t(validationErrorLocale) }}
                </v-alert>
            </v-dialog>
        </template>
    </page-layout>
</template>

<script lang="ts">
import {Component} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import IPizzaCartItem from '@/domain/IPizzaCartItem';
import PizzaCreate from './PizzaCreate.vue';
import IPizzaEdit from '@/domain/IPizzaEdit';
import PizzaApi from '@/services/api/PizzaAPI';

const cart = namespace('cart');

@Component({
    components: {
        'ingredientsCard': () => import('@/components/cards/IngredientsCard.vue'),
        'page-layout': () => import('@/components/DefaultPageLayout.vue'),
        'pizza-parameter-form': () => import('@/components/Form.vue')
    }
})
export default class PizzaEdit extends PizzaCreate {
    pizza: IPizzaCartItem = {} as IPizzaCartItem;

    showError: boolean = false;
    btnLoad: boolean = false;
    dialog: boolean = false;

    error: string = '';

    @cart.Getter getCart!: IPizzaCartItem[];
    private id: string | undefined = this.$store.state.route.params.index;
    @cart.Action private updateItem!: (item: IPizzaCartItem) => Promise<void>;

    private beforeMount() {
        let pizza = {} as IPizzaCartItem;

        for (let i = 0; i < this.getCart.length; i++) {
            if (this.getCart[i].id === this.id!) {
                pizza = this.getCart[i];
            }
        }

        this.pizza = {
            id: pizza.id,
            name: pizza.name,
            crust: pizza.crust,
            pizzaSize: pizza.pizzaSize,
            cutStyle: pizza.cutStyle,
            ingredients: [],
            amount: pizza.amount
        };

        pizza.ingredients.forEach(x => this.pizza.ingredients.push(
                {
                    count: x.count,
                    template: x.template,
                    details: x.details
                }
        ));
    }

    private updatePizza() {
        // @ts-ignore
        if (this.creationValidation()) {
            if (!this.getCart.some(x => x.id === this.id!)) {
                this.error = 'This item does not exist anymore';
                this.showError = true;
            } else {
                this.btnLoad = true;

                const pizzaUpdate: IPizzaEdit = {
                    id: this.pizza.id,
                    crustId: this.pizza.crust.id,
                    pizzaSizeId: this.pizza.pizzaSize.id,
                    cutStyleId: this.pizza.cutStyle.id,
                    itemsOnPizza: this.pizza.ingredients.map(x => {
                        return {
                            ingredientId: x.details.id,
                            quantity: x.count
                        };
                    })
                };

                PizzaApi.editPizzaWithIngredients(this.pizza.id, pizzaUpdate)
                    .then(async() => {
                        this.updateItem(this.pizza)
                            .then(async() => {
                                this.btnLoad = false;
                                await this.$router.push({ name: 'root', params: { locale: this.$i18n.locale } });
                            });
                    })
                    .catch(err => {
                        this.error = err.toString();
                        this.dialog = true;
                        this.btnLoad = false;
                    });
            }
        }
    }
}
</script>

<style scoped>
    .custom-font {
        font-family: 'Open Sans', sans-serif;
        font-family: 'Oxygen', sans-serif;
    }

    .margin-b {
        margin-bottom: 80px !important;
    }

    .margin-b-lang-break {
        margin-bottom: 120px !important;
    }
</style>

