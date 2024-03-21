import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule , CommonModule, userModule} from './modules';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nest-app-dev'),
    AuthModule, CommonModule, userModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
