import * as Joi from '@hapi/joi';
import * as moment from 'moment';
import { BaseProps } from 'src/typings/common';
import { DBContext, HttpError } from 'tymon';
import RepoFactory from '../factories/repository';
import { toTitleCase } from '../utils/helpers';
import { SchemeValidator } from '../utils/validator';
import { BaseModel } from './base/base_model';
import MajorModel, { MajorProps } from './major_model';

export interface MemberProperties extends BaseProps {
    major_id: string;
    name: string;
    nim: string;
    class_of?: number | null;
    contact: string | null;
    birthplace: string | null;
    birthdate: string | null;
    bandung_address: string | null;
    origin_address: string | null;
    email: string | null;
    line_id: string | null;
    instagram: string | null;
    is_alumni: boolean;
    age?: number;
    major?: MajorProps;
}

export class MemberModel extends BaseModel<MemberProperties> {
    public constructor(props: MemberProperties) {
        super(props);
        if (props.birthdate)
            this.props.age = moment().diff(props.birthdate, 'years');
        this.props.class_of = parseInt(`20${props.nim.charAt(4)}${props.nim.charAt(5)}`);
        this.props.name = toTitleCase(props.name);
        this.props.is_alumni = props.is_alumni || false;
    }

    public static modelName = 'Member';

    public static repo = RepoFactory.getSql<MemberModel, MemberProperties>(MemberModel);

    public static create(data: any): MemberModel {
        return new MemberModel({
            id: this.generateId(),
            ...data
        });
    }

    public static buildFromSql(data: MemberProperties): MemberModel {
        return new MemberModel({
            id: data.id,
            major_id: data.major_id,
            name: data.name,
            nim: data.nim,
            class_of: data.class_of,
            contact: data.contact,
            birthplace: data.birthplace,
            birthdate: data.birthdate,
            bandung_address: data.bandung_address,
            origin_address: data.origin_address,
            email: data.email,
            line_id: data.line_id,
            instagram: data.instagram,
            is_alumni: data.is_alumni,
            created_at: data.created_at,
            updated_at: data.updated_at,
            deleted_at: data.deleted_at,
            major: data.major
        });
    }

    public async save(): Promise<void> {
        await MemberModel.repo.upsert({ id: this.id }, this.toJson());
    }

    public async delete(): Promise<void> {
        await MemberModel.repo.delete({ id: this.id });
    }

    public async validate(): Promise<void> {
        const Op = DBContext.getInstance().ORMProvider.Op;
        const payload = this.toJson();

        /** check all scheme */
        await SchemeValidator(payload, Joi.object({
            name: Joi.string().min(5).required(),
            nim: Joi.string().min(9).max(10).regex(/^[0-9]*$/).required(),
            major_id: Joi.string().required(),
            contact: Joi.string().regex(/^\d{7,20}$/).required(),
            birthplace: Joi.string().required(),
            birthdate: Joi.date().required(),
            bandung_address: Joi.string().max(255).required(),
            origin_address: Joi.string().max(255).required(),
            email: Joi.string().email().required(),
            line_id: Joi.string().allow('').allow(null),
            instagram: Joi.string().allow('').allow(null),
            is_alumni: Joi.boolean().default(false)
        }));

        /** check nim */
        const nimExsist = await MemberModel.repo.findOne({
            nim: this.nim,
            id: { [Op.not]: this.id } as any
        });
        if (nimExsist)
            throw HttpError.UnprocessableEntityError('', 'NIM_EXSIST');

        /** check major id */
        const major = await MajorModel.repo.findById(this.props.major_id);
        if (!major)
            throw HttpError.UnprocessableEntityError('', 'MAJOR_NOT_FOUND');
    }

    public get name(): string {
        return this.props.name;
    }

    public get nim(): string {
        return this.props.nim;
    }

    public get class_of(): number | null | undefined {
        return this.props.class_of;
    }

    public get is_alumni(): boolean {
        return this.props.is_alumni;
    }

    public get major_name(): string {
        return this.props.major?.name || '-';
    }

    public get faculty_name(): string {
        return this.props.major?.faculty?.name || '-';
    }

    public get contact(): string | null {
        return this.props.contact;
    }

    public get birthplace(): string | null {
        return this.props.birthplace;
    }

    public get birthdate(): string | null {
        return this.props.birthdate;
    }

    public get bandung_address(): string | null {
        return this.props.bandung_address;
    }

    public get origin_address(): string | null {
        return this.props.origin_address;
    }

    public get email(): string | null {
        return this.props.email;
    }

    public get line_id(): string | null {
        return this.props.line_id;
    }

    public get instagram(): string | null {
        return this.props.instagram;
    }

    public get age(): number | null {
        return this.props.age || null;
    }

}

export default MemberModel;
