import styles from "./index.scss";

import React, { useEffect, useState } from "react";
import { useBehavior } from "../../hooks";

import { Dialog, ITreeNode, Spinner } from "@blueprintjs/core";
import { mainStore } from "../../stores/MainStore";
import { classNames } from "../../utility";

import { showConfirmationDialogWithoutCancel } from "../confirmation-dialog/InPlaceConfirmationDialogWithoutCancel";

import { helpApi } from "../../api/clients/HelpAPI";
import { HelpDTO } from "../../api/models/HelpDTO";

import { HelpTree } from "./HelpTree";

export const HelpDialog: React.FC = () => {
    const themeClass = useBehavior(mainStore.themeClass);
    const isOpen = useBehavior(mainStore.isHelpDialogVisible);

    const [files, setFiles] = useState([]);

    const [folderLoading, setFolderLoading] = useState(false);

    const InitialState: ITreeNode[] | undefined = [];

    let currentNode: HelpDTO;
    let parentFolder: any = {};
    let majorFolder: any = {};
    let majorFile: any = {};

    useEffect(() => {
        if (isOpen) {
            fetchHelp();
        }
    }, [isOpen]);

    const fetchHelp = () => {
        helpApi.getHelpFiles().then((response) => {
            if (response.status !== 200) return;
            setFiles(response.data);
            checkFileContent();
        });
    };

    const checkFileContent = () => {
        setTimeout(() => {
            setFolderLoading(true);
        }, 2000);
    };

    const closeDialogBox = () => {
        mainStore.hideHelpDialog();
        setFolderLoading(false);
    };

    const setNodes = (data: any) => {
        if (data.length === 0) {
            showConfirmationDialogWithoutCancel({
                title: "Warning",
                message: [
                    "There are no help files in the Help Folder. Please contact your OWF Administrator or view the OWF Administrator's Guide."
                ],
                onConfirm: () => {
                    mainStore.hideHelpDialog();
                }
            });
        } else {
            for (const item of data) {
                currentNode = item;
                if (item["children"]) {
                    createFolder(currentNode);
                    traverse(currentNode);
                    InitialState.push(majorFolder);
                } else {
                    createFile(currentNode);
                    InitialState.push(majorFile);
                }
            }
            return InitialState;
        }
    };

    const traverse = (node: any) => {
        checkChildFiles(node);
        if (node["children"]) {
            for (const item of node["children"]) {
                if (item["children"]) {
                    assignChildFolder(item);
                    traverse(item);
                }
            }
        }
    };

    const checkChildFiles = (node: any) => {
        if (node["children"]) {
            for (const file of node["children"]) {
                if (file["children"] === null || file["children"] === undefined) {
                    assignChildFile(file);
                }
            }
        }
    };

    const createFolder = (node: HelpDTO) => {
        const folder = {
            id: node.path,
            label: node.text,
            hasCaret: true,
            icon: "folder-close",
            childNodes: []
        };
        majorFolder = folder;
        parentFolder = folder;
    };

    const createFile = (node: HelpDTO) => {
        const file = {
            id: node.path,
            label: node.text,
            icon: "document"
        };
        majorFile = file;
    };

    const assignChildFolder = (node: HelpDTO) => {
        const folder = {
            id: node.path,
            label: node.text,
            hasCaret: true,
            icon: "folder-close",
            childNodes: []
        };
        parentFolder["childNodes"].unshift(folder);
        parentFolder = folder;
    };

    const assignChildFile = (node: HelpDTO) => {
        const file = {
            id: node.path,
            label: node.text,
            hasCaret: false,
            icon: "document"
        };
        parentFolder["childNodes"].push(file);
    };

    return (
        <Dialog
            className={classNames(themeClass, styles.helpDialog)}
            title="Help"
            icon="help"
            isOpen={isOpen}
            onOpened={fetchHelp}
            onClose={closeDialogBox}
        >
            <div style={{ overflowY: "scroll" }}>
                {folderLoading ? <HelpTree nodes={setNodes(files)} /> : <Spinner />}
            </div>
        </Dialog>
    );
};
