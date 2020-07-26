import BaseController from './base/base_controller';
import JwtMiddleware from '../middlewares/jwt_auth';
import { IData, IContext } from '../typings/common';
import { SCHEMA } from '../utils/validator';
import MemberModel from '../models/member_model';
import MemberService from '../services/base/member_service';
import MemberTransformer from '../transformers/member_transformer';
import MemberRepository from '../repositories/member_repository';
import { HttpError } from 'tymon';

class MemberController extends BaseController {
    public constructor() {
        super({
            path: '/member',
            middleware: JwtMiddleware()
        });
    }

    public async memberList(data: IData, context: IContext): Promise<any> {
        const { query } = data;

        const conditions = MemberService.generatePaginateQuery(query);
        const { meta, data: members } = await MemberModel.repo.paginate(conditions, query);

        return MemberTransformer.MemberList(members, meta);
    }

    public async memberDetail(data: IData, context: IContext): Promise<any> {
        const { params: { id } } = data;

        const memberRepo = new MemberRepository();
        const member = await memberRepo.findOneWithIdOrNim(id);

        if (!member) {
            throw HttpError.NotFoundError('member not found', 'MEMBER_NOT_FOUND');
        }

        return MemberTransformer.MemberDetail(member);
    }

    public setRoutes(): void {
        this.addRoute('get', '/', this.memberList, { validate: SCHEMA.MEMBER_LIST });
        this.addRoute('get', '/:id', this.memberDetail);
    }
}

export default MemberController;
