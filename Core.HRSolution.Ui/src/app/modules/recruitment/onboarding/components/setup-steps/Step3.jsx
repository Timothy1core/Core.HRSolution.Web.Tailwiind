// import { useAuth } from '../../../../app/modules/auth'
import { useState, useRef } from 'react';
// import { KTIcon, toAbsoluteUrl } from '../../../../_metronic/helpers';
// import { FaFacebook, FaLinkedin } from "react-icons/fa";
// import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { Viewer, Worker, SpecialZoomLevel  } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { KTIcon } from '@/_metronic/helpers';
import { saveOnboardingDocuments } from '../../core/requests/_request';
import { Formik } from 'formik';
import { CandidateSignaturePadModal } from '../../../../../helpers/esignature/candidate_esignature_component';
import * as Yup from 'yup';


const validationSchema = Yup.object().shape({
  idPicture: Yup.mixed()
    .required('ID Picture is required')
    .test('fileExists', 'ID Picture is required', value => !!value?.file),
  signatureSpecimen: Yup.mixed()
    .required('Signature Specimen is required')
    .test('fileExists', 'Signature Specimen is required', value => !!value?.file),
});

const FileUploadBox = ({ label, name, setFieldValue, value, documentGroup, errorMessage }) => {
  const inputRef = useRef();
  const [fileUrl, setFileUrl] = useState("");
  const [error, setError] = useState("");
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const MAX_FILE_SIZE_MB = 15;

  const isValidFileSize = (file) => {
    return file.size <= MAX_FILE_SIZE_MB * 1024 * 1024;
  };

  const dataURLtoBlob = (dataurl) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
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
    // <Form.Group className="mb-4 w-50">
    //   <Form.Label><h2 className='text-dark'>{label}</h2></Form.Label>
    //   {label == "ID Picture" && 
    //   <div className="alert alert-dismissible bg-light-danger d-flex flex-column flex-sm-row p-5 mb-10">
    //     <KTIcon iconName='information-4' className='fs-1 text-danger me-2' />
    //     <div className="d-flex flex-column text-dark pe-0 pe-sm-10">
    //       {/* <h5 className="mb-1">This is an alert</h5> */}
    //       <span className='fw-bold'>1. Take a photo of yourself on portrait mode on a white background (backdrop).</span>
    //       <span className='fw-bold'>2. Photo size must be in high resolution.</span>
    //       <span className='fw-bold'>3. See photos for the format of your pose.</span>
    //       <span className='fw-bold'>
    //         <ul>
    //           <li>Body is slightly side viewed or slightly tilted</li>
    //           <li>BodyFace should be facing forward or upfront</li>
    //           <li>Wear black top (with or without collar)</li>
    //           <li>Photo must be formal and clean looking</li>
    //           <li>For male, please remove piercing or any inappropriate accessory.</li>
    //         </ul>
    //       </span>
    //       <span className='fw-bold' >3. Upload your picture to the provided section.</span>
    //     </div>

    //     <button type="button" className="position-absolute position-sm-relative m-2 m-sm-0 top-0 end-0 btn btn-icon ms-sm-auto" data-bs-dismiss="alert">
    //       <span className="svg-icon svg-icon-1 svg-icon-primary"><KTIcon iconName='cross' className='fs-1 text-danger' /></span>
    //     </button>
    //   </div>}
    //   {label === "Signature Specimen" && (
    //     <>
    //       <div className="alert alert-dismissible bg-light-danger d-flex flex-column flex-sm-row p-5 mb-10">
    //         <KTIcon iconName='information-4' className='fs-1 text-danger me-2' />
    //         <div className="d-flex flex-column text-dark pe-0 pe-sm-10">
    //           <span className='fw-bold'>Kindly DRAW or UPLOAD your EXACT specimen signature and use BLACK INK...</span>
    //         </div>
    //         <button type="button" className="position-absolute position-sm-relative m-2 m-sm-0 top-0 end-0 btn btn-icon ms-sm-auto" data-bs-dismiss="alert">
    //           <span className="svg-icon svg-icon-1 svg-icon-primary"><KTIcon iconName='cross' className='fs-1 text-danger' /></span>
    //         </button>
    //       </div>

    //       <div className="mb-3 d-flex gap-2 align-items-center justify-content-center">
    //         <Button variant="dark" size="sm" onClick={() => setShowSignaturePad(true)}>Draw Signature</Button>
    //       </div>

    //       <CandidateSignaturePadModal
    //         show={showSignaturePad}
    //         setShow={setShowSignaturePad}
    //         onSave={(dataURL) => {
    //           const blob = dataURLtoBlob(dataURL);
    //           const file = new File([blob], "signature.png", { type: "image/png" });
    //           const previewUrl = URL.createObjectURL(file);
    //           setFileUrl(previewUrl);
    //           setFieldValue(name, { file, documentGroup });
    //         }}
    //       />
    //     </>
    //   )}
    //   <div>
    //     <div
    //       className=""  
    //     >
    //       <input
    //         type="file"
    //         accept=".jpg,.jpeg,.png,"
    //         ref={inputRef}
    //         onChange={handleFileChange}
    //         style={{ display: "none" }}
    //         disabled={inputRef.value ? true : false}
    //       />
    //       <div className="upload-area">
    //         {value?.file ? (
    //           <div className="d-flex flex-column border border-2 p-2 justify-content-center ">
    //             <div className='bd-highlight text-end'>
    //               <Button variant='danger' type="button" onClick={handleClearFile} className="btn-icon btn-icon-lg size-5 bg-danger text-white" >
    //                 <KTIcon iconName='cross' className='fs-1' />
    //               </Button>
    //             </div>
    //             <center><div className='w-50 bd-highlight border'>{renderPreview()}</div></center>
    //             <div className='text-center'>
    //               <h3>File name: {value.file.name}</h3>
    //               <h4>Size: {(value.file.size / (1024 * 1024)).toFixed(2)} MB</h4>
    //             </div>
                

                
    //           </div>
    //         ) : (
    //           <div 
    //           className='p-7 border border-dashed border-2 text-center cursor-pointer bg-hover-light-primary text-hover-primary'
    //           onDrop={handleDrop}
    //           onDragOver={handleDragOver}
    //           onClick={() => inputRef.current.click()}>
    //             <div className="upload-icon mb-2"><KTIcon iconName="file-up" className='fs-1' /></div>
    //             Drag & Drop or <span className="text-dark fw-bold">Choose file</span> to upload
    //             <div className="text-muted small ">JPG, JPEG only</div>
    //           </div>
    //         )}
    //       </div>
    //     </div>
        
    //   </div>
      
    //   {(error || errorMessage) && (
    //     <div className="text-danger mt-2">{error || errorMessage}</div>
    //   )}
    // </Form.Group>
    <>1</>
  );
};


