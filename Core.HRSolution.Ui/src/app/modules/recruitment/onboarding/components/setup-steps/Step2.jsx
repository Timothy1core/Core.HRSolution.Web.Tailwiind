// import { useAuth } from '../../../../app/modules/auth'
import { useState, useRef } from 'react';
import { toAbsoluteUrl } from '@/_metronic/utils';
import { KTIcon} from '@/_metronic/helpers';
// import { FaFacebook, FaLinkedin } from "react-icons/fa";
// import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { Viewer, Worker, SpecialZoomLevel  } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { saveOnboardingDocuments } from '../../core/requests/_request';
import { Formik } from 'formik';

const FileUploadBox = ({ label, name, setFieldValue, value, documentGroup }) => {
  const inputRef = useRef();
  const [fileUrl, setFileUrl] = useState("");
  const [error, setError] = useState("");
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const MAX_FILE_SIZE_MB = 5;

  const isValidFileSize = (file) => {
    return file.size <= MAX_FILE_SIZE_MB * 1024 * 1024;
  };

  const handleFileSelection = (file) => {
    if (file) {
      if (!isValidFileSize(file)) {
        setError(`File must be less than or equal to ${MAX_FILE_SIZE_MB}MB.`);
        setFieldValue(name, null); // Clear the value if invalid
        setFileUrl("");
        return;
      }

      setError("");
      const previewUrl = URL.createObjectURL(file);
      setFileUrl(previewUrl);
      setFieldValue(name, { file, documentGroup });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFileSelection(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (value?.file) return; // Disable drop if file already exists
    const file = e.dataTransfer.files[0];
    handleFileSelection(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (value?.file) return; // Disable drop if file already exists
    
  };

  const handleClearFile = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    setFileUrl('');
    setError('');
    setFieldValue(name, null); // This clears Formik's state
  };

  const renderPreview = () => {
    if (!fileUrl) return null;
    if (value?.file?.name?.endsWith('.pdf')) {
      return (
        <div className="flex-fill" style={{ border: '1px solid rgba(0, 0, 0, 0.3)', height: '400px' }}>
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
            <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
          </Worker>
        </div>
      );
    }
    if (value?.file?.name?.match(/\.(jpeg|jpg|png|gif)$/)) {
      return <img src={fileUrl} alt="preview" className="img-fluid rounded" style={{ maxHeight: '400px', objectFit: 'contain' }} />;
    }
    return <div className="text-muted small">File preview not available for this file type.</div>;
  };

  return (
    // <Form.Group className="mb-4">
    //   <Form.Label><h3 className='text-dark'>{label}</h3></Form.Label>
    //   <div>
    //     <div
    //       className=""  
    //     >
    //       <input
    //         type="file"
    //         accept=".jpg,.jpeg,.png,.pdf"
    //         ref={inputRef}
    //         onChange={handleFileChange}
    //         style={{ display: "none" }}
    //         disabled={inputRef.value ? true : false}
    //       />
    //       <div className="upload-area">
    //         {value?.file ? (
    //           <div className="d-flex border border-2 p-2 justify-content-between">
    //             <div>
    //               <h3>File name: {value.file.name}</h3>
    //               <h4>Size: {(value.file.size / (1024 * 1024)).toFixed(2)} MB</h4>
    //             </div>
    //             <div className='w-50 bd-highlight'>{renderPreview()}</div>
                
    //             <div className='text-end ml-auto bd-highlight'>
    //               <Button variant='danger' type="button" onClick={handleClearFile} className="btn-icon btn-icon-lg size-5 bg-danger text-white" >
    //                 <KTIcon iconName='cross' className='fs-1' />
    //               </Button>
    //             </div>

                
    //           </div>
    //         ) : (
    //           <div 
    //           className='p-7 border border-dashed border-2 text-center cursor-pointer'
    //           onDrop={handleDrop}
    //           onDragOver={handleDragOver}
    //           onClick={() => inputRef.current.click()}>
    //             <div className="upload-icon mb-2"><KTIcon iconName="file-up" className='fs-1' /></div>
    //             Drag & Drop or <span className="text-dark fw-bold">Choose file</span> to upload
    //             <div className="text-muted small">JPG, PDF only</div>
    //           </div>
    //         )}
    //       </div>
    //     </div>
    //     {error && <div className="text-danger mt-2">{error}</div>}
    //   </div>
    // </Form.Group>
    <>1</>
  );
};


const Step2Div = ({ handleNext, handleBack, id, onboardingDocuments }) => {

  const docMap = {};

  onboardingDocuments.forEach((doc) => {
    docMap[doc.documentType] = {
      file: { name: doc.fileName }
    };
  });

  const initialValues = {
    nbiClearance: null,
    birthCertificate: null,
    medicalExam: null,
    pagibig: null,
    philhealth: null,
    tin: null,
    sss: null,
    diploma: null,
    marriageCert: null,
    dependentCert: null,
    employmentCert: null,
    form2316: null,
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const formData = new FormData();

    const fields = Object.entries(values);
    console.log(fields)
    let formIndex = 0;
    fields.forEach(([key, data], index) => {
      if (data?.file) {
        console.log(data?.file)
        formData.append(`onboardingDocuDto[${formIndex}].FileName`, data.file.name);
        formData.append(`onboardingDocuDto[${formIndex}].DocumentType`, key);
        formData.append(`onboardingDocuDto[${formIndex}].IsSubmitted`, true);
        formData.append(`onboardingDocuDto[${formIndex}].IsHrverification`, false);
        formData.append(`onboardingDocuDto[${formIndex}].DateSubmitted`, new Date().toISOString());
        formData.append(`onboardingDocuDto[${formIndex}].DocumentGroup`, data.documentGroup);
        formData.append(`onboardingDocuDto[${formIndex}].CandidateId`, id); // Replace with real ID
        formData.append(`onboardingDocuDto[${formIndex}].FormFile`, data.file);
        formIndex++;
      }
    });

    try {
      const hasData = [...formData.entries()].length > 0;

    if (!hasData) {
      handleNext();
    } else {
      const res = await saveOnboardingDocuments(formData);
      if (res.data.success) {
        handleNext();
      }
    }
      
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    // <Container className="my-5">
    //   <Formik initialValues={initialValues} onSubmit={handleSubmit}>
    //     {({ handleSubmit, setFieldValue, values, isSubmitting }) => (
    //       <Form onSubmit={handleSubmit}>
    //         <h5 className="text-dark">Pre-Employment Requirements</h5>
    //         <span className="mb-4 text-muted fs-7">Check those requirements that you can already submit or your have completed already as part of of your onboarding. Upload the soft copies of your documents as provided below.</span>
    //         <h5 className="my-4 text-danger">Pre-Requisite Requirements</h5>

    //         {docMap.nbiClearance ? 
    //         <>
    //           <h3 className='text-dark'>Updated and original NBI clearance/ Police/ Barangay Clearance</h3>
    //           <div className="d-flex border border-2 p-2 justify-content-between my-5">
    //             <div>
    //               <h3>File name: {docMap.nbiClearance.file.name}</h3>
    //             </div>
    //           </div>
    //           </>
    //          :
    //         <FileUploadBox 
    //           label="Updated and original NBI clearance/ Police/ Barangay Clearance" 
    //           name="nbiClearance" 
    //           value={values.nbiClearance} 
    //           setFieldValue={setFieldValue} 
    //           documentGroup={1}
    //         />
    //         }

    //         {docMap.birthCertificate ? 
    //         <>
    //           <h3 className='text-dark'>PSA/ NSO Birth Certificate</h3>
    //           <div className="d-flex border border-2 p-2 justify-content-between my-5">
    //             <div>
    //               <h3>File name: {docMap.birthCertificate.file.name}</h3>
    //             </div>
    //           </div>
    //           </>
    //          :
    //          <FileUploadBox 
    //          label="PSA/ NSO Birth Certificate" 
    //          name="birthCertificate"
    //          value={values.birthCertificate} 
    //          setFieldValue={setFieldValue}
    //          documentGroup={1} 
    //         />
    //         }

    //         {docMap.medicalExam ? 
    //         <>
    //           <h3 className='text-dark'>Pre-Employment Medical Exam</h3>
    //           <div className="d-flex border border-2 p-2 justify-content-between my-5">
    //             <div>
    //               <h3>File name: {docMap.medicalExam.file.name}</h3>
    //             </div>
    //           </div>
    //           </>
    //          :
    //          <FileUploadBox
    //           label="Pre-Employment Medical Exam" 
    //           name="medicalExam" 
    //           value={values.medicalExam} 
    //           setFieldValue={setFieldValue}
    //           documentGroup={1} 
    //         />
    //         }

    //         <div className="separator border-secondary my-7"></div>

    //         <h5 className="my-4 text-danger">General Requirements</h5>

    //         {docMap.pagibig ? 
    //         <>
    //           <h3 className='text-dark'>PagIBIG / MID</h3>
    //           <div className="d-flex border border-2 p-2 justify-content-between my-5">
    //             <div>
    //               <h3>File name: {docMap.pagibig.file.name}</h3>
    //             </div>
    //           </div>
    //           </>
    //          :
    //          <FileUploadBox 
    //           label="PagIBIG / MID" 
    //           name="pagibig" 
    //           value={values.pagibig} 
    //           setFieldValue={setFieldValue}
    //           documentGroup={2} 
    //         />
    //         }

    //         {docMap.philhealth ? 
    //         <>
    //           <h3 className='text-dark'>Philhealth</h3>
    //           <div className="d-flex border border-2 p-2 justify-content-between my-5">
    //             <div>
    //               <h3>File name: {docMap.philhealth.file.name}</h3>
    //             </div>
    //           </div>
    //           </>
    //          :
    //          <FileUploadBox 
    //           label="Philhealth" 
    //           name="philhealth" 
    //           value={values.philhealth} 
    //           setFieldValue={setFieldValue}
    //           documentGroup={2} 
    //         />
    //         }

    //         {docMap.tin ? 
    //         <>
    //           <h3 className='text-dark'>Tax Identification Number (TIN)</h3>
    //           <div className="d-flex border border-2 p-2 justify-content-between my-5">
    //             <div>
    //               <h3>File name: {docMap.tin.file.name}</h3>
    //             </div>
    //           </div>
    //           </>
    //          :
    //          <FileUploadBox 
    //           label="Tax Identification Number (TIN)" 
    //           name="tin" 
    //           value={values.tin} 
    //           setFieldValue={setFieldValue} 
    //           documentGroup={2} 
    //         />
    //         }

    //         {docMap.sss ? 
    //         <>
    //           <h3 className='text-dark'>Social Security System (SSS)</h3>
    //           <div className="d-flex border border-2 p-2 justify-content-between my-5">
    //             <div>
    //               <h3>File name: {docMap.sss.file.name}</h3>
    //             </div>
    //           </div>
    //           </>
    //          :
    //          <FileUploadBox 
    //           label="Social Security System (SSS)" 
    //           name="sss" 
    //           value={values.sss} 
    //           setFieldValue={setFieldValue} 
    //           documentGroup={2} 
    //         />
    //         }
            
    //         {docMap.diploma ? 
    //         <>
    //           <h3 className='text-dark'>Diploma/ Transcript of Records/ Any proof of educational attainment</h3>
    //           <div className="d-flex border border-2 p-2 justify-content-between my-5">
    //             <div>
    //               <h3>File name: {docMap.diploma.file.name}</h3>
    //             </div>
    //           </div>
    //           </>
    //          :
    //          <FileUploadBox 
    //           label="Diploma/ Transcript of Records/ Any proof of educational attainment" 
    //           name="diploma" 
    //           value={values.diploma} 
    //           setFieldValue={setFieldValue} 
    //           documentGroup={2} 
    //         />
    //         }
            
    //         {docMap.marriageCert ? 
    //         <>
    //           <h3 className='text-dark'>PSA/ NSO Marriage Certificate (if married)</h3>
    //           <div className="d-flex border border-2 p-2 justify-content-between my-5">
    //             <div>
    //               <h3>File name: {docMap.marriageCert.file.name}</h3>
    //             </div>
    //           </div>
    //           </>
    //          :
    //          <FileUploadBox 
    //           label="PSA/ NSO Marriage Certificate (if married)" 
    //           name="marriageCert" 
    //           value={values.marriageCert} 
    //           setFieldValue={setFieldValue} 
    //           documentGroup={2}
    //         />
    //         }
            
    //         {docMap.dependentCert ? 
    //         <>
    //           <h3 className='text-dark'>Dependent/s PSA/ NSO Birth Certificate</h3>
    //           <div className="d-flex border border-2 p-2 justify-content-between my-5">
    //             <div>
    //               <h3>File name: {docMap.dependentCert.file.name}</h3>
    //             </div>
    //           </div>
    //           </>
    //          :
    //          <FileUploadBox 
    //           label="Dependent/s PSA/ NSO Birth Certificate"
    //           name="dependentCert" 
    //           value={values.dependentCert} 
    //           setFieldValue={setFieldValue} 
    //           documentGroup={2} 
    //         />
    //         }
            
    //         {docMap.employmentCert ? 
    //         <>
    //           <h3 className='text-dark'>Certificate of Employment / Signed resignation letter / Clearance</h3>
    //           <div className="d-flex border border-2 p-2 justify-content-between my-5">
    //             <div>
    //               <h3>File name: {docMap.employmentCert.file.name}</h3>
    //             </div>
    //           </div>
    //           </>
    //          :
    //          <FileUploadBox 
    //           label="Certificate of Employment / Signed resignation letter / Clearance" 
    //           name="employmentCert" 
    //           value={values.employmentCert} 
    //           setFieldValue={setFieldValue}
    //           documentGroup={2}  
    //         />
    //         }
            
    //         {docMap.form2316 ? 
    //         <>
    //           <h3 className='text-dark'>Current Year’s 2316</h3>
    //           <div className="d-flex border border-2 p-2 justify-content-between my-5">
    //             <div>
    //               <h3>File name: {docMap.form2316.file.name}</h3>
    //             </div>
    //           </div>
    //           </>
    //          :
    //          <FileUploadBox 
    //           label="Current Year’s 2316" 
    //           name="form2316" 
    //           value={values.form2316} 
    //           setFieldValue={setFieldValue} 
    //           documentGroup={2} 
    //         />
    //         }
            
    //         <div className="d-flex bd-highlight  gap-5 justify-content-between py-2 mt-5">
    //           <Button type="button"  onClick={() => handleBack()} className="btn btn-secondary mt-5" >
    //             Back
    //           </Button>
    //           <Button type="submit" className="btn btn-danger mt-5" disabled={isSubmitting}>
    //             {isSubmitting ? 'Submitting...' : 'Continue'}
    //           </Button>
    //         </div>
    //       </Form>
    //     )}
    //   </Formik>
    // </Container>
    <>1</>
  );
};

export { Step2Div };
