import { IPagination } from 'src/typings/common';
import { MemberModel } from '../models/member_model';

class MemberTransformer {
    public static MemberList(members: MemberModel[], pagination: IPagination): any {
        return {
            content: members.map((member): any => ({
                id: member.id,
                name: member.name,
                nim: member.nim,
                class_of: member.class_of,
                is_alumni: member.is_alumni,
                created_at: member.created_at
            })),
            pagination
        };
    }

    public static MemberDetail(member: MemberModel): any {
        return {
            id: member.id,
            nim: member.nim,
            name: member.name,
            class_of: member.class_of,
            is_alumni: member.is_alumni,
            contact: member.contact,
            birthplace: member.birthplace,
            birthdate: member.birthdate,
            bandung_address: member.bandung_address,
            origin_address: member.origin_address,
            email: member.email,
            line_id: member.line_id,
            instagram: member.instagram,
            major_name: member.major_name,
            faculty_name: member.faculty_name
        };
    }
}

export default MemberTransformer;
