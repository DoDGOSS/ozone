import * as React from "react";

import { Position, Tooltip } from "@blueprintjs/core";


export type NavbarTooltipProps = {
    title: string;
    shortcut?: string;
    description: string;

    children?: any;
}


export class NavbarTooltip extends React.PureComponent<NavbarTooltipProps> {

    public render() {
        const { children, title, shortcut, description } = this.props;

        const content = (
            <div className="nav-tooltip">
                <div className="nav-tooltip-header">
                    <span className="nav-tooltip-title">{title}</span>
                    {shortcut && (<span className="nav-tooltip-shortcut">({shortcut})</span>)}
                </div>
                <div className="nav-tooltip-description">{description}</div>
            </div>
        );

        return (
            <Tooltip position={Position.BOTTOM}
                     content={content}>
                {children}
            </Tooltip>
        )
    }

}