const Step3Div = ({ handleNext, handleBack, id,onboardingDocuments }) => {

  const docMap = {};

  onboardingDocuments.forEach((doc) => {
    docMap[doc.documentType] = {
      file: { name: doc.fileName }
    };
  });

  const initialValues = {
    idPicture: null,
    signatureSpecimen: null,
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
      const res = await saveOnboardingDocuments(formData);
      if (res.data.success) {
        handleNext()
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    // <Container className="my-5">
      // <Formik
      //   initialValues={initialValues}
      //   validationSchema={validationSchema}
      //   onSubmit={handleSubmit}
      // >
      //   {({ handleSubmit, setFieldValue, values, isSubmitting, errors, touched })=> (
      //     <Form onSubmit={handleSubmit}>
      //       <h5 className="text-danger">Company ID Information</h5>
      //       <span className="mb-4 text-muted fs-7">Check those requirements that you can already submit or your have completed already as part of of your onboarding. Upload the soft copies of your documents as provided below.</span>
      //       <div className='d-flex flex-column align-items-center mt-5'>
            
      //       {docMap.idPicture ? 
      //       <>
      //         <h3 className='text-dark'>ID Picture</h3>
      //         <div className="d-flex border border-2 p-2 justify-content-between my-5">
      //           <div>
      //             <h3>File name: {docMap.idPicture.file.name}</h3>
      //           </div>
      //         </div>
      //         </>
      //        :
      //        <FileUploadBox 
      //        label="ID Picture" 
      //        name="idPicture" 
      //        value={values.idPicture} 
      //        setFieldValue={setFieldValue} 
      //        documentGroup={3}
      //        errorMessage={touched.idPicture && errors.idPicture}
      //        />
      //       }
            
      //         <div className="separator border-secondary my-7 w-50"></div>
      //       </div>
            
      //       <div className='d-flex flex-column align-items-center justify-content-center'>
            
      //       {docMap.signatureSpecimen ? 
      //       <>
      //         <h3 className='text-dark'>Signature Specimen</h3>
      //         <div className="d-flex border border-2 p-2 justify-content-between my-5">
      //           <div>
      //             <h3>File name: {docMap.signatureSpecimen.file.name}</h3>
      //           </div>
      //         </div>
      //         </>
      //        :
      //        <FileUploadBox 
      //         label="Signature Specimen" 
      //         name="signatureSpecimen" 
      //         value={values.signatureSpecimen}
      //         setFieldValue={setFieldValue}
      //         documentGroup={3}
      //         errorMessage={touched.signatureSpecimen && errors.signatureSpecimen}
      //         />
      //       }
            
              
      //       </div>
      //       <div className="d-flex bd-highlight  gap-5 justify-content-between py-2 mt-5">
      //         {/* <Button type="button"  onClick={() => handleBack()} className="btn btn-secondary mt-5" >
      //           Back
      //         </Button>
      //         {docMap.idPicture ? <Button type="button"  onClick={() => handleNext()} className="btn btn-danger mt-5" >
      //           Continue
      //         </Button> : <Button type="submit" className="btn btn-danger mt-5" disabled={isSubmitting}>
      //           {isSubmitting ? 'Submitting...' : 'Continue'}
      //         </Button>} */}
              

              
      //       </div>
      //     </Form>
      //   )}
      // </Formik>
    // </Container>
    <>1</>
  );
};

export { Step3Div };
