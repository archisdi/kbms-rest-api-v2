import { MemberModel, MemberProperties } from '../models/member_model';
import { IPagination, QueryOptions } from '../typings/common';
import { offset, sorter } from '../utils/helpers';
import SQLRepo from './base/sql_repository';

export default class MemberRepository extends SQLRepo<MemberModel, MemberProperties> {
    public constructor() {
        super(MemberModel);
    }

    public async paginateDetailed(
        conditions: Partial<MemberProperties>,
        { page = 1, per_page = 10, sort = '-created_at', attributes }: QueryOptions
    ): Promise<{ data: MemberModel[]; meta: IPagination }> {
        const order = sorter(sort);
        const db = SQLRepo.getInstance();
        return db.model[this.modelName]
            .findAndCountAll({
                where: conditions as any,
                attributes,
                limit: per_page,
                offset: offset(page, per_page),
                order: [order as any],
                include: [
                    { model: db.model.Major, as: 'major' }
                ]
            })
            .then(({ rows, count }): { data: MemberModel[]; meta: IPagination } => ({
                data: this.buildMany(rows),
                meta: { page, per_page, total_page: Math.ceil(count / per_page), total_data: count }
            }));
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
