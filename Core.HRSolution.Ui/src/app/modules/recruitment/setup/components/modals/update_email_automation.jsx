import { useState, useEffect } from "react";
import Swal from "sweetalert2";
// import { Modal, Button } from "react-bootstrap";
import { KTIcon } from '@/_metronic/helpers';
import { useFormik } from "formik";
import * as Yup from "yup";
import { UpdateEmailAutomation } from '../../request/email_template';

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
    is: (type) => type !== "1" && type !== "4",
    then: () => Yup.string().required("Stage selection is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
  disqualified: Yup.string().notRequired()
});

function EditEmailAutomationModal({ automation, onUpdate }) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [automationData, setAutomationData] = useState(null);

  useEffect(() => {
    if (automation) {
        console.log(automation)
    //   GetEmailAutomationById(automationId)
    //     .then((response) => {
          setAutomationData(automation);
        // })
        // .catch((error) => {
        //   console.error("Error fetching automation details:", error);
        //   Swal.fire("Error!", "Failed to fetch email automation details.", "error");
        // });
    }
  }, [automation]);

  const formik = useFormik({
    initialValues: {
      type: automationData?.typeId || "",
      job: automationData?.jobId || "",
      template: automationData?.templateId || "",
      stage: automationData?.stageId || "",
      disqualified: automationData?.disqualified || false,
    },
    enableReinitialize: true,
    validationSchema: emailTemplateValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("Type", values.type);
        formData.append("Template", values.template);
        formData.append("Job", values.job);
        formData.append("Stage", values.stage);
        formData.append("Disqualified", values.disqualified);

        const response = await UpdateEmailAutomation(automation.id, formData);
        Swal.fire({
          title: "Success!",
          text: `${response.data.responseText}`,
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          if (onUpdate) {
            onUpdate();
          }
          setShow(false);
        });
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: error.message || "An error occurred while updating the automation.",
          icon: "error",
          confirmButtonText: "OK",
        });
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
  });

  return (
    <>
    1
      {/* <Button className="menu-link btn btn-secondary btn-sm" onClick={() => setShow(true)}>
                Update
            </Button> */}
      {/* <Modal show={show} onHide={() => setShow(false)} dialogClassName="modal-dialog-centered mw-800px">
        <Modal.Header>
          <Modal.Title>EDIT AUTOMATION</Modal.Title>
          <button
            className="btn btn-sm btn-icon btn-active-color-primary"
            onClick={() => setShow(false)}
          >
            <KTIcon iconName="cross" className="fs-1" />
          </button>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={formik.handleSubmit}>
            <div className="text-center">
              <p className="mb-2 fs-4">
                When a candidate{" "}
                {(formik.values.type == "2" || formik.values.type == "3") && "in"}{" "}
                {formik.values.type == "1" && "applies to"}{" "}
                <SelectAllJobProfileComponent
                  name="job"
                  className="form-select form-select-solid d-inline w-auto"
                  onChange={formik.handleChange}
                  value={formik.values.job}
                />
                {(formik.values.type == "2" || formik.values.type == "3") && (
                  <>
                    , is{" "}
                    {formik.values.type == "2" && "disqualified at"}
                    {formik.values.type == "3" && "moved to"}{" "}
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
            {loading ? "Updating..." : "Update"}
          </Button>
        </Modal.Footer>
      </Modal> */}
    </>
  );
}

export { EditEmailAutomationModal };
