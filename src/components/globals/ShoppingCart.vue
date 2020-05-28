<template>
  <v-menu
          v-model="menu"
          :close-on-content-click="false"
          :nudge-width="200"
          width="200"
          bottom
          attach="#app"
          left
          offset-y
  >
    <template v-slot:activator="{ on }">
      <v-btn
              class="mx-3"
              slot="activator"
              v-on="on"
              fab
              small
              color="white">
        <v-badge
                :content="getCartLength"
                :value="getCartLength"
                color="green"
        >
          <v-icon dark color="primary">mdi-cart</v-icon>
        </v-badge>
      </v-btn>
    </template>

    <v-card>
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="font-weight-bold">{{ $t('myCartItems') }}</v-list-item-title>
            <v-list-item-subtitle>{{ $t('controlCart') }}</v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action v-if="getCartLength > 0">
            <v-tooltip
                    color="red"
                    left>
              <template v-slot:activator="{ on }">
                <v-btn
                        icon
                        @click="removeAllCartItems"
                        v-on="on">
                  <v-icon color="red">mdi-delete</v-icon>
                </v-btn>
              </template>
              <span class="white--text font-weight-bold">{{ $t('deleteAllItem') }}</span>
            </v-tooltip>
          </v-list-item-action>
        </v-list-item>
      </v-list>

      <v-divider style="border-color: black;" color="black"></v-divider>

      <v-list v-if="getCartLength === 0">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="font-weight-bold">{{ $t('noItemsInCart') }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-list v-else>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>{{ $t('total') }}: <b>{{ getCartTotalPrice() }}</b></v-list-item-title>
          </v-list-item-content>

          <v-list-item-action v-if="getCartLength > 0">
            <v-btn
                    small
                    color="primary"
                    @click="menu = false"
                    :to="$i18nRoute({ name: 'checkout' })"
            >
              {{ $t('checkout') }}
              <v-icon class="ml-2">mdi-credit-card-check</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>

        <v-divider style="border-color: black;" color="black"></v-divider>

        <div
                style="max-height: 320px; overscroll-behavior-y: contain;"
                class="overflow-y-auto"
        >
          <div
                  v-for="(cartItem, i) in getCart"
                  :key="i"
          >
            <v-list-item>
              <v-list-item-title><b>{{ $t(cartItem.name) }}</b></v-list-item-title>
              <v-list-item-action>
                <v-btn
                        small
                        icon
                        color="green"
                        @click="menu = false"
                        :to="$i18nRoute({ name: 'edit-pizza', params: { index: cartItem.id } })"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </v-list-item-action>
              <v-list-item-action>
                <v-btn
                        small
                        icon
                        color="red"
                        @click="removeItemFromCart(i)"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>{{ $t('crust') }}: </v-list-item-title>
              <v-list-item-subtitle>
                {{ cartItem.crust[titleLocale] }}
              </v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>{{ $t('size') }}: </v-list-item-title>
              <v-list-item-subtitle>
                {{ cartItem.pizzaSize[titleLocale] + ' (' + cartItem.pizzaSize.diameter + ')' }}
              </v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>{{ $t('cut') }}: </v-list-item-title>
              <v-list-item-subtitle>
                {{ cartItem.cutStyle[titleLocale] }}
              </v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>{{ $t('amountOfPizzas') }}: </v-list-item-title>
              <v-list-item-subtitle>
                {{ cartItem.amount }}
              </v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>{{ $t('price') }}: </v-list-item-title>
              <v-list-item-subtitle>
                {{ getItemPrice(cartItem) }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-group no-action>
              <template v-slot:activator>
                <v-list-item-title>{{ $t('ingredients') }}</v-list-item-title>
              </template>

              <v-list-item v-for="(ingredient, j) in cartItem.ingredients" :key="j">
                <v-list-item-title>{{ ingredient.details[titleLocale] }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ ingredient.count }}0 g.
                </v-list-item-subtitle>
              </v-list-item>

            </v-list-group>

            <v-divider color="grey" v-if="i + 1 !== getCartLength"></v-divider>
          </div>
        </div>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import {Component, Mixins} from 'vue-property-decorator';
import {namespace} from 'vuex-class';
import MoneyCounter from '@/mixins/MoneyCounter';

const cart = namespace('cart');

@Component
export default class ShoppingCart extends Mixins(MoneyCounter) {
    @cart.Getter private getCartLength!: number;
    @cart.Action private removeAll!: () => Promise<void>;
    @cart.Action private removeItem!: (index: number) => Promise<number>;

    private menu: boolean = false;

    private removeAllCartItems(): void {
        this.removeAll().then(() => { this.menu = false; });
    }

    private removeItemFromCart(index: number): void {
        this.removeItem(index).then(data => { if (data === 0) { this.menu = false; } });
    }

    private get titleLocale(): string {
        return this.$i18n.locale === 'ru' ? 'nameRu' : 'name';
    }

}
</script>

<style scoped>
  .v-btn:before {
    background-color: transparent;
  }
</style>
