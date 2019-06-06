import React from "react";

export interface StyledString {
    text: string;
    style: "" | "bold" | "italics" | "both" | "link";
}

export function buildStyledMessage(messageWithStyle: (StyledString | string)[]): React.ReactNode {
    if (!messageWithStyle) {
        return <div />;
    }
    return (
        <div>
            {(() => {
                const textPieces = [];
                let i = 0; // both loops use the same variable, so as it can package each line in a div everytime it sees a newline,
                // and then continue building the next line where it left off.
                for (; i < messageWithStyle.length; i++) {
                    const linePieces = [];
                    for (; i < messageWithStyle.length; i++) {
                        const chunk = messageWithStyle[i];
                        if (chunk === "\n") {
                            break;
                        }
                        linePieces.push(styleChunk(chunk, i));
                    }
                    textPieces.push(<div>{linePieces}</div>);
                }
                return textPieces;
            })()}
        </div>
    );
}

function styleChunk(chunk: StyledString | string, chunkKey: number) {
    const style: { [key: string]: string } = {};
    if (typeof chunk === "string") {
        return <span key={chunkKey}>{chunk}</span>;
    } else {
        if (chunk.style === "bold") {
            style["fontWeight"] = "bold";
        }
        if (chunk.style === "italics") {
            style["fontStyle"] = "italic";
        }
        if (chunk.style === "link") {
            return <a key={chunkKey}>{chunk.text}</a>;
        }
        return (
            <span key={chunkKey} style={style}>
                {chunk.text}
            </span>
        );
    }
}
