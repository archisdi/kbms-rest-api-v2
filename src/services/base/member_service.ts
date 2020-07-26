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
}

export default MemberService;
