<template>
    <router-link :to="$i18nRoute({ name: link })">
        <v-tooltip
                color="white"
                top>
            <template v-slot:activator="{ on }">
                <v-btn
                        class="success accent-2"
                        light
                        v-on="on"
                        color="white"
                        fab
                        icon
                        medium
                        absolute
                        right
                        middle>
                    <v-icon>{{ icon }}</v-icon>
                </v-btn>
            </template>
            <span class="black--text">{{ tooltipText }}</span>
        </v-tooltip>
    </router-link>
</template>

<script lang="ts">
    import { Component, Vue, Prop } from 'vue-property-decorator';

    @Component
    export default class NavigationButton extends Vue {
        @Prop(String) private readonly link!: string;
        @Prop(String) private readonly icon!: string;
        @Prop(String) private readonly tooltipText!: string;
    }
</script>

<style scoped>

</style>
