import { useState } from "react";
import Swal from "sweetalert2";
// import { Modal, Button } from "react-bootstrap";
import { KTIcon } from '@/_metronic/helpers';
import { useFormik } from "formik";
import * as Yup from "yup";
import { CreateEmailAutomation } from '../../request/email_template';

import {
  SelectAllJobProfileComponent,
  SelectJobProfileApplicationProccessComponent,
  SelectEmailTemplateComponent,
} from "../elements/automation_dropdown_component";

// Validation Schema using Yup
const emailTemplateValidationSchema = Yup.object().shape({
  job: Yup.string().notRequired(),
  template: Yup.string().required("Template selection is required"),
  stage: Yup.string().when("type", {
    is: (type) => type !== "1" && type !==4,
    then: () => Yup.string().required("Stage selection is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
  disqualified: Yup.string().notRequired()
});

function CreateEmailAutomationModal({ onUpdate, type }) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const getModalTitle = () => {
    switch (type) {
      case "1":
        return "When a candidate applies to any job, then send them a message template";
      case "2":
        return "When a candidate in any job, is disqualified at a stage, then send them a message template";
      case "3":
        return "When a candidate in any job, is moved to a stage, then send them a message template";
      case "4":
        return "When a candidate in any job, is invited for assessment, then send the a message template";
      default:
        return "When a candidate in any job, is moved to onboarding, then send the a message template";
    }
  };

  const formik = useFormik({
    initialValues: {
      type,
      job: "",
      template: "",
      stage: "",
      disqualified: type == 2 ? true : false
    },
    validationSchema: emailTemplateValidationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      console('test')
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("Type", values.type);
        formData.append("Template", values.template);
        formData.append("Job", values.job);
        formData.append("Stage", values.stage);
        formData.append("Disqualified", values.disqualified);

        const response = await CreateEmailAutomation(formData);
        Swal.fire({
          title: "Success!",
          text: `${response.data.responseText}`,
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          if (onUpdate) {
            onUpdate();
          }
        });

        // Close the modal and reset the form
        setShow(false); // Close the modal
        resetForm(); // Reset form values
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: error.message || "An error occurred while updating the profile.",
          icon: "error",
          confirmButtonText: "OK",
        });
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
  });

  const renderAutomationContent = () => (
    <div>
      <p className="mb-2 fs-4">
        When a candidate{" "}
        {(type === "2" || type === "3") && "in"}{" "}
        {type === "1" && "applies to"}{" "}
        <SelectAllJobProfileComponent
          name="job"
          className="form-select form-select-solid d-inline w-auto"
          onChange={formik.handleChange}
          value={formik.values.job}
        />
        {(type === "2" || type === "3") && (
          <>
            , is{" "}
            {type === "2" && "disqualified at"}
            {type === "3" && "moved to"}{" "}
            <SelectJobProfileApplicationProccessComponent
              name="stage"
              className="form-select form-select-solid d-inline w-auto"
              onChange={formik.handleChange}
              value={formik.values.stage}
            />
          </>
        )}
        , then send them{" "}
        <SelectEmailTemplateComponent
          name="template"
          className="form-select form-select-solid d-inline w-auto"
          onChange={formik.handleChange}
          value={formik.values.template}
        />
      </p>
    </div>
  );

  return (
    <>
      <a
        href="#"
        className="card card-flush h-md-75 h-lg-100  mb-5 mb-xl-10 hover-elevate-up shadow-sm parent-hover"
        onClick={() => setShow(true)}
      >
        <div className="card-body d-flex align-items-center">
          <span className="ms-3 text-gray-700 parent-hover-primary fs-6 fw-bold">
            {getModalTitle()}
          </span>
        </div>
      </a>
      {/* <Modal show={show} onHide={() => setShow(false)} dialogClassName="modal-dialog-centered mw-800px">
        <Modal.Header>
          <Modal.Title>ADD AUTOMATION</Modal.Title>
          <button
            className="btn btn-sm btn-icon btn-active-color-primary"
            onClick={() => setShow(false)}
          >
            <KTIcon iconName="cross" className="fs-1" />
          </button>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={formik.handleSubmit}>
            <div className="text-center">{renderAutomationContent()}</div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="btn btn-sm btn-secondary me-2"
            onClick={() => setShow(false)}
          >
            Close
          </Button>
          <Button
            className="btn btn-sm btn-dark"
            type="submit"
            onClick={formik.handleSubmit}
            disabled={formik.isSubmitting || loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </Modal.Footer>
      </Modal> */}
    </>
  );
}

export { CreateEmailAutomationModal };
