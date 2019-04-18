declare namespace OWF {

    namespace Launcher {

        interface LaunchOptions {
            /**
             * OWF 8 - Not currently supported.
             */
            pane?: string;

            /**
             * GUID of the Widget the launch.
             */
            guid?: string;

            /**
             * Universal name of the Widget the launch.
             */
            universalName?: string;

            /**
             * If true, the Widget will only be launched if it is not already opened.
             * If false and the Widget is already open, then the widget will be restored.
             *
             * OWF 8 - Not currently supported.
             */
            launchOnlyIfClosed?: boolean;

            /**
             * Title to use for the widget.
             */
            title?: string;

            /**
             * RegEx used to replace the previous title with the new value of `title`.
             *
             * OWF 8 - Not currently supported.
             */
            titleRegex?: string;

            /**
             * Initial launch config data to the passed to the Widget if it is opened.
             */
            data?: string;
        }

        export function launch(opts: LaunchOptions, callback?: (result: [ boolean ]) => void): void;

        export function getLaunchData(): any;

    }

}
