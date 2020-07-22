import { BaseProps } from 'src/typings/common';
import RepoFactory from '../repositories';
import { BaseModel } from './base/base_model';

export interface ConfigurationProps extends BaseProps {
    key: string;
    value: string;
    unit: string;
}

export class ConfigurationModel extends BaseModel<ConfigurationProps> {
    public constructor(props: ConfigurationProps) {
        super(props);
    }

    public static modelName = 'Configuration';

    public static repo = RepoFactory.getSql<ConfigurationModel, ConfigurationProps>(ConfigurationModel);

    public static buildFromSql(data: ConfigurationProps): ConfigurationModel {
        return new ConfigurationModel({
            id: data.id,
            key: data.key,
            value: data.value,
            unit: data.unit,
            created_at: data.created_at,
            updated_at: data.updated_at,
            deleted_at: data.deleted_at
        });
    }

    public static create(data: ConfigurationProps): ConfigurationModel {
        return new ConfigurationModel(data);
    }

    public async save(): Promise<void> {
        await ConfigurationModel.repo.upsert({ id: this.id }, this.toJson({ removeTimestamps: true }));
    }

}

export default ConfigurationModel;
