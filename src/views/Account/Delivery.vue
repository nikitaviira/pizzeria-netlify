<template>
    <page-layout pictureName="delivery" localeTitle="deliveryService.picSubTitle">
        <template v-slot:subText>
            <div
                    :class="$vuetify.breakpoint.xlOnly ? 'display-1' : 'title'"
                    class="system-ui-font"
            >
                {{ $t('deliveryService.picSubTitle') }}
            </div>
        </template>
        <template v-slot:content>
            <v-flex xs6 xl5 :offset-xs1="$vuetify.breakpoint.xlOnly">
                <v-card class="elevation-5">
                    <v-toolbar flat dense class="primary" dark>
                        <v-toolbar-title class="font-weight-bold">
                            {{ $t('deliveryService.browseAvailable') }}
                        </v-toolbar-title>
                        <v-btn
                                class="mx-2"
                                fab
                                dark
                                medium
                                absolute
                                right
                                middle
                                small
                                color="white"
                                v-if="showNonAssigned"
                                @click="getNonAssigned()"
                        >
                            <v-icon dark color="primary">mdi-refresh</v-icon>
                        </v-btn>
                    </v-toolbar>

                    <v-container
                            style="max-height: 450px; overscroll-behavior-y: contain;"
                            class="overflow-y-auto"
                            v-if="showNonAssigned"
                    >
                        <v-row
                                v-if="!nonAssignedLoaded"
                                class="fill-height pa-12"
                                align="center"
                                justify="center"
                        >
                            <v-progress-circular
                                    width="6"
                                    indeterminate
                                    color="primary"
                                    size="64"
                            ></v-progress-circular>
                        </v-row>

                        <v-list v-if="nonAssignedDeliveries.length === 0 && nonAssignedLoaded">
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title class="font-weight-bold table-text-color">
                                        {{ $t('deliveryService.noDeliveries') }}
                                    </v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>

                        <v-row v-else dense>
                            <v-col
                                    v-if="nonAssignedLoaded"
                                    v-for="(delivery, i) in nonAssignedDeliveries"
                                    :key="delivery.id"
                                    cols="12"
                            >
                                <v-card
                                        color="#2141dc"
                                        dark
                                >
                                    <div class="d-flex flex-no-wrap justify-space-between">
                                        <div>
                                            <v-card-title v-text="delivery.orderNumber"></v-card-title>

                                            <v-card-text class="text--primary">
                                                <div class="float-left white--text">
                                                    {{ $t('deliveryService.createdAt') }}
                                                    <b>{{ new Date(delivery.createdAt).toLocaleString() }}</b>
                                                </div>
                                            </v-card-text>

                                            <br>

                                            <v-card-actions>
                                                <v-btn
                                                        color="green"
                                                        @click="showSelectedDeliveryInfo(i*1)"
                                                        class="font-weight-bold"
                                                >
                                                    {{ $t('deliveryService.details') }}
                                                </v-btn>
                                                <v-btn
                                                        color="primary"
                                                        @click="toogleAssigment(delivery.id)"
                                                        class="font-weight-bold"
                                                >
                                                    {{ $t('deliveryService.take') }}
                                                </v-btn>
                                            </v-card-actions>
                                        </div>
                                    </div>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-container>
                    <v-btn
                            v-if="!showNonAssigned"
                            @click="getNonAssigned()"
                            class="ma-5"
                            color="primary"
                    >
                        {{ $t('deliveryService.showAvailable') }}
                    </v-btn>
                </v-card>
            </v-flex>
            <v-flex xs6 xl5>
                <v-card class="elevation-5">
                    <v-toolbar flat dense class="primary" dark>
                        <v-toolbar-title class=" font-weight-bold">
                            {{ $t('deliveryService.myDeliveries') }}
                        </v-toolbar-title>
                    </v-toolbar>

                    <v-row
                            v-if="!assignedLoaded"
                            class="fill-height pa-12"
                            align="center"
                            justify="center"
                    >
                        <v-progress-circular
                                width="6"
                                indeterminate
                                color="primary"
                                size="64"
                        ></v-progress-circular>
                    </v-row>

                    <v-list v-if="assignedDeliveries.length === 0 && assignedLoaded">
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title class="font-weight-bold table-text-color">
                                    {{ $t('deliveryService.notTaken') }}
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>

                    <v-container
                            v-else
                            style="max-height: 450px; overscroll-behavior-y: contain;"
                            class="overflow-y-auto"
                    >
                        <v-row dense>
                            <v-col
                                    v-for="(delivery, i) in assignedDeliveries"
                                    :key="i"
                                    cols="12"
                            >
                                <v-card color="#2141dc" dark>
                                    <div class="d-flex flex-no-wrap justify-space-between">
                                        <div>
                                            <v-card-title v-text="delivery.orderNumber"></v-card-title>

                                            <v-card-text class="text--primary">
                                                <div class="float-left white--text">
                                                    {{ $t('deliveryService.assignedAt') }}
                                                    <b>{{ new Date(delivery.assignedAt).toLocaleString() }}</b>
                                                </div>
                                                <br>
                                                <div class="float-left white--text">
                                                    {{ $t('deliveryService.transport') }}
                                                    <b>{{ delivery.deliveryType }}</b>
                                                </div>
                                            </v-card-text>

                                            <br>

                                            <v-card-actions>
                                                <v-btn
                                                        color="green"
                                                        @click="showSelectedDeliveryInfo(i*1, true)"
                                                        class="font-weight-bold"
                                                >
                                                    {{ $t('deliveryService.details') }}
                                                </v-btn>
                                                <v-btn
                                                        color="red"
                                                        @click="cancelAssigment(delivery.id)"
                                                        class="font-weight-bold"
                                                >
                                                    {{ $t('cancel') }}
                                                </v-btn>
                                            </v-card-actions>
                                            <v-card-actions>
                                                <v-btn
                                                        color="primary"
                                                        @click="markAsFinished(delivery.id)"
                                                        class="font-weight-bold"
                                                >
                                                    {{ $t('deliveryService.markFinished') }}
                                                </v-btn>
                                            </v-card-actions>
                                        </div>
                                    </div>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card>
            </v-flex>
        </template>
        <template v-slot:alerts>
            <v-dialog
                    style="background: white !important"
                    width="500"
                    v-model="showSelected"
            >
                <v-card>
                    <v-list>
                        <v-list-item>
                            <v-list-item-title>
                                <b>{{ $t('deliveryService.delDetails') }}</b>
                            </v-list-item-title>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-title>
                                {{ $t('deliveryService.street') }}
                            </v-list-item-title>
                            <v-list-item-subtitle>
                                {{ currentSelected.street }}
                            </v-list-item-subtitle>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-title>
                                {{ $t('deliveryService.apartment') }}
                            </v-list-item-title>
                            <v-list-item-subtitle>
                                {{ currentSelected.apartmentNumber }}
                            </v-list-item-subtitle>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-title>
                                {{ $t('deliveryService.city') }}
                            </v-list-item-title>
                            <v-list-item-subtitle>
                                {{ currentSelected.town }}
                            </v-list-item-subtitle>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-title>
                                {{ $t('deliveryService.phone') }}
                            </v-list-item-title>
                            <v-list-item-subtitle>
                                {{ currentSelected.phoneNumber }}
                            </v-list-item-subtitle>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-title>
                                {{ $t('deliveryService.order') }}
                            </v-list-item-title>
                            <v-list-item-subtitle style="white-space: normal;">
                                {{ currentSelected.orderNotes }}
                            </v-list-item-subtitle>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-dialog>
            <v-dialog
                    style="background: white !important"
                    width="500"
                    v-model="showAssigmentMenu"
            >
                <v-card>
                    <div class="pa-4">
                        <v-form>
                            <v-select
                                    v-model="deliveryEdit.deliveryTypeId"
                                    :items="deliveryTypes"
                                    outlined
                                    :rules="[v => !!v || $t('fieldRequired')]"
                                    item-text="name"
                                    item-value="id"
                                    :label="$t('deliveryService.choose')"
                            ></v-select>

                            <v-btn
                                    color="primary"
                                    class="font-weight-bold"
                                    @click="assignDeliveryToUser()"
                            >
                                {{ $t('deliveryService.takeOrder') }}
                            </v-btn>
                        </v-form>
                    </div>
                </v-card>
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
        </template>
    </page-layout>
