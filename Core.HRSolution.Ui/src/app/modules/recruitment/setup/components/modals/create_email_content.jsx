import { useState } from 'react';
import Swal from 'sweetalert2';
// import { Modal, Button } from 'react-bootstrap';
import { KTIcon } from '@/_metronic/helpers';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
    ClassicEditor,
    createDropdown,
    ButtonView,
    ListView,
    ListItemView,
    Bold,
    Essentials,
    Italic,
    Paragraph,
    List,
    Heading,
    Link,
    Table,
    TableToolbar,
    Indent,
    IndentBlock,
} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';

import {CreateEmailTemplate} from '../../request/email_template'

const emailTemplateValidationSchema = Yup.object().shape({
    name: Yup.string().max(1000, 'Must be 1000 characters or less').required('Template Name is required'),
    subject: Yup.string().max(1000, 'Must be 1000 characters or less').required('Subject is required'),
    emailBody: Yup.string().required('Email Body is required'),
});

function CreateEmailTemplateModal({ onUpdate }) {
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);

    const CKEditorConfig = {
        plugins: [
            Essentials,
            Bold,
            Italic,
            Paragraph,
            List,
            Heading,
            Link,
            Table,
            TableToolbar,
            Indent,
            IndentBlock,
        ],
        toolbar: [
            'undo',
            'redo',
            '|',
            'textFieldOptions',
            '|',
            'bold',
            'italic',
            '|',
            'bulletedList',
            'numberedList',
            '|',
        ],
        extraPlugins: [TextField],
        table: {
            contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
        },
        viewportTopOffset: 60,
    };

    function TextField(editor) {
        editor.ui.componentFactory.add('textFieldOptions', (locale) => {
            const dropdownView = createDropdown(locale);
            dropdownView.buttonView.set({
                label: 'Text Field',
                withText: true,
                tooltip: true,
            });

            const listView = new ListView(locale);
            const options = [
                { label: '[candidate_full_name]', content: '[candidate_full_name]' },
                { label: '[candidate_first_name]', content: '[candidate_first_name]' },
                { label: '[candidate_email]', content: '[candidate_email]' },
                { label: '[job_title]', content: '[job_title]' },
                { label: '[job_link]', content: '[job_link]' },
                { label: '[assessment_password]', content: '[assessment_password]' },
                { label: '[assessment_link]', content: '[assessment_link]' },
                { label: '[job_offer_link]', content: '[job_offer_link]' },
                { label: '[onboarding_form_link]', content: '[onboarding_form_link]' },
                { label: '[documents]', content: '[documents]' },
            ];

            options.forEach((option) => {
                const listItemView = new ListItemView(locale);
                const buttonView = new ButtonView(locale);

                buttonView.set({
                    label: option.label,
                    withText: true,
                });

                buttonView.on('execute', () => {
                    editor.model.change((writer) => {
                        const insertPosition = editor.model.document.selection.getFirstPosition();
                        writer.insertText(option.content, insertPosition);
                    });

                    dropdownView.isOpen = false;
                });

                listItemView.children.add(buttonView);
                listView.items.add(listItemView);
            });

            dropdownView.panelView.children.add(listView);
            return dropdownView;
        });
    }

    const formik = useFormik({
        initialValues: {
            name: '',
            subject: '',
            emailBody: '',
            emailCc: '',
        },
        validationSchema: emailTemplateValidationSchema,
        onSubmit: async (values, { setStatus, setSubmitting }) => {
            setLoading(true);
            try {
                const formData = new FormData();
                formData.append('EmailBody', values.emailBody);
                formData.append('Name', values.name);
                formData.append('Subject', values.subject);
                formData.append('EmailCc', values.emailCc);
                const response = await CreateEmailTemplate(formData); // Replace with your API call
                setShow(false);
                Swal.fire({
                    title: 'Success!',
                    text: `${response.data.responseText}`,
                    icon: 'success',
                    confirmButtonText: 'OK',
                }).then(() => {
                    if (onUpdate) {
                        onUpdate();
                    }
                });
            } catch (error) {
                setStatus(error.message || 'An error occurred');
                Swal.fire({
                    title: 'Error!',
                    text: error.message || 'An error occurred while updating the profile.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            } finally {
                setSubmitting(false);
                setLoading(false);
            }
        },
    });

    return (
        <>
            {/* <Button className="btn btn-dark btn-sm" onClick={() => setShow(true)}>
                Create Email Template
            </Button> */}

            {/* <Modal show={show} onHide={() => setShow(false)} dialogClassName="modal-dialog-centered mw-800px">
                <Modal.Header>
                    <Modal.Title>CREATE EMAIL TEMPLATE</Modal.Title>
                    <button
                        className="btn btn-sm btn-icon btn-active-color-primary"
                        onClick={() => setShow(false)}
                    >
                        <KTIcon iconName="cross" className="fs-1" />
                    </button>
                </Modal.Header>

                <Modal.Body>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="row g-4 mb-8">
                            <div className="col-md-6 fv-row">
                                <label className="required fs-6 fw-semibold mb-2">Template Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    onChange={formik.handleChange}
                                    value={formik.values.name}
                                    className="form-control"
                                />
                                {formik.touched.name && formik.errors.name && (
                                    <div className="text-danger mt-2">{formik.errors.name}</div>
                                )}
                            </div>
                            <div className="col-md-6 fv-row">
                                <label className="required fs-6 fw-semibold mb-2">Email Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    onChange={formik.handleChange}
                                    value={formik.values.subject}
                                    className="form-control"
                                />
                                {formik.touched.subject && formik.errors.subject && (
                                    <div className="text-danger mt-2">{formik.errors.subject}</div>
                                )}
                            </div>
                        </div>
                        <div className="row g-4 mb-8">
                            <div className="col-md-12 fv-row">
                                <label className="required fs-6 fw-semibold mb-2">Email Body</label>
                                <CKEditor
                                    editor={ClassicEditor}
                                    config={CKEditorConfig}
                                    onChange={(event, editor) => {
                                        formik.setFieldValue('emailBody', editor.getData());
                                    }}
                                />
                                {formik.touched.emailBody && formik.errors.emailBody && (
                                    <div className="text-danger mt-2">{formik.errors.emailBody}</div>
                                )}
                            </div>
                        </div>
                        <div className="row g-4 mb-8">
                            <div className="col-md-12">
                                <label className="required fs-6 fw-semibold mb-2">Email Cc: </label>
                                <input
                                    type="text"
                                    name="emailCc"
                                    onChange={formik.handleChange}
                                    value={formik.values.emailCc}
                                    className="form-control"
                                />
                                <div className="text-muted mt-2 ">Make sure to add <strong>(,)</strong> to separate emails.</div>
                            </div>
                        </div>
                    </form>
                </Modal.Body>

                <Modal.Footer>
                    <Button className="btn btn-sm btn-secondary me-2" onClick={() => setShow(false)}>
                        Close
                    </Button>
                    <Button
                        className="btn btn-sm btn-dark"
                        type="submit"
                        onClick={formik.handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : 'Submit'}
                    </Button>
                </Modal.Footer>
            </Modal> */}
            1
        </>
    );
}

export { CreateEmailTemplateModal };
