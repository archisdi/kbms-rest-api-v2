import * as Joi from '@hapi/joi';
import { BaseProps } from 'src/typings/common';
import RepoFactory from '../repositories';
import { SchemeValidator } from '../utils/validator';
import { BaseModel } from './base/base_model';
import { FacultyProps } from './faculty_model';

export interface MajorProps extends BaseProps {
    faculty_id: string;
    name: string;

    faculty?: FacultyProps;
}

export class MajorModel extends BaseModel<MajorProps> {
    public constructor(props: MajorProps) {
        super(props);
    }

    public static modelName = 'Major';

    public static fillable = ['id', 'faculty_id', 'name'];

    public static repo = RepoFactory.getSql<MajorModel, MajorProps>(MajorModel);

    public static buildFromSql(data: MajorProps): MajorModel {
        return new MajorModel({
            id: data.id,
            faculty_id: data.faculty_id,
            name: data.name,
            created_at: data.created_at,
            updated_at: data.updated_at,
            deleted_at: data.deleted_at,
            faculty: data.faculty
        });
    }

    public static create(data: MajorProps): MajorModel {
        return new MajorModel(data);
    }

    public async save(): Promise<void> {
        await MajorModel.repo.upsert({ id: this.id }, this.toJson({ removeTimestamps: true }));
    }

    public async validate(): Promise<void> {
        const payload = this.toJson();
        const validationScheme = Joi.object({
            faculty_id: Joi.string().required(),
            name: Joi.string().min(5).required(),
        });
        await SchemeValidator(payload, validationScheme);
    }
}

export default MajorModel;
