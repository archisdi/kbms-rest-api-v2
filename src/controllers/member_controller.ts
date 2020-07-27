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

    public async memberCreate(data: IData, context: IContext): Promise<any> {
        const { body } = data;

        const member = MemberModel.create(body);
        await member.validate();
        await member.save();

        return member.toJson();
    }

    public async memberUpdate(data: IData, context: IContext): Promise<any> {
        const { body, params: { id } } = data;

        const member = await new MemberRepository().findOneWithIdOrNim(id);
        if (!member)
            throw HttpError.NotFoundError('MEMBER_NOT_FOUND');

        await member.update(body);
        await member.validate();
        await member.save();

        return member.toJson();
    }

    public async memberDelete(data: IData, context: IContext): Promise<any> {
        const { body, params: { id } } = data;

        const member = await new MemberRepository().findOneWithIdOrNim(id);
        if (!member)
            throw HttpError.NotFoundError('MEMBER_NOT_FOUND');

        await member.delete();

        return;
    }

    public setRoutes(): void {
        this.addRoute('get', '/', this.memberList, { validate: SCHEMA.MEMBER_LIST });
        this.addRoute('post', '/', this.memberCreate);
        this.addRoute('get', '/:id', this.memberDetail);
        this.addRoute('put', '/:id', this.memberUpdate);
        this.addRoute('delete', '/:id', this.memberDelete);
    }
}

export default MemberController;
