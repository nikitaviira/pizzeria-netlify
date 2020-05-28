<template>
    <page-layout pictureName="review" localeTitle="reviews.picTitle">
        <template v-slot:content>
            <v-flex :offset-xs1="$vuetify.breakpoint.xlOnly" xl10>
                <v-card
                        v-if="dataLoaded"
                        v-for="review in currentReviews"
                        class="mx-auto overflow-hidden mt-5"
                        :class="$vuetify.breakpoint.xlOnly ? 'xl-review-width' : 'lg-and-down-review-width'"
                >
                    <v-card-title class="align-start">
                        <div>
                            <span class="headline text-left">{{ review.username }}</span>
                            <div class="grey--text font-weight-light text-left">
                                {{ new Date(review.createdAt).toLocaleDateString() }}
                            </div>
                        </div>
                    </v-card-title>
                    <v-divider color="grey" />
                    <v-card-actions>
                        <span class="pl-2 grey--text text--darken-2 font-weight-light subtitle">
                            {{ $t('reviews.rating') }}
                        </span>
                        <span class="pl-2 grey--text text--darken-2 font-weight-light subtitle">
                            ({{ review.rating }})
                        </span>
                        <v-rating v-model="review.rating" readonly />
                    </v-card-actions>
                    <div
                            :class="$vuetify.breakpoint.mdAndDown ? 'caption' : 'body-1'"
                            class="pa-4 pt-0 text-left"
                    >
                        <em>
                            {{ review.message.length === 0 ? '-' : review.message }}
                        </em>
                    </div>
                </v-card>
                <v-row
                        v-if="!dataLoaded"
                        class="fill-height ma-0"
                        align="center"
                        justify="center"
                >
                    <v-progress-circular
                            indeterminate
                            size="70"
                            width="6"
                            color="primary"
                    ></v-progress-circular>
                </v-row>
                <div class="text-center">
                    <v-container>
                        <v-row justify="center">
                            <v-col cols="8">
                                <v-container class="max-width">
                                    <v-pagination
                                            v-model="pageNumber"
                                            :length="totalPagesCount"
                                    />
                                </v-container>
                            </v-col>
                        </v-row>
                    </v-container>
                </div>
            </v-flex>
        </template>
    </page-layout>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator';
import IReview from '@/domain/IReview';
import OrderAPI from '@/services/api/OrderAPI';

@Component({
    components: {
        'page-layout': () => import('@/components/DefaultPageLayout.vue')
    }
})
export default class Reviews extends Vue {
    private currentReviews: IReview[] = [];

    private totalCount: number = 3;
    private pageNumber: number = 1;

    private dataLoaded: boolean = false;
    private error: string = '';

    private beforeMount(): void {
        this.getReviews(this.pageNumber);
    }

    @Watch('pageNumber')
    private nextPage(page: number) {
        this.getReviews(page);
        window.scrollTo({top: 200, behavior: 'smooth'});
    }

    private get totalPagesCount(): number {
        return Math.ceil(this.totalCount / 3);
    }

    private getReviews(page: number) {
        this.dataLoaded = false;
        OrderAPI.getReviewsPerPage(this.pageNumber)
            .then(resp => {
                this.dataLoaded = true;
                this.totalCount = resp.data.total;
                this.currentReviews = resp.data.reviews;
            })
            .catch(err => {
                this.dataLoaded = true;
                this.error = err.toString();
            });
    }
}
</script>

<style scoped>
    .margin-b {
        margin-bottom: 40px !important;
    }

    .margin-b-lang-break {
        margin-bottom: 80px !important;
    }

    .lg-and-down-review-width {
        max-width: 650px !important;
    }

    .xl-review-width {
        max-width: 750px !important;
    }
</style>
