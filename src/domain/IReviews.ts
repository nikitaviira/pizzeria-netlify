import IReview from '@/domain/IReview';

export default interface IReviews {
    reviews: IReview[];
    total: number;
}
