import { EventingService, eventingService as eventingServiceDefault } from "./EventingService";

export class WidgetLauncherService {

    private readonly eventingService: EventingService;

    constructor(eventingService?: EventingService) {
        this.eventingService = eventingService || eventingServiceDefault;
    }

}
