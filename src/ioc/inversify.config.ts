import "reflect-metadata";
import { Container } from "inversify";
import { Layout, Setup } from "../api/dashboard";
import { DockerDashboard, BoardLayout } from "../dockerdashboard";
import { WidgetFactory } from "../widgets/widgetfactory";
import { Widget } from "../widgets/widget";
import { HomeWidget } from "../widgets/homewidget";
import { HelpWidget } from "../widgets/helpwidget";
import { ContainerWidget } from "../widgets/containerwidget";
import { ImageWidget } from "../widgets/imagewidget";
import { NetworkWidget } from "../widgets/networkwidget";
import { VolumeWidget } from "../widgets/volumewideget";

const ioc = new Container({ autoBindInjectable: true });

const TYPES = {
    Layout: Symbol.for("Layout")
};

ioc.bind<DockerDashboard>("DockerDashboard").to(DockerDashboard).inSingletonScope();
const boardLayout = new BoardLayout();
ioc.bind<Layout>("Layout").toConstantValue(boardLayout);
ioc.bind<Setup>("Setup").toConstantValue(boardLayout);
ioc.bind<WidgetFactory>("WidgetFactory").to(WidgetFactory).inSingletonScope();

// all widgets register
ioc.bind<Widget>("Widget").to(HomeWidget);
ioc.bind<Widget>("Widget").to(ContainerWidget);
ioc.bind<Widget>("Widget").to(ImageWidget);
ioc.bind<Widget>("Widget").to(NetworkWidget);
ioc.bind<Widget>("Widget").to(VolumeWidget);
ioc.bind<Widget>("Widget").to(HelpWidget);

// ioc.bind<Layout>(TYPES.Layout).to(Screen);

export { ioc, TYPES };