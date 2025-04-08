import * as Yup from 'yup';
import { toAbsoluteUrl } from '@/_metronic/utils';
import { KTIcon} from '@/_metronic/helpers';
import { useFormik } from 'formik';
import { useAuth } from '../../../../../modules/auth'
import Swal from 'sweetalert2';
import { useState, useRef } from 'react';
import { saveWfhInformationSheet, updateWfhInformation } from '../../core/requests/_request';
// import { Container, Form, Button } from 'react-bootstrap';

const step1Schema = Yup.object().shape({
  workLocation: Yup.string().required('Required'),
  pinLocation: Yup.string().required('Required'),
  internetProvider: Yup.string().required('Required'),
  internetService: Yup.string().required('Required'),
  uploadInternetSpeed: Yup.string().required('Required'),
  downloadInternetSpeed: Yup.string().required('Required'),
  platformVideoCall: Yup.string().required('Required'),
});

const FileUploadBox = ({ label, name, setFieldValue, value = [], documentGroup }) => {
  const inputRef = useRef();
  const [filePreviews, setFilePreviews] = useState([]);
  const [error, setError] = useState("");

  const MAX_FILE_SIZE_MB = 5;

  const isValidFileSize = (file) => file.size <= MAX_FILE_SIZE_MB * 1024 * 1024;

  const handleFileSelection = (files) => {
    let validFiles = [];
    let previews = [];

    for (let file of files) {
      if (!isValidFileSize(file)) {
        setError(`Each file must be ≤ ${MAX_FILE_SIZE_MB}MB.`);
        continue;
      }

      previews.push({
        url: URL.createObjectURL(file),
        name: file.name,
        type: file.type,
      });

      validFiles.push({ file, documentGroup });
    }

    if (validFiles.length > 0) {
      setError("");
      setFieldValue(name, validFiles);
      setFilePreviews(previews);
    } else {
      setFieldValue(name, []);
      setFilePreviews([]);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    handleFileSelection(files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleFileSelection(files);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleClearFile = () => {
    if (inputRef.current) inputRef.current.value = '';
    setFilePreviews([]);
    setError('');
    setFieldValue(name, []);
  };

  const renderPreview = (file, url, index) => {
    if (file.name.match(/\.(jpeg|jpg|png|gif)$/)) {
      return (
        <img
          key={index}
          src={url}
          alt={`preview-${index}`}
          className="img-fluid rounded mb-3"
          style={{ maxHeight: '200px', objectFit: 'contain' }}
        />
      );
    }

    return (
      <div key={index} className="text-muted small mb-3">
        {file.name} preview not available.
      </div>
    );
  };

  return (
    // <Form.Group className="mb-4">
    //   {/* <Form.Label><h3 className='text-dark required'></h3></Form.Label> */}
    //   <label className='form-label required fs-8'>{label}</label>
    //   <div className="upload-area">
    //     <input
    //       type="file"
    //       accept=".jpg,.jpeg,.png,"
    //       ref={inputRef}
    //       onChange={handleFileChange}
    //       multiple
    //       style={{ display: "none" }}
    //     />
    //     {value.length > 0 ? (
    //       <div className="border border-2 p-3">
    //         <div className="text-end">
    //           <Button
    //             variant='danger'
    //             type="button"
    //             onClick={handleClearFile}
    //             className="btn-icon btn-icon-lg bg-danger text-white"
    //           >
    //             <KTIcon iconName='cross' className='fs-1' />
    //           </Button>
    //         </div>
    //         {value.map(({ file }, index) => (
    //           <div key={index} className="mb-3">
    //             <div className="d-flex justify-content-between align-items-start">
    //               <div>
    //                 <h5>{file.name}</h5>
    //                 <p className="text-muted mb-2">Size: {(file.size / (1024 * 1024)).toFixed(2)} MB</p>
    //                 {renderPreview(file, filePreviews[index]?.url, index)}
    //               </div>
    //             </div>
    //           </div>
    //         ))}

            
    //       </div>
    //     ) : (
    //       <div
    //         className='p-7 border border-dashed border-2 text-center cursor-pointer'
    //         onDrop={handleDrop}
    //         onDragOver={handleDragOver}
    //         onClick={() => inputRef.current.click()}
    //       >
    //         <div className="upload-icon mb-2"><KTIcon iconName="file-up" className='fs-1' /></div>
    //         Drag & Drop or <span className="text-dark fw-bold">Choose files</span> to upload
    //         <div className="text-muted small">JPG, JPEG, and PNG only (Max {MAX_FILE_SIZE_MB}MB per file)</div>
    //       </div>
    //     )}

    //     {error && <div className="text-danger mt-2">{error}</div>}
    //   </div>
    // </Form.Group>
    <>1</>
  );
};

const hasFormChanged = (initialValues, currentValues) => {
  return JSON.stringify(initialValues) !== JSON.stringify(currentValues);
};

const Step4Div = ({handleNext, handleBack, id, wfhInformations, onboardingDocuments }) => {
  const docMap = {};

  onboardingDocuments.forEach((doc) => {
    if (doc.documentType === "screenshots") {
      if (!docMap["screenshots"]) {
        docMap["screenshots"] = [];
      }
      docMap["screenshots"].push({
        file: { name: doc.fileName },
        isSubmitted: doc.isSubmitted,
        isHrverification: doc.isHrverification
      });
    }
  });
  const [loading, setLoading] = useState(false);
  const formik = useFormik({
    initialValues: { 
      workLocation: wfhInformations?.workLocation ? wfhInformations.workLocation: '',
      pinLocation: wfhInformations?.pinLocation ? wfhInformations.pinLocation: '',
      internetProvider: wfhInformations?.internetProvider ? wfhInformations.internetProvider: '',
      internetService: wfhInformations?.internetService ? wfhInformations.internetService: '',
      uploadInternetSpeed: wfhInformations?.uploadInternetSpeed ? wfhInformations.uploadInternetSpeed: '',
      downloadInternetSpeed: wfhInformations?.downloadInternetSpeed ? wfhInformations.downloadInternetSpeed: '',
      platformVideoCall: wfhInformations?.platformVideoCall ? wfhInformations.platformVideoCall: '',
      messengerAccount: wfhInformations?.messengerAccount ? wfhInformations.messengerAccount: '',
      availabilityCall: wfhInformations?.availabilityCall ? wfhInformations.availabilityCall: '',
      screenshots: [],
      SetUpWorkStation_1: wfhInformations?.setUpWorkStation1 ? wfhInformations.setUpWorkStation1: false,
      SetUpWorkStation_2: wfhInformations?.setUpWorkStation2 ? wfhInformations.setUpWorkStation2: false,
      SetUpWorkStation_3: wfhInformations?.setUpWorkStation3 ? wfhInformations.setUpWorkStation3: false,
      SetUpWorkStation_4: wfhInformations?.setUpWorkStation4 ? wfhInformations.setUpWorkStation4: false,
      SetUpWorkStation_5: wfhInformations?.setUpWorkStation5 ? wfhInformations.setUpWorkStation5: false,
      SetUpWorkStation_6: wfhInformations?.setUpWorkStation6 ? wfhInformations.setUpWorkStation6: false,
      SurroundAreas_1: wfhInformations?.surroundAreas1 ? wfhInformations.surroundAreas1: false,
      SurroundAreas_2: wfhInformations?.surroundAreas2 ? wfhInformations.surroundAreas2: false,
      SurroundAreas_3: wfhInformations?.surroundAreas3 ? wfhInformations.surroundAreas3: false,
      SurroundAreas_4: wfhInformations?.surroundAreas4 ? wfhInformations.surroundAreas4: false,
      SurroundAreas_5: wfhInformations?.surroundAreas5 ? wfhInformations.surroundAreas5: false,
      SurroundAreas_6: wfhInformations?.surroundAreas6 ? wfhInformations.surroundAreas6: false,
      SurroundAreas_7: wfhInformations?.surroundAreas7 ? wfhInformations.surroundAreas7: false,
      SurroundAreas_8: wfhInformations?.surroundAreas8 ? wfhInformations.surroundAreas8: false,
      SurroundAreas_9: wfhInformations?.surroundAreas9 ? wfhInformations.surroundAreas9: false,
      SurroundAreas_10: wfhInformations?.surroundAreas10 ? wfhInformations.surroundAreas10: false,
     },
    validationSchema: step1Schema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values, { setStatus, setSubmitting }) => {

      const hasChanged = hasFormChanged(formik.initialValues, values);

      if (!hasChanged && values.screenshots.length == 0) {
          handleNext();
          return;
      }

      setLoading(true);
      const fields = Object.entries(values.screenshots);
      console.log(fields)
      const formData = new FormData();
      formData.append('CandidateId', id);
      formData.append('WorkLocation', values.workLocation);
      formData.append('PinLocation', values.pinLocation);
      formData.append('InternetProvider', values.internetProvider);
      formData.append('InternetService', values.internetService);
      formData.append('UploadInternetSpeed', values.uploadInternetSpeed);
      formData.append('DownloadInternetSpeed', values.downloadInternetSpeed);
      formData.append('PlatformVideoCall', values.platformVideoCall);
      formData.append('MessengerAccount', values.messengerAccount);
      formData.append('AvailabilityCall', values.availabilityCall);
      let formIndex = 0;
      fields.forEach(([key, data], index) => {
        if (data?.file) {
          console.log(data?.file)
          formData.append(`OnboardingDocuDto[${formIndex}].FileName`, data.file.name);
          formData.append(`OnboardingDocuDto[${formIndex}].DocumentType`, "screenshots");
          formData.append(`OnboardingDocuDto[${formIndex}].IsSubmitted`, true);
          formData.append(`OnboardingDocuDto[${formIndex}].IsHrverification`, false);
          formData.append(`OnboardingDocuDto[${formIndex}].DateSubmitted`, new Date().toISOString());
          formData.append(`OnboardingDocuDto[${formIndex}].DocumentGroup`, data.documentGroup);
          formData.append(`OnboardingDocuDto[${formIndex}].CandidateId`, id); // Replace with real ID
          formData.append(`OnboardingDocuDto[${formIndex}].FormFile`, data.file);
          formIndex++;
        }
      });

      for (let i = 1; i <= 6; i++) {
        formData.append(`SetUpWorkStation${i}`, values[`SetUpWorkStation_${i}`]);
      }
      for (let i = 1; i <= 10; i++) {
        formData.append(`SurroundAreas${i}`, values[`SurroundAreas_${i}`]);
      }

      try {

        if(wfhInformations?.workLocation){
          let res = await updateWfhInformation(id, formData);
          if (res.data.success) {
            handleNext()
          }  
        }else{
          let res = await saveWfhInformationSheet(formData);
          if (res.data.success) {
            setStatus('success');
            handleNext()
          }
        }  
        
      } catch (error) {
        console.error(error);
        setStatus(error.message || 'An error occurred');
      } finally {
        setSubmitting(false);
        setLoading(false);
      }
    },
  });

  return (
    // <div className="d-flex flex-column flex-sm-row">
      // <Container className="my-5">
        <form onSubmit={formik.handleSubmit}>
        <h5 className="text-danger">Work from Home and Hybrid Work Application</h5>
        <span className="mb-4 text-muted fs-7">The required fields are usually marked with an asterisk (*).</span>

          <div className='fv-row d-flex mb-3 mt-5'>
            <div className='me-2 flex-fill col-4'>
            <label className='form-label required fs-8'>Work Location</label>
            <input
                name='workLocation'
                className='form-control form-control-sm'
                {...formik.getFieldProps('workLocation')}
            />
            {formik.touched.workLocation && formik.errors.workLocation && (
                <div className='text-danger mt-2'>{formik.errors.workLocation}</div>
            )}
            </div>
            <div className='me-2 flex-fill col-4'>
            <label className='form-label required fs-8'>What is the pin location of your address?</label>

            <input
                name='pinLocation'
                className='form-control form-control-sm'
                {...formik.getFieldProps('pinLocation')}
            />
            {formik.touched.pinLocation && formik.errors.pinLocation && (
                <div className='text-danger mt-2'>{formik.errors.pinLocation}</div>
            )}
            </div>
            <div className='me-2 flex-fill col-4'>
            <label className='form-label required fs-8'>Which is your internet provider? </label>
            <select
                name='internetProvider'
                className='form-control form-control-sm'
                {...formik.getFieldProps('internetProvider')}
            >
                <option value='' disabled>Select Internet Provider</option>
                <option value='PLDT'>PLDT</option>
                <option value='Converge'>Converge</option>
                <option value='Globe'>Globe</option>
                <option value='Smart'>Smart</option>
                <option value='SKY'>SKY</option>
                <option value='Easter Communications'>Easter Communications</option>
                <option value='Cignal'>Cignal</option>
                <option value='Others'>Others</option>
            </select>
            {formik.touched.internetProvider && formik.errors.internetProvider && (
                <div className='text-danger mt-2'>{formik.errors.internetProvider}</div>
            )}
            </div>
          </div>

          <div className='fv-row d-flex mb-3 mt-5'>
          <div className='me-2 flex-fill col-4'>
            <label className='form-label required fs-8'>What type of internet service do you have? </label>
            <select
                name='internetService'
                className='form-control form-control-sm'
                {...formik.getFieldProps('internetService')}
            >
                <option value='' disabled>Select Internet Service</option>
                <option value='WIFI Connection (DSL, Fiber)'>WIFI Connection (DSL, Fiber)</option>
                <option value='Broadband'>Broadband</option>
                <option value='Mobile Data'>Mobile Data</option>
                <option value='LAN Connection'>LAN Connection</option>
                <option value='Others'>Others</option>
            </select>
            {formik.touched.internetService && formik.errors.internetService && (
                <div className='text-danger mt-2'>{formik.errors.internetService}</div>
            )}
            </div>
            <div className='me-2 flex-fill col-4'>
            <label className='form-label required fs-8'>Upload Internet Speed</label>
            <input
                name='uploadInternetSpeed'
                className='form-control form-control-sm'
                {...formik.getFieldProps('uploadInternetSpeed')}
            />
            {formik.touched.uploadInternetSpeed && formik.errors.uploadInternetSpeed && (
                <div className='text-danger mt-2'>{formik.errors.uploadInternetSpeed}</div>
            )}
            </div>
            <div className='me-2 flex-fill col-4'>
            <label className='form-label required fs-8'>Download Internet Speed</label>

            <input
                name='downloadInternetSpeed'
                className='form-control form-control-sm'
                {...formik.getFieldProps('downloadInternetSpeed')}
            />
            {formik.touched.downloadInternetSpeed && formik.errors.downloadInternetSpeed && (
                <div className='text-danger mt-2'>{formik.errors.downloadInternetSpeed}</div>
            )}
            </div>
          </div>

          <div className='fv-row d-flex mb-3 mt-5'>
            <div className='me-2 flex-fill col-4'>
            <label className='form-label required fs-8'>Preferred Platform for Video Call</label>
            <select
                name='platformVideoCall'
                className='form-control form-control-sm'
                {...formik.getFieldProps('platformVideoCall')}
            >
                <option value='' disabled>Select Preffered Platform for Video Call</option>
                <option value='Messenger'>Messenger</option>
                <option value='Skype'>Skype</option>
                <option value='Teams'>Teams</option>
                <option value='Zoom'>Zoom</option>
                <option value='Google Meet'>Google Meet</option>
                <option value='Viber'>Viber</option>
            </select>
            {formik.touched.platformVideoCall && formik.errors.platformVideoCall && (
                <div className='text-danger mt-2'>{formik.errors.platformVideoCall}</div>
            )}
            </div>
            <div className='me-2 flex-fill col-4'>
            <label className='form-label fs-8'>If messenger, provide your account.</label>
            <input
                name='messengerAccount'
                className='form-control form-control-sm'
                {...formik.getFieldProps('messengerAccount')}
            />
            </div>
            <div className='me-2 flex-fill col-4'>
            <label className='form-label fs-8'>Time Availability for a call</label>

            <input
                name='availabilityCall'
                className='form-control form-control-sm'
                {...formik.getFieldProps('availabilityCall')}
            />
            </div>
          </div>

          <div className="separator border-secondary my-2"></div>
          {docMap.screenshots ? 
            <>
              <h3 className='text-dark'>Screenshots of Pin Location, Speed Test and photo of the workstation you plan to set-up for your remote work arrangement</h3>
              <div className="d-flex border border-2 p-2 justify-content-between my-5">
                <div>
                {docMap.screenshots.map((screenshot, index) => (
                  <div key={index} className="mb-2">
                    <h5>File name: {screenshot.file.name}</h5>
                  </div>
                ))}
                </div>
              </div>
              </>
             :
             <FileUploadBox 
              label="Upload Screenshot of Pin Location, Speed Test and photo of the workstation you plan to set-up for your remote work arrangement" 
              name="screenshots" 
              value={formik.values.screenshots}
              setFieldValue={formik.setFieldValue} 
              documentGroup={4}
          />
            }

          
          <div className="separator border-secondary my-2"></div>
          <div className="row mt-5">
            <div className="col-md-6">
              <h6 className="text-danger fw-bold mb-3">HOW DO I SET UP A WORKSTATION AT HOME?</h6>
              {[
                "Find a work surface - whether this be a desk, dining table, kitchen bench etc, that allows you to sit upright and have relaxed shoulders with elbows slightly above the work surface height when typing.",
                "Ensure there is adequate leg space under the work surface and feet can be flat on the ground (or find something to rest your feet on).",
                "Ensure that you have a chair that is the right fit for the work surface you will be using.",
                "Your monitor can be positioned directly in front of you, and at arm’s length from your seated position.",
                "Make sure that your laptop may be raised up with a stable surface.",
                "Where possible, you can set up your work area at 90 degrees to any windows to reduce glare reflection."
              ].map((label, i) => (
                <div className="form-check mb-2" key={`SetUpWorkStation_${i+1}`}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`SetUpWorkStation_${i+1}`}
                    name={`SetUpWorkStation_${i+1}`}
                    checked={formik.values[`SetUpWorkStation_${i+1}`]}
                    onChange={formik.handleChange}
                  />
                  <label className="form-check-label text-muted fs-8" htmlFor={`SetUpWorkStation_${i+1}`}>
                    {label}
                  </label>
                </div>
              ))}
            </div>

            <div className="col-md-6">
              <h6 className="text-danger fw-bold mb-3">WHAT ABOUT THE SURROUND AREAS IN MY HOME?</h6>
              {[
                "Ensure there is enough lighting for the task being performed and that the work is easy to see so your eyes don’t become fatigued.",
                "Consider glare reflections on your monitor. Where possible, look for a place where you can set-up your work area at 90 degrees to any windows to reduce glare reflection.",
                "Consider the accessways including stairs, floors and entrances. Keep them clean and clear of slip or trip hazards especially of clutter, spills, leads/ cords, loose mats.",
                "Ensure you have a clear route from the designated work area, to a safe outdoor location in case of fire.",
                "Have emergency phone numbers readily accessible.",
                "Have a suitable first aid kit readily available.",
                "Ensure that either a smoke detector is installed and properly maintained, or you have a fire extinguisher or blanket in case of minor fires.",
                "Ensure electrical equipment is safe to use. Prior to plugging in any cords and equipment, check them for nicks, exposed conductors or visible damage. If damaged, do not use",
                "Ensure your safety switch is installed, or residual current device is used, and perform a push button test of all safety switches initially and atleast every 3 months.",
                "Make sure you don’t overload your power outlets."
              ].map((label, i) => (
                <div className="form-check mb-2" key={`SurroundAreas_${i+1}`}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`SurroundAreas_${i+1}`}
                    name={`SurroundAreas_${i+1}`}
                    checked={formik.values[`SurroundAreas_${i+1}`]}
                    onChange={formik.handleChange}
                  />
                  <label className="form-check-label text-muted fs-8" htmlFor={`SurroundAreas_${i+1}`}>
                    {label}
                  </label>
                </div>
              ))}
            </div>

          </div>
          <div className="d-flex bd-highlight gap-5 justify-content-between py-2 mt-5">
            <button type="button"  onClick={() => handleBack()} className="btn btn-secondary" >
              Back
            </button>
            <button type="submit" className="btn btn-danger" disabled={loading || formik.isSubmitting}>
              {loading ? 'Saving...' : 'Continue'}
            </button>
          </div>
          </form>
      // </Container>
    /* </div> */
  );
};

export { Step4Div };
