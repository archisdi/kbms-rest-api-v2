import JwtMiddleware from '../middlewares/jwt_auth';
import FacultyModel from '../models/faculty_model';
import MajorModel from '../models/major_model';
import MemberModel from '../models/member_model';
import MemberService from '../services/base/member_service';
import { IContext, IData } from '../typings/common';
import { SCHEMA } from '../utils/validator';
import BaseController from './base/base_controller';

class DashboardController extends BaseController {
    public constructor() {
        super({
            path: '/dashboard',
            middleware: JwtMiddleware()
        });
    }

    public async birthdays(data: IData, context: IContext): Promise<any> {
        const { query } = data;

        const members = await MemberService.getBirthdays(query);
        const normalized = members.map(m => {
            const props = m.toJson();
            return {
                name: props.name,
                birthdate: props.birthdate
            };
        });

        return {
            members: normalized
        };
    }

    public async counter(data: IData, context: IContext): Promise<any> {
        const [memberCount, facultyCount, majorCount] = await Promise.all([
            MemberModel.repo.count({}),
            FacultyModel.repo.count({}),
            MajorModel.repo.count({})
        ]);

        return {
            members: memberCount,
            faculties: facultyCount,
            majors: majorCount
        };
    }

    public setRoutes(): void {
        this.addRoute('get', '/birthday', this.birthdays, { validate: SCHEMA.DASHBOARD_BIRTHDAY });
        this.addRoute('get', '/counter', this.counter, { cache: true });
    }
}

export default DashboardController;
