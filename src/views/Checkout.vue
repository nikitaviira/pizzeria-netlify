<template>
    <v-container grid-list-xl :fluid="$vuetify.breakpoint.xlOnly">
        <v-layout
                v-bind="binding"
                class="mt-5"
                :class="screenHeight <= 420 ? '' : (!langChangeBreakPoint ? 'margin-b' : 'margin-b-lang-break')"
        >
            <v-flex xs6 xl5 :offset-xs1="$vuetify.breakpoint.xlOnly">
                <v-card class="elevation-5">

                    <v-toolbar flat dense class="primary" dark>
                        <v-toolbar-title class="font-weight-bold">
                            {{ $t('delivery.deliveryInfo') }}
                        </v-toolbar-title>
                        <v-icon class="ml-1">mdi-map-marker</v-icon>
                    </v-toolbar>

                    <div class="pa-4">
                        <v-form v-model="isFormValid" class="pa-4 pt-6">
                            <v-text-field
                                    v-model="order.deliveryInfo.street"
                                    height="5"
                                    :rules="[rules.required]"
                                    clearable
                                    outlined
                                    maxlength="75"
                                    class="required"
                                    :label="$t('delivery.street')"
                            ></v-text-field>
                            <v-text-field
                                    v-model="order.deliveryInfo.apartmentNumber"
                                    clearable
                                    maxlength="25"
                                    outlined
                                    :label="$t('delivery.apartmentNumber') + $t('delivery.optional')"
                            ></v-text-field>
                            <v-text-field
                                    v-model="order.deliveryInfo.postCode"
                                    :rules="[rules.required, rules.numberMatch]"
                                    error-count="2"
                                    clearable
                                    maxlength="5"
                                    outlined
                                    class="required"
                                    :label="$t('delivery.postCode')"
                            ></v-text-field>
                            <v-text-field
                                    v-model="order.deliveryInfo.town"
                                    :rules="[rules.required]"
                                    maxlength="75"
                                    clearable
                                    outlined
                                    class="required"
                                    :label="$t('delivery.town')"
                            ></v-text-field>
                            <v-text-field
                                    v-model="order.deliveryInfo.phoneNumber"
                                    :rules="[rules.telephoneMatch, rules.required]"
                                    error-count="2"
                                    maxlength="30"
                                    clearable
                                    outlined
                                    class="required"
                                    :label="$t('delivery.phoneNumber')"
                            ></v-text-field>
                            <v-textarea
                                    v-model="order.deliveryInfo.orderNotes"
                                    outlined
                                    maxlength="150"
                                    row-height="25"
                                    counter
                                    :label="$t('delivery.orderNotes') + $t('delivery.optional')"
                                    auto-grow
                            ></v-textarea>
                        </v-form>
                    </div>
                </v-card>
            </v-flex>
            <v-flex xs6 xl5>
                <v-card class="elevation-5">
                    <v-toolbar flat dense class="primary" dark>
                        <v-toolbar-title class=" font-weight-bold">
                            {{ $t('delivery.yourOrder') }}
                        </v-toolbar-title>
                    </v-toolbar>

                    <v-simple-table v-if="getCartLength > 0">
                        <template v-slot:default>
                            <thead>
                                <tr style="background: #faf3f3;">
                                    <th class="text-left text-uppercase">{{ $t('delivery.item') }}</th>
                                    <th class="text-left text-uppercase">{{ $t('price') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(cartItem, i) in getCart" :key="i">
                                <td class="table-text-color text-left" style="line-height: 25px;">
                                    <b>{{ $t(cartItem.name) }}</b>
                                    <b class="pizza-amount-counter"> ×{{ cartItem.amount }}</b>
                                    <ul>
                                        <li>
                                            <b>{{ $t('size') }}:</b>
                                            {{ `${cartItem.pizzaSize[titleLocale]} (${cartItem.pizzaSize.diameter})` }}
                                        </li>
                                        <li>
                                            <b>{{ $t('crust') }}:</b>
                                            {{cartItem.crust[titleLocale]}}
                                        </li>
                                        <li>
                                            <b>{{ $t('cut') }}:</b>
                                            {{cartItem.cutStyle[titleLocale]}}
                                        </li>
                                    </ul>
                                </td>
                                <td class="table-text-color text-left font-weight-bold">
                                    {{ getItemPrice(cartItem) }}
                                </td>
                            </tr>
                            <tr style="background: #faf3f3;">
                                <td class="text-uppercase font-weight-bold text-left table-text-color">
                                    {{ $t('delivery.deliveryPrice') }}
                                </td>
                                <td class="font-weight-bold table-text-color text-left">€3.50</td>
                            </tr>
                            <tr style="background: #faf3f3;">
                                <td class="text-uppercase font-weight-bold text-left table-text-color">
                                    {{ $t('total') }}
                                </td>
                                <td
                                        style="color: #1976d2"
                                        class="font-weight-bold text-left"
                                >
                                    {{ getCartTotalPrice(true) }}
                                </td>
                            </tr>
                            </tbody>
                        </template>
                    </v-simple-table>
                    <v-list v-else>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title class="font-weight-bold">
                                    {{ $t('noItemsInCart') }}
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-card>
                <v-card class="elevation-5 mt-5">
                    <v-toolbar flat dense class="primary" dark>
                        <v-toolbar-title class=" font-weight-bold">
                            {{ $t('delivery.payment') }}
                        </v-toolbar-title>
                        <v-icon class="ml-2">mdi-credit-card</v-icon>
                    </v-toolbar>

                    <v-radio-group v-model="order.paymentMethod" column>
                        <v-radio
                                :ripple="false"
                                class="pa-3"
                                :label="$t('delivery.cash')"
                                value="cash"
                        ></v-radio>
                        <v-list v-if="order.paymentMethod === 'cash'">
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title class="font-weight-bold ml-7 table-text-color">
                                        {{ $t('delivery.cashPayment') }}.
                                    </v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                        <hr>
                        <v-radio
                                :ripple="false"
                                class="pa-3"
                                :label="$t('delivery.card')"
                                value="card"
                        />
                        <v-list v-if="order.paymentMethod === 'card'">
                            <v-list-item>
                                <v-img
                                        max-height="200"
                                        max-width="200"
                                        eager
                                        :src="require(`@/assets/credit-cards.png`)"
                                />
                            </v-list-item>
                        </v-list>
                    </v-radio-group>

                    <v-btn
                            @click="orderSubmit()"
                            class="mb-5"
                            color="primary"
                    >
                        {{ $t('delivery.confirmOrder') }}
                    </v-btn>
                </v-card>
            </v-flex>
        </v-layout>
        <v-dialog
                style="background: white !important"
                width="500"
                persistent
                v-model="showCardForm"
        >
            <v-card>
                <v-credit-card @change="creditInfoChanged" />
                <v-card-actions>
                    <v-btn
                            :small="$vuetify.breakpoint.xsOnly"
                            color="primary"
                            @click="orderCreate()"
                    >
                        {{ $t('delivery.confirmOrder') }}
                    </v-btn>
                    <v-btn
                            :small="$vuetify.breakpoint.xsOnly"
                            color="red"
                            @click="showCardForm = false"
                            class="white--text"
                    >
                        {{ $t('cancel') }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
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
        <v-dialog
                persistent
                v-model="showSuccessMsg"
                width="500"
        >
            <v-alert
                    style="margin-bottom: 0;"
                    class="font-weight-bold"
                    type="success"
                    icon="mdi-checkbox-marked-circle"
            >
                {{ $t('delivery.success') }}
            </v-alert>
        </v-dialog>
        <v-overlay
                absolute
                opacity="0.6"
                :value="paymentLoad"
        >
            <v-progress-circular
                    width="6"
                    indeterminate
                    color="primary"
                    size="64"
            ></v-progress-circular>
        </v-overlay>
    </v-container>
</template>

<script lang="ts">
import {Component, Mixins, Watch} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import IPizzaCartItem from '@/domain/IPizzaCartItem';
import IOrder from '@/domain/IOrder';
import MoneyCounter from '@/mixins/MoneyCounter';
import ScreenBreakPointsControl from '@/mixins/ScreenBreakPointsControl';
import OrderAPI from '@/services/api/OrderAPI';
import rules from '@/services/ValidationRules';
// @ts-ignore
import VCreditCard from 'v-credit-card';

const cart = namespace('cart');

@Component({
    components: {
        'delivery-form': () => import('@/components/Form.vue'),
        VCreditCard
    }
})
export default class Checkout extends Mixins(ScreenBreakPointsControl, MoneyCounter) {
    @cart.Getter private getCartLength!: number;

    private get rules() {
        return rules;
    }

    private get titleLocale(): string {
        return this.$i18n.locale === 'ru' ? 'nameRu' : 'name';
    }

    private creditInfoChanged(values: { [key: string]: string }): void {
        this.creditCardInfoFilled = Object.keys(values).every(x => !!values[x]);
    }

    @cart.Getter getCart!: IPizzaCartItem[];
    private order: IOrder = {
        paymentMethod: 'card',
        orderItems: [],
        deliveryInfo: {
            street: '',
            apartmentNumber: '',
            postCode: '',
            town: '',
            phoneNumber: '',
            orderNotes: ''
        }
    };

    private isFormValid: boolean = false;
    private showCardForm: boolean = false;
    private dialog: boolean = false;
    private showSuccessMsg: boolean = false;
    private paymentLoad: boolean = false;
    private creditCardInfoFilled: boolean = false;

    private validationErrorLocale: string = '';
    private error: string = '';
    @cart.Action private removeAll!: () => Promise<void>;

    @Watch('getCartLength')
    private async redirectIfEmpty(updt: number) {
        if (updt === 0) {
            await this.$router.push({ name: 'root', params: { locale: this.$i18n.locale } });
        }
    }

    private beforeMount(): void {
        this.order.orderItems = this.getCart.map(x => {
            return {
                pizzaId: x.id,
                quantity: x.amount
            };
        });
    }

    private async orderCreate(): Promise<void> {
        if (this.creditCardInfoFilled || this.order.paymentMethod === 'cash') {
            this.paymentLoad = true;
            this.showCardForm = false;

            await OrderAPI.createOrder(this.order)
                .then(() => {
                    this.paymentLoad = false;
                    this.showSuccessMsg = true;

                    setTimeout(() => {
                        this.removeAll()
                            .then(() => {
                                this.$router.push({ name: 'root', params: { locale: this.$i18n.locale } });
                            });
                    }, 2000);
                })
                .catch(err => {
                    this.dialog = true;
                    this.error = err.toString();
                });
        } else {
            this.dialog = true;
            this.validationErrorLocale = 'errors.fillAllFields';
        }
    }

    private orderSubmit(): void {
        if (this.isFormValid) {
            if (this.order.orderItems.length > 0) {
                if (this.order.paymentMethod === 'cash') {
                    this.orderCreate();
                }
                if (this.order.paymentMethod === 'card') {
                    this.showCardForm = true;
                }
            } else {
                this.validationErrorLocale = 'errors.emptyCart';
                this.dialog = true;
            }
         } else {
             this.validationErrorLocale = 'errors.fillDeliveryInfo';
             this.dialog = true;
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

    .theme--light.v-data-table tbody tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
        background: none;
    }

    .table-text-color {
        color: rgba(0,0,0,.6) !important;
    }

    .pizza-amount-counter {
        font-size: 1rem;
        color: #1976d2;
    }

    .order-table-background {
        background: #faf3f3;
    }
</style>
