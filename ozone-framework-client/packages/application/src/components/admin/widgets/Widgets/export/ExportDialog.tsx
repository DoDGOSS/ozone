import { Button, Classes, Dialog, Intent } from "@blueprintjs/core";
import * as React from "react";
import { Form, Formik, FormikProps } from "formik";
import * as yup from "yup";
import download from "downloadjs";

import { WidgetDTO } from "../../../../../api/models/WidgetDTO";
import { widgetApi } from "../../../../../api/clients/WidgetAPI";
import { TextField, FormError } from "../../../../form";

export interface ExportDialogProps {
  widget: WidgetDTO;
  onClose: () => void;
  openExportErrorDialog: () => void;
}

export interface ExportForm {
  filename: string;
}

export class ExportDialog extends React.Component<ExportDialogProps, {}> {

  getWidgetExport = async (values: ExportForm, actions: FormikActions<ExportForm>) => {
    try {
      const url = `widget/export?id=${this.props.widget.id}&filename=${values.filename}`;
      const response = await widgetApi.getWidgetDescriptorJson(url);
      if (response.status !== 200) {
        // Show error Dialog
        this.props.onClose();
        this.props.openExportErrorDialog(this.props.widget);
        return false;
      }
      download(response.data, values.filename, response.headers['content-type']);
      this.props.onClose();
      return true;
    } catch (e) {
      // Show error Dialog
      this.props.onClose();
      this.props.openExportErrorDialog(this.props.widget);
      return false;
    }
  }

  render() {
    return (
        <div>
            <Dialog
                isOpen={true}
                isCloseButtonShown={true}
                onClose={this.props.onClose}
                canOutsideClickClose={false}
                title={`Export ${this.props.widget.value.namespace}`}
            >
                <Formik initialValues={{filename: ""}} validationSchema={ExportFormSchema} onSubmit={this.getWidgetExport}>
                    {(formik: FormikProps<ExportForm>) => {
                        const { dirty, isValid, isSubmitting } = formik;

                        return (
                          <Form data-element-id="export-dialog-form">
                            <div className={Classes.DIALOG_BODY}>
                                {formik.status && formik.status.error && <FormError message={formik.status.error} />}
                                <TextField type="text" name="filename" label="File Name" labelInfo="(required)" />
                            </div>

                            <div className={Classes.DIALOG_FOOTER}>
                                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                                    <Button
                                        intent={Intent.SUCCESS}
                                        rightIcon="tick"
                                        data-element-id="export-dialog-confirm"
                                        type="submit"
                                        disabled={isSubmitting || !(dirty && isValid)}
                                    >
                                        OK
                                    </Button>
                                    <Button
                                        onClick={this.props.onClose}
                                        intent={Intent.DANGER}
                                        rightIcon="cross"
                                        data-element-id="export-dialog-cancel"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                          </Form>
                        );
                      }
                    }
                </Formik>
            </Dialog>
        </div>
    );
  }
};

const ExportFormSchema = yup.object().shape({
    filename: yup.string().required("Required").matches(/^[\w-]+$/, "Invalid characters! The Filename may only contain letters, numbers, dashes, and underscores.")
});
