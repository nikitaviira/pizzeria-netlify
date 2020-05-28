<template>
    <v-container grid-list-xl>
        <v-layout row class="mt-5">
            <v-flex :offset-xs1="$vuetify.breakpoint.xlOnly" xl10>
                <picture-card position="bottom" pictureName="shopping-cart">
                    <div
                            :class="fontSize"
                            class="font-weight-bold font-italic custom-font"
                    >
                        {{ $t('orderHistory.picTitle') }}
                    </div>
                    <div
                            :class="$vuetify.breakpoint.xlOnly ? 'display-1' : 'title'"
                            class="system-ui-font"
                    >
                        {{ $t('orderHistory.picSubTitle') }}
                    </div>
                </picture-card>
            </v-flex>
        </v-layout>

        <v-layout row class="mt-5">
            <v-flex :offset-xs1="$vuetify.breakpoint.xlOnly" xl10>
                <v-card class="elevation-5">

                    <v-toolbar flat dense class="primary" dark>
                        <v-toolbar-title class="font-weight-bold">
                            {{ $t('orderHistory.ongoing') }}
                        </v-toolbar-title>
                    </v-toolbar>

                    <v-data-table
                            mobile-breakpoint="735"
                            disable-sort
                            :headers="headers"
                            :items="currentOrders"
                            :loading="!currentLoaded"
                            hide-default-footer
                            :hide-default-header="screewWidth <= 715 || currentOrders.length === 0"
                            :no-data-text="$t('orderHistory.noOngoingText')"
                            :loading-text="$t('orderHistory.loadingText')"
                            class="elevation-1 data-table-scoll"
                    >
                        <template v-slot:item.createdAt="{ item }">
                            <span>{{ new Date(item.createdAt).toLocaleDateString() }}</span>
                        </template>

                        <template v-slot:item.paymentMethod="{ item }">
                            <span>{{ $t('orderHistory.' + item.paymentMethod) }}</span>
                        </template>

                        <template v-slot:item.action="{ item }">
                            <v-btn
                                    @click="assignedDeleted(item.id)"
                                    color="red"
                                    class="white--text"
                            >
                                {{ $t('cancel') }}
                            </v-btn>
                        </template>
                    </v-data-table>
                </v-card>
            </v-flex>
        </v-layout>

        <v-layout
                row
                :class="screenHeight <= 420 ? '' : (!langChangeBreakPoint ? 'margin-b' : 'margin-b-lang-break')"
        >
            <v-flex :offset-xs1="$vuetify.breakpoint.xlOnly" xl10>
                <v-card class="elevation-5 mt-5">

                    <v-toolbar flat dense class="primary" dark>
                        <v-toolbar-title class="font-weight-bold">
                            {{ $t('orderHistory.finished') }}
                        </v-toolbar-title>
                    </v-toolbar>

                    <v-data-table
                            mobile-breakpoint="735"
                            disable-sort
                            :headers="headers"
                            :items="finishedOrders"
                            :server-items-length="totalCount"
                            :items-per-page="3"
                            :options.sync="options"
                            :loading="!finishedLoaded"
                            :hide-default-header="screewWidth <= 715 || finishedOrders.length === 0"
                            :no-data-text="$t('orderHistory.noFinishedText')"
                            :loading-text="$t('orderHistory.loadingText')"
                            class="elevation-1 data-table-scoll"
                    >
                        <template v-slot:item.createdAt="{ item }">
                            <span>{{ new Date(item.createdAt).toLocaleDateString() }}</span>
                        </template>

                        <template v-slot:item.deliveryStatus="{ item }">
                            <span>{{ $t('orderHistory.delivered') }}</span>
                        </template>

                        <template v-slot:item.paymentMethod="{ item }">
                            <span>{{ $t('orderHistory.' + item.paymentMethod) }}</span>
                        </template>

                        <template v-slot:item.action="{ item }">
                            <v-btn
                                    @click="showReviewForm(item.id)"
                                    v-if="!item.hasReview"
                                    color="green"
                                    class="white--text"
                            >
                                {{ $t('orderHistory.feedback') }}
                            </v-btn>
                            <span v-else>{{ $t('orderHistory.reviewed') }}</span>
                        </template>
                    </v-data-table>
                </v-card>
            </v-flex>
        </v-layout>
        <v-dialog width="450" v-model="showReviewMenu">
            <v-card class="elevation-16 mx-auto">
                <v-card-title
                        class="headline"
                        primary-title
                >
                    {{ $t('orderHistory.rate') }}
                </v-card-title>
                <v-card-text>
                    <v-textarea
                            class="mt-2"
                            v-model="review.message"
                            outlined
                            maxlength="250"
                            row-height="25"
                            counter
                            :label="$t('orderHistory.describe')"
                            auto-grow
                    ></v-textarea>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <div>
                        <v-rating
                                :large="$vuetify.breakpoint.smAndUp"
                                v-model="review.rating"
                                color="yellow darken-3"
                                background-color="grey darken-1"
                                hover
                        />
                    </div>
                    <v-spacer></v-spacer>
                    <v-btn
                            color="primary"
                            :loading="btnLoad"
                            :disabled="btnLoad"
                            @click="createReview()"
                    >
                        {{ $t('orderHistory.rateBtn') }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog
                v-model="showReviewSuccess"
                width="500"
        >
            <v-alert
                    v-model="showReviewSuccess"
                    dismissible
                    style="margin-bottom: 0;"
                    class="font-weight-bold"
                    type="success"
                    icon="mdi-checkbox-marked-circle"
            >
                {{ $t('orderHistory.thanks') }}
            </v-alert>
        </v-dialog>
        <v-dialog
                v-model="showOrderDelete"
                width="500"
        >
            <v-alert
                    v-model="showOrderDelete"
                    dismissible
                    style="margin-bottom: 0;"
                    class="font-weight-bold"
                    type="error"
                    icon="mdi-alert"
            >
                {{ $t('orderHistory.assureDelete') }}
                <v-btn
                        color="white"
                        :loading="btnLoad"
                        :disabled="btnLoad"
                        class="red--text mt-2"
                        @click="deleteOrder(orderToDeletedId)"
                >
                    {{ $t('orderHistory.delete') }}
                </v-btn>
            </v-alert>
        </v-dialog>
        <v-dialog
                v-model="showError"
                width="500"
        >
            <v-alert
                    style="margin-bottom: 0;"
                    v-model="showError"
                    dismissible
                    class="font-weight-bold"
                    type="error"
                    icon="mdi-alert">
                {{ error }}
            </v-alert>
        </v-dialog>
    </v-container>
</template>

<script lang="ts">
import {Component, Mixins, Watch} from 'vue-property-decorator';
import IUserOrder from '@/domain/IUserOrder';
import OrderAPI from '@/services/api/OrderAPI';
import ScreenBreakPointsControl from '@/mixins/ScreenBreakPointsControl';
import IReviewCreate from '@/domain/IReviewCreate';
import { i18n } from '@/plugins/i18n';

@Component({
    components: {
        'picture-card': () => import('@/components/cards/MainPictureCard.vue')
    }
})
export default class OrderHistory extends Mixins(ScreenBreakPointsControl) {

    private currentOrders: IUserOrder[] = [];
    private finishedOrders: IUserOrder[] = [];

    private review: IReviewCreate = { rating: 1 } as IReviewCreate;

    private currentLoaded: boolean = false;
    private showReviewMenu: boolean = false;
    private btnLoad: boolean = false;
    private showOrderDelete: boolean = false;
    private finishedLoaded: boolean = false;
    private showReviewSuccess: boolean = false;
    private showError: boolean = false;

    private orderToDeletedId: string = '';
    private error: string = '';

    private totalCount: number = 0;
    private options: any = {};

    private get headers(): object[] {
        return [
            { text: i18n.tc('orderHistory.number'), align: 'start', value: 'orderNumber' },
            { text: i18n.tc('orderHistory.status'), value: 'orderStatus' },
            { text: i18n.tc('orderHistory.delivery'), value: 'deliveryStatus' },
            { text: i18n.tc('orderHistory.total'), value: 'moneyAmount' },
            { text: i18n.tc('orderHistory.payment'), value: 'paymentMethod' },
            { text: i18n.tc('orderHistory.date'), value: 'createdAt' },
            { text: i18n.tc('orderHistory.actions'), value: 'action' },
        ];
    }

    @Watch('options')
    private async changePage(): Promise<void> {
        await this.getFinishedOrders();
    }

    private async created(): Promise<void> {
        await this.getFinishedOrders();
        await this.getUnfinishedOrders();
    }

    private async getFinishedOrders(): Promise<void> {
        const { page } = this.options;
        this.finishedLoaded = false;

        await OrderAPI.getAllUserFinishedOrders(page ? page : 1)
            .then(resp => {
                this.finishedLoaded = true;
                this.finishedOrders = resp.data;
                if (resp.data.length > 0) {
                    this.totalCount = resp.data[0].totalCount;
                }
            })
            .catch(err => {
                this.showError = true;
                this.error = err.toString();
            });
    }

    private async getUnfinishedOrders(): Promise<void> {
        this.currentLoaded = false;

        await OrderAPI.getAllUserUnfinishedOrders()
            .then(resp => {
                this.currentLoaded = true;
                this.currentOrders = resp.data;
            })
            .catch(err => {
                this.showError = true;
                this.error = err.toString();
            });
    }

    private async deleteOrder(id: string): Promise<void> {
        this.btnLoad = true;

        await OrderAPI.deleteOrder(id)
            .then(() => {
                this.removeOrderFromOrderList(id);
                this.btnLoad = false;
                this.showOrderDelete = false;
            })
            .catch(err => {
                this.showOrderDelete = false;
                this.showError = true;
                this.error = err.toString();
            });
    }

    private async createReview(): Promise<void> {
        this.btnLoad = true;

        await OrderAPI.createReview(this.review)
            .then(() => {
                this.markOrderReviewFinished();
                this.review = { rating: 1 } as IReviewCreate;

                this.showReviewSuccess = true;
                this.btnLoad = false;
                this.showReviewMenu = false;
            })
            .catch(err => {
                this.showError = true;
                this.error = err.toString();
            });
    }

    private removeOrderFromOrderList(id: string): void {
        for (let i = 0; i < this.currentOrders.length; i++) {
            if (this.currentOrders[i].id === id) {
                this.currentOrders.splice(i, 1);
                break;
            }
        }
    }

    private markOrderReviewFinished(): void {
        for (const finishedOrder of this.finishedOrders) {
            if (finishedOrder.id === this.review.orderId) {
                finishedOrder.hasReview = true;
                break;
            }
        }
    }

    private assignedDeleted(id: string): void {
        this.showOrderDelete = true;
        this.orderToDeletedId = id;
    }

    private showReviewForm(id: string): void {
        this.showReviewMenu = true;
        this.review.orderId = id;
    }
}
</script>

<style scoped>
    .custom-font {
        font-family: 'Open Sans', sans-serif;
        font-family: 'Oxygen', sans-serif;
    }

    .margin-b {
        margin-bottom: 90px !important;
    }

    .margin-b-lang-break {
        margin-bottom: 120px !important;
    }

    .table-text-color {
        color: rgba(0,0,0,.6) !important;
    }

    .order-table-background {
        background: #faf3f3;
    }

    .data-table-scoll {
        max-height: 400px !important;
        overflow-y: auto !important;
        overscroll-behavior-y: contain !important;
    }
</style>
