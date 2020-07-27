import { FacultyModel, FacultyProps } from '../models/faculty_model';
import SQLRepo from './base/sql_repository';

export default class FacultyRepository extends SQLRepo<FacultyModel, FacultyProps> {
    public constructor() {
        super(FacultyModel);
    }

    public async countDistinctMembers(): Promise<{ id: string; name: string; count: number; }[]> {
        const db = SQLRepo.getInstance();
        return db.model.Faculty.findAll({
            attributes: ['id', 'name', [db.ORMProvider.Sequelize.fn('COUNT', db.ORMProvider.Sequelize.col('majors.id')), 'count']],
            include: [{
                model: db.model.Major,
                as: 'majors',
                attributes: [],
                include: [{
                    model: db.model.Member,
                    attributes: []
                }]
            }],
            group: ['Faculty.id']
        }) as any;
    }
}
