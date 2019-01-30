import "./SectionHeader.scss";

import React from "react";

import { Alignment, Navbar } from "@blueprintjs/core";


export interface SectionHeaderProps {
    text: string;
    children?: React.ReactNode;
}

export const SectionHeader: React.FunctionComponent<SectionHeaderProps> = (props) => (

    <Navbar className="section-header bp3-dark">

        <Navbar.Group>
            <Navbar.Heading>{props.text}</Navbar.Heading>
        </Navbar.Group>

        {props.children && (
            <Navbar.Group align={Alignment.RIGHT}>
                {props.children}
            </Navbar.Group>
        )}

    </Navbar>

);
