import { Container } from "inversify";
import getDecorators from "inversify-inject-decorators";

export const container: Container = new Container();

export const lazyInject = getDecorators(container).lazyInject;

export { inject, injectable } from "inversify";

export const TYPES = {
    Gateway: Symbol("Gateway")
};
