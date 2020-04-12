import { Container } from "inversify";
import { Startable } from "../api/dashboard";
import { DockerDashboard } from "../dockerdashboard";

const ioc = new Container();

ioc.bind<Startable>("Startable").to(DockerDashboard);

export { ioc };