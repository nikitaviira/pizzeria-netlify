<template>
    <v-card class="elevation-5">
        <v-img
                :max-height="$vuetify.breakpoint.xlOnly ? 400 : 350"
                :position="position"
                aspect-ratio="1"
                :lazy-src="require(`@/assets/shit-${pictureName}.jpg`)"
                :src="$vuetify.breakpoint.xsOnly
                    ? require(`@/assets/${pictureName}-cropped.jpg`)
                    : require(`@/assets/${pictureName}.jpg`)"
        >
            <v-row
                    align="center"
                    class="white--text pa-2 fill-height"
            >
                <v-col style="background: #00000099">
                    <slot></slot>
                </v-col>
            </v-row>
            <template v-slot:placeholder>
                <v-row
                        class="fill-height ma-0"
                        align="center"
                        justify="center"
                >
                    <v-progress-circular
                            indeterminate
                            size="70"
                            color="primary lighten-5"
                    >
                    </v-progress-circular>
                </v-row>
            </template>
        </v-img>
    </v-card>
</template>

<script lang="ts">
    import { Component, Vue, Prop } from 'vue-property-decorator';

    @Component
    export default class MainPictureCard extends Vue {
        @Prop(String) private readonly pictureName!: string;
        @Prop(String) private readonly position!: string;
    }
</script>

<style scoped>

</style>
