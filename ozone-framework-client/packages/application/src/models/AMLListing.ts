export class AMLListingTypeProps {
    title: string;

    constructor(props: PropertiesOf<AMLListingTypeProps>) {
        Object.assign(this, props);
    }
}

export class AMLIconProps {
    id?: number;
    url: string;
    security_marking: string;

    constructor(props: PropertiesOf<AMLIconProps>) {
        Object.assign(this, props);
    }
}

export class AMLListingProps {
    id?: number;
    small_icon?: AMLIcon;
    large_icon?: AMLIcon;
    banner_icon?: AMLIcon;
    large_banner_icon?: AMLIcon;
    listing_type: AMLListingType;
    title: string;
    description: string;
    launch_url: string;
    version_name: string;
    unique_name: string;
    description_short?: string;
    is_enabled: boolean;
    is_deleted: boolean;
    security_marking: string;
    is_private?: boolean;
    usage_requirements: string;
    system_requirements: string;
    required_listings?: any;

    constructor(props: PropertiesOf<AMLListingProps>) {
        Object.assign(this, props);
    }
}

export class AMLListingType extends AMLListingTypeProps {}
export class AMLIcon extends AMLIconProps {}
export class AMLListing extends AMLListingProps {}
