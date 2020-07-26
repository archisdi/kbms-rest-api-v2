import { DBContext } from 'tymon';
import MemberModel from '../../models/member_model';
import BaseService from './base/service';

class MemberService extends BaseService {
    public static async getBirthdays({ month, day }: { month: number, day?: number }): Promise<MemberModel[]> {
        const Seq = DBContext.getInstance().ORMProvider;
        const conditions: any = {};
        conditions[Seq.Op.and] = [];

        if (month) {
            conditions[Seq.Op.and].push(Seq.where(Seq.fn('MONTH', Seq.col('birthdate')), String(month)));
        }

        if (day) {
            conditions[Seq.Op.and].push(Seq.where(Seq.fn('DAY', Seq.col('birthdate')), String(day)));
        }

        return MemberModel.repo.findAll(conditions as any, {});
    }

    public static generatePaginateQuery(query: any): any {
        const Op = DBContext.getInstance().ORMProvider.Op;
        const conditions = [];

        if (query.name) {
            conditions.push({
                [Op.or]: [
                    { name: { [Op.like]: `%${query.name}%` } },
                    { nim: { [Op.like]: `%${query.name}%` } },
                ]
            });
        }

        if (typeof query.is_alumni === 'boolean') {
            conditions.push({
                is_alumni: query.is_alumni
            });
        }

        if (query.class_of) {
            conditions.push({
                class_of: query.class_of
            });
        }

        if (query.major_id) {
            conditions.push({
                major_id: query.major_id
            });
        }

        if (query.faculty_id) {
            conditions.push({
                faculty_id: query.faculty_id
            });
        }

        return conditions;
    }
}

export default MemberService;
