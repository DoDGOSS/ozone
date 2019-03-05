import styles from "./SectionHeader.module.scss";

import React from "react";

import { Alignment, Navbar } from "@blueprintjs/core";

export interface SectionHeaderProps {
    text: string;
    children?: React.ReactNode;
}

export const SectionHeader: React.FunctionComponent<SectionHeaderProps> = (props) => (
    <Navbar className={`${styles.header} bp3-dark`}>
        <Navbar.Group className={styles.group}>
            <Navbar.Heading>{props.text}</Navbar.Heading>
        </Navbar.Group>

        {props.children && (
            <Navbar.Group className={styles.group} align={Alignment.RIGHT}>
                {props.children}
            </Navbar.Group>
        )}
    </Navbar>
);