</template>

<script lang="ts">
import {Component, Mixins} from 'vue-property-decorator';
import {AxiosResponse} from 'axios';
import IDeliveryAssigned from '@/domain/IDeliveryAssigned';
import IIDeliveryNotAssigned from '@/domain/IIDeliveryNotAssigned';
import IDeliveryType from '@/domain/IDeliveryType';
import IDeliveryEdit from '@/domain/IDeliveryEdit';
import ScreenBreakPointsControl from '@/mixins/ScreenBreakPointsControl';
import DeliveryAPI from '@/services/api/DeliveryAPI';

@Component({
    components: {
        'page-layout': () => import('@/components/DefaultPageLayout.vue')
    }
})
export default class Delivery extends Mixins(ScreenBreakPointsControl) {

    private assignedDeliveries: IDeliveryAssigned[] = [];
    private nonAssignedDeliveries: IIDeliveryNotAssigned[] = [];
    private deliveryTypes: IDeliveryType[] = [];
    private currentSelected: IDeliveryAssigned | IIDeliveryNotAssigned = {} as any;
    private deliveryEdit: IDeliveryEdit = {
        id: '',
        deliveryTypeId: ''
    };

    private assignedLoaded: boolean = false;
    private nonAssignedLoaded: boolean = false;

    private showSelected: boolean = false;
    private showError: boolean = false;
    private showNonAssigned: boolean = false;
    private showAssigmentMenu: boolean = false;

