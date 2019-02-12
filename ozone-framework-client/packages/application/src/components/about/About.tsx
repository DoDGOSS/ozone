import * as React from "react";
import { observer } from "mobx-react";

import { Classes, Dialog } from "@blueprintjs/core";

import { lazyInject } from "../../inject";
import { MainStore } from "../../stores";

import { ABOUT } from "../../messages";


const DEFAULT_PROPS = {
    title: ABOUT.title,
    content: ABOUT.content,
    version: ABOUT.version
};

export type AboutProps = Readonly<typeof DEFAULT_PROPS>;

@observer
export class AboutDialog extends React.Component<AboutProps> {

    static defaultProps = DEFAULT_PROPS;

    @lazyInject(MainStore)
    private mainStore: MainStore;

    render() {
        const { title, content, version } = this.props;

        return (
            <div>
                <Dialog className="bp3-dark"
                        isOpen={this.mainStore.isAboutVisible}
                        onClose={this.mainStore.hideAboutDialog}
                        isCloseButtonShown={true}
                        title={title}>

                    <div data-element-id='about-dialog'
                         className={Classes.DIALOG_BODY}
                         dangerouslySetInnerHTML={{ __html: content }}/>

                    <div className={Classes.DIALOG_FOOTER}>

                        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        {version}
                        </div>

                    </div>

                </Dialog>
            </div>
        );
    }

}
