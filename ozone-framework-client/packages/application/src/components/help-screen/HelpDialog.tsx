import styles from "./index.scss";

import React, { useCallback, useEffect, useState } from "react";
import { useBehavior } from "../../hooks";

import { Dialog, ITreeNode, Spinner } from "@blueprintjs/core";
import { mainStore } from "../../stores/MainStore";
import { classNames } from "../../utility";

import { showConfirmationDialog } from "../confirmation-dialog/showConfirmationDialog";

import { helpApi } from "../../api/clients/HelpAPI";
import { HelpFileDTO, HelpFolderDTO, HelpItemDTO, isHelpFolder } from "../../api/models/HelpDTO";

import { HelpTree } from "./HelpTree";

export const HelpDialog: React.FC = () => {
    const themeClass = useBehavior(mainStore.themeClass);
    const isOpen = useBehavior(mainStore.isHelpDialogVisible);

    const [isLoading, setIsLoading] = useState(false);
    const [nodes, setNodes] = useState<ITreeNode[]>([]);

    const fetchHelp = useCallback(() => {
        setIsLoading(true);

        helpApi.getHelpFiles().then((response) => {
            // TODO: Error handling
            if (!(response.status >= 200 && response.status < 400)) return;

            if (response.data.length === 0) {
                showConfirmationDialog({
                    title: "Warning",
                    message: [
                        "There are no help files in the Help Folder. ",
                        "\n",
                        "Please contact your OWF Administrator or view the OWF Administrator's Guide."
                    ],
                    onConfirm: closeDialogBox,
                    hideCancel: true
                });
                return;
            }

            setNodes(createNodes(response.data));
            setIsLoading(false);
        });
    }, []);

    useEffect(() => {
        if (isOpen) {
            fetchHelp();
        }
    }, [isOpen]);

    const closeDialogBox = useCallback(() => mainStore.hideHelpDialog(), []);

    return (
        <Dialog
            className={classNames(themeClass, styles.helpDialog)}
            title="Help"
            icon="help"
            isOpen={isOpen}
            onOpened={fetchHelp}
            onClose={closeDialogBox}
        >
            <div style={{ overflowY: "scroll" }} data-element-id="help-dialog">
                {isLoading ? <Spinner /> : <HelpTree nodes={nodes} />}
            </div>
        </Dialog>
    );
};

function createNodes(items: HelpItemDTO[]): ITreeNode[] {
    return items.map((item: HelpItemDTO) => (isHelpFolder(item) ? createFolder(item) : createFile(item)));
}

function createFolder(node: HelpFolderDTO): ITreeNode {
    return {
        id: node.path,
        label: node.text,
        hasCaret: true,
        icon: "folder-close",
        childNodes: createNodes(node.children)
    };
}

function createFile(node: HelpFileDTO): ITreeNode {
    return {
        id: node.path,
        label: node.text,
        icon: "document"
    };
}
