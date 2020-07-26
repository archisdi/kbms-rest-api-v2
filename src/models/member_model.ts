import * as moment from 'moment';
import { BaseProps } from 'src/typings/common';
import RepoFactory from '../factories/repository';
import { BaseModel } from './base/base_model';
import { MajorProps } from './major_model';

export interface MemberProperties extends BaseProps {
    major_id: string;
    name: string;
    nim: string;
    class_of: number | null;
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
        if (props.birthdate) {
            this.props.age = moment().diff(props.birthdate, 'years');
        }
    }

    public static modelName = 'Member';

    public static repo = RepoFactory.getSql<MemberModel, MemberProperties>(MemberModel);

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
        return MemberModel.repo.upsert({ id: this.id }, this.toJson());
    }

    public get name(): string {
        return this.props.name;
    }

    public get nim(): string {
        return this.props.nim;
    }

    public get class_of(): number | null {
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
