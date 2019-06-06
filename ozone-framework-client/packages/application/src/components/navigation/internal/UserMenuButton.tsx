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
        <NavbarTooltip title="User Profile" description="Open the User Profile options window.">
            <Popover
                minimal
                content={<UserMenu user={user} />}
                position={Position.BOTTOM_RIGHT}
                modifiers={{ arrow: { enabled: false } }}
            >
                <Button
                    minimal
                    text={displayName}
                    rightIcon="menu"
                    data-element-id="user-menu-button"
                    onClick={mainStore.hideStore}
                />
            </Popover>
        </NavbarTooltip>
    );
};

export const UserMenuButton = React.memo(_UserMenuButton);
