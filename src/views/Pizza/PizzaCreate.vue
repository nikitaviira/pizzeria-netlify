<template>
    <page-layout pictureName="pizza-main-1" localeTitle="customizationMenuText">
        <template v-slot:subText>
            <div
                    :class="$vuetify.breakpoint.xlOnly ? 'display-1' : 'title'"
                    class="system-ui-font"
            >
                {{ $t('customizationSubText') }}
            </div>
        </template>
        <template v-slot:content>
            <v-flex xs6 xl5 :offset-xs1="$vuetify.breakpoint.xlOnly">
                <v-card class="elevation-5">
                    <v-toolbar flat dense class="primary" dark>
                        <v-toolbar-title class=" font-weight-bold">
                            {{ $t('ingredients') }}
                        </v-toolbar-title>
                    </v-toolbar>
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
                        <v-tab-item v-for="category in ['Veggies','Meats','Cheeses','Sauces','Other']">
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

                    <v-toolbar flat dense class="primary" dark>
                        <v-toolbar-title class=" font-weight-bold">
                            {{ $t('parameters') }}
                        </v-toolbar-title>
                    </v-toolbar>

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

                    <div class="pa-4">
                        <pizza-parameter-form
                                btnIcon="mdi-cart-plus"
                                :btnLoad.sync="btnLoad"
                                :btnText="$t('submitPizzaCreate')"
                                @submit-form="addPizzaToCart()"
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
import {Component, Mixins} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import ICrust from '@/domain/ICrust';
import IPizzaSize from '@/domain/IPizzaSize';
import ICutStyle from '@/domain/ICutStyle';
import IPizzaCartItem from '@/domain/IPizzaCartItem';
import IIngredient from '@/domain/IIngredient';
import IPizzaCreate from '@/domain/IPizzaCreate';
import PizzaApi from '@/services/api/PizzaAPI';
import MoneyCounter from '@/mixins/MoneyCounter';

const cart = namespace('cart');

@Component({
    components: {
        'ingredientsCard': () => import('@/components/cards/IngredientsCard.vue'),
        'page-layout': () => import('@/components/DefaultPageLayout.vue'),
        'pizza-parameter-form': () => import('@/components/Form.vue'),
    }
})
export default class PizzaCreate extends Mixins(MoneyCounter) {

    private get titleLocale(): string {
        return this.$i18n.locale === 'ru' ? 'nameRu' : 'name';
    }
    pizza: IPizzaCartItem = {
        id: '',
        name: 'createYourOwn',
        crust: {} as ICrust,
        pizzaSize: {} as IPizzaSize,
        cutStyle: {} as ICutStyle,
        ingredients: [],
        amount: 1
    };

    dialog: boolean = false;
    btnLoad: boolean = false;

    error: string = '';

    private crusts: ICrust[] = [];
    private pizzaSizes: IPizzaSize[] = [];
    private cutStyles: ICutStyle[] = [];
    private overlay: boolean = false;
    private dataLoaded: boolean = false;
    private validationErrorLocale: string = '';

    private tab: any = null;
    private template: string | undefined = this.$store.state.route.params.template;

    @cart.Action
    private addItem!: (item: IPizzaCartItem) => Promise<void>;

    creationValidation() {
        if (this.pizza.ingredients.length >= 2) {
            if (this.pizza.ingredients.some(x => x.details.ingredientType === 'Sauces')) {
                return true;
            } else {
                this.dialog = true;
                this.validationErrorLocale = 'errors.noSauceError';
            }
        } else {
            this.dialog = true;
            this.validationErrorLocale = 'errors.moreThanFourIngredientsError';
        }

        return false;
    }

    private beforeCreate(): void {
        window.scrollTo(0, 0);
    }

    private async created(): Promise<void> {
        await PizzaApi.getPizzaParameters()
                .then(resp => {
                    this.cutStyles = resp.data.cutStyles as ICutStyle[];
                    this.crusts = resp.data.crusts as ICrust[];
                    this.pizzaSizes = resp.data.pizzaSizes as IPizzaSize[];

                    if (!this.$store.state.route.params.index) {
                        this.pizza.crust = this.crusts[0];
                        this.pizza.cutStyle = this.cutStyles[0];
                        this.pizza.pizzaSize = this.pizzaSizes[0];
                    }

                    this.dataLoaded = !this.template;
                })
                .catch(err => {
                    this.dataLoaded = true;
                    this.dialog = true;
                    this.error = err.toString();
                });

        if (this.template) {
            this.overlay = true;

            await PizzaApi.getTemplateIngredients(this.template)
                    .then(resp => {
                        this.dataLoaded = true;

                        this.pizza.ingredients = resp.data;
                        this.pizza.ingredients.forEach(x => x.template = true);

                        this.pizza.name = this.template!;
                    })
                    .catch(err => {
                        this.dataLoaded = true;
                        this.dialog = true;
                        this.error = err.toString();
                    });
        }
    }

    private getIngredientCount(id: string): number {
        for (const ingredient of this.pizza.ingredients) {
            if (ingredient.details.id === id) {
                return ingredient.count;
            }
        }

        return 0;
    }

    private addIngredient(item: IIngredient): void {
        for (const ingredient of this.pizza.ingredients) {
            if (ingredient.details.id === item.id) {
                if (ingredient.count < 3) {
                    ingredient.count += 1;
                }

                return;
            }
        }
        this.pizza.ingredients.push({ details: item, count: 1 });
    }

    private removeIngredient(id: string): void {
        for (const [i, ingredient] of this.pizza.ingredients.entries()) {
            if (ingredient.details.id === id) {
                if (ingredient.template && ingredient.count === 1) {
                    this.validationErrorLocale = 'errors.templateIngredientsError';
                    this.dialog = true;
                } else {
                    ingredient.count -= 1;
                    if (ingredient.count === 0) {
                        this.pizza.ingredients.splice(i, 1);
                    }
                }
                break;
            }
        }
    }

    private addPizzaToCart() {
        if (this.creationValidation()) {
            this.btnLoad = true;

            const pizzaCreate: IPizzaCreate = {
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

            PizzaApi.createPizzaWithIngredients(pizzaCreate)
                .then(async resp => {
                    this.pizza.id = resp.data.pizzaId;
                    this.addItem(this.pizza);
                    this.btnLoad = false;
                    await this.$router.push({ name: 'root', params: { locale: this.$i18n.locale } });
                })
                .catch(err => {
                    this.error = err.toString();
                    this.dialog = true;
                    this.btnLoad = false;
                });
        }
    }
}
</script>

<style scoped>
    .custom-font {
        font-family: 'Open Sans', sans-serif;
        font-family: 'Oxygen', sans-serif;
    }
</style>
