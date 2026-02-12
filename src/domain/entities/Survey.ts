export type WaterTempRating = 'too_cold' | 'perfect' | 'too_hot';

export interface SurveyProps {
    id: string;
    clientId: string;
    appointmentId: string;
    npsScore: number;
    waterTempRating: WaterTempRating;
    afterFeeling: string;
    comments?: string;
    createdAt: Date;
}

export class Survey {
    private constructor(private readonly props: SurveyProps) { }

    static create(props: SurveyProps): Survey {
        if (props.npsScore < 0 || props.npsScore > 10) {
            throw new Error('NPS score must be between 0 and 10');
        }
        return new Survey({ ...props });
    }

    get id() { return this.props.id; }
    get clientId() { return this.props.clientId; }
    get appointmentId() { return this.props.appointmentId; }
    get npsScore() { return this.props.npsScore; }
    get waterTempRating() { return this.props.waterTempRating; }
    get afterFeeling() { return this.props.afterFeeling; }
    get comments() { return this.props.comments; }
    get createdAt() { return this.props.createdAt; }

    get isPromoter(): boolean { return this.props.npsScore >= 9; }
    get isDetractor(): boolean { return this.props.npsScore <= 6; }
    get isPassive(): boolean { return !this.isPromoter && !this.isDetractor; }

    toJSON(): SurveyProps {
        return { ...this.props };
    }
}
