import React from "react";
import { Button, Popover, Position } from "@blueprintjs/core";

import { useBehavior } from "../../../hooks";
import { authStore } from "../../../stores/AuthStore";
import { mainStore } from "../../../stores/MainStore";

import { NavbarTooltip } from "./NavbarTooltip";
import { UserMenu } from "./UserMenu";

const _UserMenuButton: React.FC = () => {
    const user = useBehavior(authStore.user);
    const displayName = user ? user.userRealName : "Unknown User";

    return (
        <Popover
            minimal
            content={<UserMenu user={user} />}
            position={Position.BOTTOM_RIGHT}
            modifiers={{ arrow: { enabled: false } }}
        >
            <NavbarTooltip title="User Profile" description="Open the User Profile options window.">
                <Button
                    minimal
                    text={displayName}
                    rightIcon="menu"
                    data-element-id="user-menu-button"
                    onClick={mainStore.hideStore}
                />
            </NavbarTooltip>
        </Popover>
    );
};

export const UserMenuButton = React.memo(_UserMenuButton);
