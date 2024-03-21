import { Global, Module } from "@nestjs/common";
import { SendEmailService } from "src/common/serviece/send-email-serviexe";

@Global()           
@Module({
    controllers: [],
    providers: [SendEmailService],
    exports:[SendEmailService]
})
export class CommonModule {}