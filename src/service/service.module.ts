import { HttpModule, Module } from "@nestjs/common";
import { GoogleApiService } from "./googleApi.service";
import { NfeAcreService } from "./nfeAcre.service";
import { Nodemailer } from "./nodemailer";

@Module({
    imports: [HttpModule],
    providers: [NfeAcreService, GoogleApiService, Nodemailer],
    exports: [NfeAcreService, GoogleApiService, Nodemailer]
})
export class ServiceModule { }