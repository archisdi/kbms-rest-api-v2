import * as Joi from '@hapi/joi';
import { IObject } from 'src/typings/common';
import { HttpError } from 'tymon';
import { COMMON_ERRORS } from './constant';

export enum SCHEMA {
    LOGIN = 'login',
    REFRESH = 'refresh',
    CREATE_POST = 'create_post',
    UPDATE_POST = 'update_post',
    DASHBOARD_BIRTHDAY = 'dashboard_birthday',
    MEMBER_LIST = 'member_list'
}

export const COMMON_SCHEME = {
    PAGINATION: Joi.object({
        page: Joi.number().integer().positive().default(1).optional(),
        per_page: Joi.number().integer().positive().default(10).optional(),
        sort: Joi.string().optional().default('-created_at')
    })
};

const VALID_MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const schemas: IObject<Joi.ObjectSchema> = {
    [SCHEMA.LOGIN]: Joi.object({
        body: Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required()
        }).required()
    }),
    [SCHEMA.REFRESH]: Joi.object({
        body: Joi.object({
            refresh_token: Joi.string().required()
        }).required()
    }),
    [SCHEMA.CREATE_POST]: Joi.object({
        body: Joi.object({
            title: Joi.string().min(4).max(50).required(),
            content: Joi.string().min(10).required()
        }).required()
    }),
    [SCHEMA.UPDATE_POST]: Joi.object({
        body: Joi.object({
            title: Joi.string().min(4).max(50).optional(),
            content: Joi.string().min(10).optional()
        }).required(),
        params: Joi.object({
            id: Joi.string().required()
        }).required()
    }),
    [SCHEMA.DASHBOARD_BIRTHDAY]: Joi.object({
        query: Joi.object({
            month: Joi.number().positive().integer().valid(VALID_MONTHS).required(),
            day: Joi.number().positive().integer().allow(null)
        }).required()
    }),
    [SCHEMA.MEMBER_LIST]: Joi.object({
        query: Joi.object({
            page: Joi.number().integer().positive().default(1).optional(),
            per_page: Joi.number().integer().positive().default(10).optional(),
            sort: Joi.string().optional().default('-created_at'),
            name: Joi.string().allow(null, ''),
            class_of: Joi.number().integer().positive().allow(null, ''),
            is_alumni: Joi.boolean().allow(null, ''),
            faculty_id: Joi.string().allow(null, ''),
            major_id: Joi.string().allow(null, '')
        }).required()
    })
};

const defaultOptions: IObject = {
    stripUnknown: {
        arrays: false,
        objects: true
    },
    abortEarly: false
};

export const SchemeValidator = (input: IObject, scheme: Joi.ObjectSchema, options: IObject = defaultOptions): any => {
    return Joi.validate(input, scheme, options).catch((err): void => {
        const details = err.details.reduce((detail: any, item: any): IObject => {
            detail[item.context.key] = item.message.replace(/"/g, '');
            return detail;
        }, {});
        throw new HttpError.HttpError({
            message: 'error validating fields',
            http_status: 422,
            name: COMMON_ERRORS.VALIDATION_ERROR,
            data: details
        });
    });
};

export const ValidatorFactory = (input: IObject, schema: SCHEMA, options: IObject = defaultOptions): any => {
    const scheme: Joi.ObjectSchema = schemas[schema];
    return SchemeValidator(input, scheme, defaultOptions);
};

export default ValidatorFactory;
