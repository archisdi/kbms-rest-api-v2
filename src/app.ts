import { DBContext, RedisContext } from 'tymon';
import BaseApp from './base_app';
import AuthController from './controllers/auth_controller';
import DashboardController from './controllers/dashboard_controller';
import ProfileController from './controllers/profile_controller';
import FacultyModel from './models/faculty_model';
import MajorModel from './models/major_model';

class App extends BaseApp {
    public constructor(port: number) {
        super(port);
    }

    public setControllers(): void {
        this.addController(AuthController);
        this.addController(ProfileController);
        this.addController(DashboardController);
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
