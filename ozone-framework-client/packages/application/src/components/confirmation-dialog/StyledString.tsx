import React from "react";

export interface StyledString {
    text: string;
    style: "" | "bold" | "italics" | "both";
}

export function buildStyledMessage(messageWithStyle: (StyledString | string)[]): React.ReactNode {
    return (
        <div>
            {(() => {
                const textPieces = [];
                let i: number = 0;
                for (const chunk of messageWithStyle) {
                    const style: { [key: string]: string } = {};
                    if (typeof chunk === "string") {
                        textPieces.push(<span key={i}>{chunk}</span>);
                    } else {
                        if (chunk.style === "bold") {
                            style["fontWeight"] = "bold";
                        }
                        if (chunk.style === "italics") {
                            style["fontStyle"] = "italic";
                        }
                        textPieces.push(
                            <span key={i} style={style}>
                                {chunk.text}
                            </span>
                        );
                    }
                    i++;
                }
                return textPieces;
            })()}
        </div>
    );
}
