import { Container } from "inversify";
import getDecorators from "inversify-inject-decorators";


export const container: Container = new Container();

export const inject = getDecorators(container).lazyInject;

export { injectable } from "inversify";