    private error: string = '';

    private created(): void {
        this.getAssigned();
        this.getDeliveryTypes();
    }

    private async getDeliveryTypes(): Promise<void> {
        await DeliveryAPI.getAllDeliveryTypes()
                .then(resp => {
                    this.deliveryTypes = resp.data;
                    this.deliveryEdit.deliveryTypeId = this.deliveryTypes[0].id;
                })
                .catch(err => {
                    this.showError = true;
                    this.error = err.toString();
                });
    }

    private async getAssigned(): Promise<void> {
        this.assignedLoaded = false;
        this.assignedDeliveries = [];

        await DeliveryAPI.getAllAssignedToUserDeliveries()
                .then(resp => {
                    this.assignedLoaded = true;
                    this.assignedDeliveries = resp.data;
                })
                .catch(err => {
                    this.assignedLoaded = true;
                    this.showError = true;
                    this.error = err.toString();
                });
    }

    private async getNonAssigned(): Promise<void> {
        this.nonAssignedLoaded = false;
        this.showNonAssigned = true;
        this.nonAssignedDeliveries = [];

        await DeliveryAPI.getAllNonAssignedDeliveries()
                .then(resp => {
                    this.nonAssignedLoaded = true;
                    this.nonAssignedDeliveries = resp.data;
                })
                .catch(err => {
                    this.nonAssignedLoaded = true;
                    this.showError = true;
                    this.error = err.toString();
                });

    }

    private showSelectedDeliveryInfo(index: number, assigned?: boolean) {
        this.showSelected = true;
        if (assigned) {
            this.currentSelected = this.assignedDeliveries[index];
        } else {
            this.currentSelected = this.nonAssignedDeliveries[index];
        }
    }

    private toogleAssigment(deliveryId: string): void {
        this.showAssigmentMenu = true;
        this.deliveryEdit.id = deliveryId;
    }

    private async assignDeliveryToUser(): Promise<void> {
        this.showAssigmentMenu = false;

        await DeliveryAPI.assignUserToDelivery(this.deliveryEdit.id, this.deliveryEdit)
                .then(async() => {
                    await this.getAssigned();
                    await this.getNonAssigned();
                })
                .catch(err => {
                    this.showError = true;
                    this.error = err.toString();
                });
    }

    private cancelAssigment(id: string): void {
        this.refreshDeliveries(DeliveryAPI.removeUserFromDelivery(id));
    }

    private markAsFinished(id: string): void {
        this.refreshDeliveries(DeliveryAPI.markDeliveryAsFinished(id));
    }

    private async refreshDeliveries(funcResponse: Promise<AxiosResponse<any>>): Promise<void> {
        await funcResponse
                .then(async() => {
                    await this.getAssigned();
                    if (this.showNonAssigned) {
                        await this.getNonAssigned();
                    }
                })
                .catch(err => {
                    this.showError = true;
                    this.error = err.toString();
                });
    }
}
</script>


<style scoped>
    .margin-b {
        margin-bottom: 80px !important;
    }

    .margin-b-lang-break {
        margin-bottom: 120px !important;
    }

    .table-text-color {
        color: rgba(0,0,0,.6) !important;
    }

    .custom-font {
        font-family: 'Open Sans', sans-serif;
        font-family: 'Oxygen', sans-serif;
    }
</style>
