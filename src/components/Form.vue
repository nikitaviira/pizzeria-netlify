<template>
    <v-form v-model="isFormValid">
        <slot></slot>
        <v-alert
                v-model="syncedShowError"
                dismissible
                dense
                class="font-weight-bold"
                type="error"
                icon="mdi-alert">
            {{ error }}
        </v-alert>
        <slot name="success-alert"></slot>
        <v-btn
                :loading="syncedBtnLoad"
                :disabled="syncedBtnLoad"
                :class="{'disable-events': !isFormValid}"
                class="v-btn v-btn--contained theme--light v-size--default primary mt-4 font-weight-regular"
                @click="submitForm"
        >
            {{ btnText }}
            <v-icon
                    v-if="!!btnIcon"
                    right
                    dark
            >
                {{ btnIcon }}
            </v-icon>
            <template v-slot:loader>
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </template>
        </v-btn>
    </v-form>
</template>

<script lang="ts">
import {Component, Vue, Emit, Prop, PropSync} from 'vue-property-decorator';

@Component
export default class Form extends Vue {
    @Prop(String) private readonly error!: string;
    @Prop(String) private readonly btnIcon!: string;
    @Prop(String) private readonly btnText!: string;

    @PropSync('showError', { type: Boolean }) private readonly syncedShowError!: boolean;
    @PropSync('btnLoad', { type: Boolean }) private readonly syncedBtnLoad!: boolean;

    private isFormValid: boolean = false;

    @Emit()
    private submitForm(): void {

    }
}
</script>

<style scoped>
    .disable-events {
        pointer-events: none
    }
</style>
