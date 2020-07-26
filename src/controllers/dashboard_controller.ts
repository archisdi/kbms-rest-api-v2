import JwtMiddleware from '../middlewares/jwt_auth';
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

        const members = await MemberService.getBirthdays(query.month, query.day);

        return {
            members: members.map(m => m.toJson())
        };
    }

    public setRoutes(): void {
        this.addRoute('get', '/birthday', this.birthdays, { validate: SCHEMA.DASHBOARD_BIRTHDAY });
    }
}

export default DashboardController;
