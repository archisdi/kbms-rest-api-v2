import { DBContext, RedisContext } from 'tymon';
import BaseApp from './base_app';
import AuthController from './controllers/auth_controller';
import ProfileController from './controllers/profile_controller';
import MajorModel from './models/major_model';
import FacultyModel from './models/faculty_model';

class App extends BaseApp {
    public constructor(port: number) {
        super(port);
    }

    public setControllers(): void {
        /** Register Controller */
        this.addController(AuthController);
        this.addController(ProfileController);

        /** Register Auto Generated Crud Controller */
        this.addControllerFromModel(MajorModel);
        this.addControllerFromModel(FacultyModel);

    }

    public setSingletonModules(): void {
        DBContext.initialize({
            connection_string: String(process.env.DB_CONNECTION_STRING),
            models_path: '/database/models'
        });
        RedisContext.initialize({
            connection_string: String(process.env.REDIS_CONNECTION_STRING)
        });
    }
}

export default App;
