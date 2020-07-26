import { MemberModel, MemberProperties } from '../models/member_model';
import SQLRepo from './base/sql_repository';

export default class MemberRepository extends SQLRepo<MemberModel, MemberProperties> {
    public constructor() {
        super(MemberModel);
    }

    public async findOneWithIdOrNim(id: string): Promise<MemberModel | null> {
        const db = SQLRepo.getInstance();
        const Op = db.ORMProvider.Op;

        const props = await db.model[this.modelName].findOne({
            where: {
                [Op.or]: [
                    { id },
                    { nim: id }
                ]
            },
            include: [
                { model: db.model.Major, as: 'major', required: true, include: [{ model: db.model.Faculty, as: 'faculty', required: true }]}
            ]
        });

        return props ? this.build(props) : null;
    }
}
