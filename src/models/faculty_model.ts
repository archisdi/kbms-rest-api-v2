import * as Joi from '@hapi/joi';
import { BaseProps } from 'src/typings/common';
import RepoFactory from '../repositories';
import { SchemeValidator } from '../utils/validator';
import { BaseModel } from './base/base_model';

export interface FacultyProps extends BaseProps {
    name: string;
}

export class FacultyModel extends BaseModel<FacultyProps> {
    public constructor(props: FacultyProps) {
        super(props);
    }

    public static modelName = 'Faculty';

    public static repo = RepoFactory.getSql<FacultyModel, FacultyProps>(FacultyModel);

    public static buildFromSql(data: FacultyProps): FacultyModel {
        return new FacultyModel({
            id: data.id,
            name: data.name,
            created_at: data.created_at,
            updated_at: data.updated_at,
            deleted_at: data.deleted_at
        });
    }

    public static create(data: FacultyProps): FacultyModel {
        return new FacultyModel(data);
    }

    public async save(): Promise<void> {
        await FacultyModel.repo.upsert({ id: this.id }, this.toJson({ removeTimestamps: true }));
    }

    public async validate(): Promise<void> {
        const payload = this.toJson();
        const validationScheme = Joi.object({
            name: Joi.string().min(5).required(),
        });
        await SchemeValidator(payload, validationScheme);
    }
}

export default FacultyModel;
