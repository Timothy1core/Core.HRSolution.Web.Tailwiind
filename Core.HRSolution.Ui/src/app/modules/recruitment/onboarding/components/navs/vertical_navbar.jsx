
import { useEffect, useState } from 'react';
import { Viewer, Worker, SpecialZoomLevel  } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
// import { Accordion, Form } from 'react-bootstrap';
import { KTIcon } from '@/_metronic/helpers';
import { ApiGateWayUrl} from '../../core/requests/_request';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import provinces from '../../../../../../../public/json/provinces.json';
import cities from '../../../../../../../public/json/citiesMunicipalities.json';

    const detectFileType = async (url) => {
        try {
        const response = await fetch(url, { method: 'GET' });
        if (!response.ok) {
            return { type: 'unknown', exists: false };
        }
    
        const contentType = response.headers.get('Content-Type');
        if (contentType.includes('pdf')) return { type: 'pdf', exists: true };
        if (contentType.includes('image')) return { type: 'image', exists: true };
        return { type: 'unknown', exists: false };
        } catch (error) {
        console.error('Error detecting file type:', error);
        return { type: 'unknown', exists: false };
        }
    };
  
    const PdfOrImagePreview = ({ fileUrl, fileType }) => (
        <>
        {fileType === 'pdf' ? (
            <div style={{ border: '1px solid rgba(0, 0, 0, 0.3)', height: '750px' }}>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
            <Viewer fileUrl={fileUrl} defaultScale={SpecialZoomLevel.PageFit} />
            </Worker>
            </div>
        ) : fileType === 'image' ? (
            <div>
            <img src={fileUrl} alt="Document" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
        ) : (
            <p className="text-danger">Unsupported file format or file not found.</p>
        )}
        </>
        
    );

const VerticalNavBar = ({
    candidateId,
    //   logo,
    //   status,
    //   clientCompanyName,
    wfhInformation,
    coreInfoSheet
    }) => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    
    const [availableCities, setAvailableCities] = useState([]);
    const [availablePermanentCities, setAvailablePermanentCities] = useState([]);
    const [documents, setDocuments] = useState([]);

    const [nbiClearance, setNbiClearance] = useState({ type: null, exists: false });
    const [birthCertificate, setBirthCertificate] = useState({ type: null, exists: false });
    const [medicalExam, setMedicalExam] = useState({ type: null, exists: false });

    const [pagibig, setPagibig] = useState({ type: null, exists: false });
    const [philhealth, setPhilhealth] = useState({ type: null, exists: false });
    const [tin, setTin] = useState({ type: null, exists: false });
    const [sss, setsss] = useState({ type: null, exists: false });
    const [diploma, setdiploma] = useState({ type: null, exists: false });
    const [marriageCert, setMarriageCert] = useState({ type: null, exists: false });
    const [dependentCert, setDependentCert] = useState({ type: null, exists: false });
    const [employmentCert, setEmploymentCert] = useState({ type: null, exists: false });
    const [form2316, setForm2316] = useState({ type: null, exists: false });
    

    const nbiFileUrl = `${ApiGateWayUrl()}/recruitment/onboarding/candidate_document/${candidateId}/nbiClearance`;
    const birthCertFileUrl = `${ApiGateWayUrl()}/recruitment/onboarding/candidate_document/${candidateId}/birthCertificate`;
    const medicalFileUrl = `${ApiGateWayUrl()}/recruitment/onboarding/candidate_document/${candidateId}/medicalExam`;
    const pagibigFileUrl = `${ApiGateWayUrl()}/recruitment/onboarding/candidate_document/${candidateId}/pagibig`;
    const philhealthFileUrl = `${ApiGateWayUrl()}/recruitment/onboarding/candidate_document/${candidateId}/philhealth`;
    const tinFileUrl = `${ApiGateWayUrl()}/recruitment/onboarding/candidate_document/${candidateId}/tin`;
    const sssFileUrl = `${ApiGateWayUrl()}/recruitment/onboarding/candidate_document/${candidateId}/sss`;
    const diplomaFileUrl = `${ApiGateWayUrl()}/recruitment/onboarding/candidate_document/${candidateId}/diploma`;
    const marriageFileUrl = `${ApiGateWayUrl()}/recruitment/onboarding/candidate_document/${candidateId}/marriageCert`;
    const dependentFileUrl = `${ApiGateWayUrl()}/recruitment/onboarding/candidate_document/${candidateId}/dependentCert`;
    const employmentFileUrl = `${ApiGateWayUrl()}/recruitment/onboarding/candidate_document/${candidateId}/employmentCert`;
    const form2316FileUrl = `${ApiGateWayUrl()}/recruitment/onboarding/candidate_document/${candidateId}/form2316`;

    const formik = useFormik({
        initialValues: {
          lastName: coreInfoSheet?.lastName || '',
          firstName: coreInfoSheet?.firstName || '',
          middleName: coreInfoSheet?.middleName || '',
          middleNamePrefix: coreInfoSheet?.middleNamePrefix || '',
          suffix: coreInfoSheet?.suffix || '',
          salutation: coreInfoSheet?.salutation || '',
          gender: coreInfoSheet?.gender || '',
          civilStatus: coreInfoSheet?.civilStatus || '',
          dateOfBirth: coreInfoSheet?.dateOfBirth?.split('T')[0] || '',
          educationalAttainment: coreInfoSheet?.educationalAttainment || '',
          currentAddress: coreInfoSheet?.currentAddress || '',
          currentCityProvince: coreInfoSheet?.currentCityProvince || '',
          currentLocation: coreInfoSheet?.currentLocation || '',
          currentZipcode: coreInfoSheet?.currentZipcode || '',
          permanentAddress: coreInfoSheet?.permanentAddress || '',
          permanentCityProvince: coreInfoSheet?.permanentCityProvince || '',
          permanentLocation: coreInfoSheet?.permanentLocation || '',
          permanentZipcode: coreInfoSheet?.permanentZipcode || '',
          landlineNo: coreInfoSheet?.landlineNo || '',
          mobileNo: coreInfoSheet?.mobileNo || '',
          alternativeMobileNo: coreInfoSheet?.alternativeMobileNo || '',
          email: coreInfoSheet?.personalEmail || '',
          emergencyContactPerson: coreInfoSheet?.emergencyContactPerson || '',
          emergencyContactNo: coreInfoSheet?.emergencyContactNo || '',
          emergencyRelation: coreInfoSheet?.emergencyRelation || '',
          sssidNo: coreInfoSheet?.sssidNo || '',
          philhealthIdNo: coreInfoSheet?.philhealthIdNo || '',
          tinidNo: coreInfoSheet?.tinidNo || '',
          pagibigIdNo: coreInfoSheet?.pagibigIdNo || '',
          department: '',
          startDate: '',
          orientationDate: '',
          NTLogin: '',
          companyEmail: '',
        },
        validationSchema: Yup.object({
          lastName: Yup.string().required('Required'),
          firstName: Yup.string().required('Required'),
          middleNamePrefix: Yup.string().required('Required'),
          salutation: Yup.string().required('Required'),
          gender: Yup.string().required('Required'),
          civilStatus: Yup.string().required('Required'),
          dateOfBirth: Yup.string().required('Required'),
          educationalAttainment: Yup.string().required('Required'),
          currentAddress: Yup.string().required('Required'),
          currentCityProvince: Yup.string().required('Required'),
          currentLocation: Yup.string().required('Required'),
          currentZipcode: Yup.string().required('Required'),
          permanentAddress: Yup.string().required('Required'),
          permanentCityProvince: Yup.string().required('Required'),
          permanentLocation: Yup.string().required('Required'),
          permanentZipcode: Yup.string().required('Required'),
          mobileNo: Yup.string().required('Required'),
          alternativeMobileNo: Yup.string().required('Required'),
          email: Yup.string().email('Invalid email').required('Required'),
          emergencyContactPerson: Yup.string().required('Required'),
          emergencyContactNo: Yup.string().required('Required'),
          emergencyRelation: Yup.string().required('Required'),
          sssidNo: Yup.string().required('Required'),
          philhealthIdNo: Yup.string().required('Required'),
          tinidNo: Yup.string().required('Required'),
          pagibigIdNo: Yup.string().required('Required'),
          department: Yup.string().required('Required'),
          startDate: Yup.string().required('Required'),
          orientationDate: Yup.string().required('Required'),
          NTLogin: Yup.string().required('Required'),
          companyEmail: Yup.string().email('Invalid email').required('Required'),
        }),
        onSubmit: values => {
          console.log('Form Submitted:', values);
        },
      });     

    useEffect(() => {
        if (candidateId) {
        const fetchFileType = async () => {
            const nbi = await detectFileType(nbiFileUrl);
            setNbiClearance(nbi);
        
            const birth = await detectFileType(birthCertFileUrl);
            setBirthCertificate(birth);
        
            const medical = await detectFileType(medicalFileUrl);
            setMedicalExam(medical);
        
            const pagibigDoc = await detectFileType(pagibigFileUrl);
            setPagibig(pagibigDoc);

            const philhealth = await detectFileType(philhealthFileUrl);
            setPhilhealth(philhealth);

            const tinDocu = await detectFileType(tinFileUrl);
            setTin(tinDocu);

            const sssDocu = await detectFileType(sssFileUrl);
            setsss(sssDocu);

            const diploma = await detectFileType(diplomaFileUrl);
            setdiploma(diploma);

            const marriageDocu = await detectFileType(marriageFileUrl);
            setMarriageCert(marriageDocu);

            const dependentDocu = await detectFileType(dependentFileUrl);
            setDependentCert(dependentDocu);

            const employmentDocu = await detectFileType(employmentFileUrl);
            setEmploymentCert(employmentDocu);

            const form2316Docu = await detectFileType(form2316FileUrl);
            setForm2316(form2316Docu);
          };
          fetchFileType();
        }
        
    }, []);

    useEffect(() => {
        if (formik.values.currentCityProvince) {
        const selectedProvCode = formik.values.currentCityProvince;
          const filteredCities = cities.filter(
            (city) => city.province === selectedProvCode
          );
          setAvailableCities(filteredCities);
        } else {
          setAvailableCities([]);
        }
      }, [formik.values.currentCityProvince]);

      useEffect(() => {
        const selectedProvCode = formik.values.permanentCityProvince;
        if (selectedProvCode) {
          setAvailablePermanentCities(
            cities.filter((c) => c.province === selectedProvCode)
          );
        } else {
          setAvailablePermanentCities([]);
        }
      }, [formik.values.permanentCityProvince]);      

    useEffect(() => {
        if (candidateId) {
        const fetchDocuments = async () => {
          try {
            const response = await axios.get(`${ApiGateWayUrl()}/recruitment/onboarding/candidate_documents/${candidateId}/screenshots`);
            setDocuments(response.data);
          } catch (error) {
            console.error("Error fetching documents:", error);
          }
        };
    
        fetchDocuments();
    }
      }, [candidateId]);
  return (
    <div className="row fs-5 mb-5">
              <div className="col-4">
                <div className="card p-8">
                          <ul className="nav nav-pills flex-column">
                              <li className="nav-item my-1">
                                  <a className="btn btn-sm nav-link active btn-secondary d-flex align-items-center justify-content-between" data-bs-toggle="tab" href="#tab_job_offer">
                                    <div>
                                      <div className="text-start">Job Offer</div>
                                      <div className="text-start fs-7 text-gray-700">Due Date [date]</div>
                                    </div>
                                    <div><KTIcon iconName='verify' className='text-success'/> Done</div>
                                  </a>
                              </li>
                              <li className="nav-item my-1">
                                  <a className="btn btn-sm nav-link btn-secondary d-flex justify-content-between align-items-center" data-bs-toggle="tab" href="#tab_core_info">
                                    <div>
                                      <div className="text-start">Core Information Sheet</div>
                                      <div className="text-start fs-7 text-gray-700">Due Date [date]</div>
                                    </div>
                                    
                                    {
                                        coreInfoSheet
                                        ? <div> <KTIcon iconName='verify' className='text-success'/> Done </div>
                                        : <div> <KTIcon iconName='information' className='text-info'/> In Progress </div>
                                    }
                                    
                                  </a>
                              </li>
                              <li className="nav-item my-1">
                                  <a className="btn btn-sm nav-link btn-secondary d-flex justify-content-between align-items-center" data-bs-toggle="tab" href="#tab_pre_requisite">
                                    <div>
                                      <div className="text-start">Pre-Requisite Requirements</div>
                                      <div className="text-start fs-7 text-gray-700">Due Date [date]</div>
                                    </div>
                                    {
                                        (nbiClearance.exists && birthCertificate.exists && medicalExam.exists)
                                        ? <div> <KTIcon iconName='verify' className='text-success'/> Done </div>
                                        : <div> <KTIcon iconName='information' className='text-info'/> In Progress </div>
                                    }
                                  </a>
                              </li>
                              <li className="nav-item my-1">
                                  <a className="btn btn-sm nav-link btn-secondary d-flex justify-content-between align-items-center" data-bs-toggle="tab" href="#tab_general_req">
                                    <div>
                                      <div className="text-start">General Requirements</div>
                                      <div className="text-start fs-7 text-gray-700">Due Date [date]</div>
                                    </div>
                                    {
                                        (pagibig.exists && philhealth.exists && tin.exists && sss.exists && diploma.exists && (coreInfoSheet.civilStatus == "Married" ? marriageCert.exists : true) && dependentCert.exists && employmentCert.exists && form2316.exists)
                                        ? <div> <KTIcon iconName='verify' className='text-success'/> Done </div>
                                        : <div> <KTIcon iconName='information' className='text-info'/> In Progress </div>
                                    }
                                  </a>
                              </li>
                              <li className="nav-item my-1">
                                  <a className="btn btn-sm nav-link btn-secondary d-flex justify-content-between align-items-center" data-bs-toggle="tab" href="#tab_wfh_eligibility">
                                    <div>
                                      <div className="text-start">WFH Eligibility</div>
                                      <div className="text-start fs-7 text-gray-700">Due Date [date]</div>
                                    </div>
                                    {
                                        wfhInformation
                                        ? <div> <KTIcon iconName='watch' className='text-warning'/> Needs Approval </div>
                                        : wfhInformation.workFromHomeApproval && wfhInformation.workFromHomeApproval1 ? 
                                        <div> <KTIcon iconName='verify' className='text-success'/> Done </div>
                                        : <div> <KTIcon iconName='information' className='text-info'/> In Progress </div>
                                    }
                                  </a>
                              </li>
                              <li />
                          </ul>

                </div>
              </div>
              <div className='col-8 '>
                <div className="card card-flush hover-scroll p-5 mb-0">
                    <div className="tab-content" id="myTabContent">
                        {/* <div className="tab-pane fade show active" id="tab_job_offer" role="tabpanel">
                          <h2>{candidateId}</h2>
                        </div> */}
                        <div className="tab-pane fade" id="tab_core_info" role="tabpanel">
                          <h4 className="text-danger">Personal Informations</h4>
                          <form onSubmit={formik.handleSubmit}>
                          <div className='fv-row d-flex mb-3'>
                            <div className='me-2 flex-fill'>
                            <label className='form-label required fs-8'>Last Name</label>
                            <input
                                name='lastName'
                                className='form-control form-control-sm'
                                value={formik.values.lastName}
                                onChange={formik.handleChange}
                            />
                            {formik.touched.lastName && formik.errors.lastName && (
                                <div className='text-danger mt-2'>{formik.errors.lastName}</div>
                            )}
                            </div>
                            <div className='me-2 flex-fill'>
                            <label className='form-label required fs-8'>First Name</label>

                            <input
                                name='firstName'
                                className='form-control form-control-sm'
                                value={formik.values.firstName}
                                onChange={formik.handleChange}
                            />
                            {formik.touched.firstName && formik.errors.firstName && (
                                <div className='text-danger mt-2'>{formik.errors.firstName}</div>
                            )}
                            </div>
                            <div className='me-2 flex-fill'>
                            <label className='form-label fs-8'>Middle Name</label>
                            <input
                                name='middleName'
                                className='form-control form-control-sm'
                                value={formik.values.middleName}
                                onChange={formik.handleChange}
                            />
                            </div>
                            <div  className='flex-fill'>
                            <label className='form-label required fs-8'>Middle Name Prefix</label>
                            <input
                                name='middleNamePrefix'
                                className='form-control form-control-sm'
                                value={formik.values.middleNamePrefix}
                                onChange={formik.handleChange}
                            />
                            {formik.touched.middleNamePrefix && formik.errors.middleNamePrefix && (
                                <div className='text-danger mt-2'>{formik.errors.middleNamePrefix}</div>
                            )}
                            </div>
                          </div>

                          <div className='fv-row d-flex mb-3'>
                            <div className='me-2 flex-fill col-3'>
                            <label className='form-label fs-8'>Suffix</label>
                            <input
                                name='suffix'
                                className='form-control form-control-sm'
                                value={formik.values.suffix}
                                onChange={formik.handleChange}
                            />
                            </div>
                            <div className='me-2 flex-fill col-3'>
                            <label className='form-label required fs-8'>Salutation</label>

                            <select
                                name='salutation'
                                className='form-control form-control-sm'
                                value={formik.values.salutation}
                                onChange={formik.handleChange}
                            >
                                <option value='' disabled>Select Salutation</option>
                                <option value='Mr'>Mr</option>
                                <option value='Ms'>Ms</option>
                                <option value='Mrs'>Mrs</option>
                            </select>
                            {formik.touched.salutation && formik.errors.salutation && (
                                <div className='text-danger mt-2'>{formik.errors.salutation}</div>
                            )}
                            </div>
                            <div className='me-2 flex-fill col-3'>
                            <label className='form-label required fs-8'>Gender</label>
                            <select
                                name='gender'
                                className='form-control form-control-sm'
                                value={formik.values.gender}
                                onChange={formik.handleChange}
                            >
                                <option value='' disabled>Select Gender</option>
                                <option value='Male'>Male</option>
                                <option value='Female'>Female</option>
                            </select>
                            {formik.touched.gender && formik.errors.gender && (
                                <div className='text-danger mt-2'>{formik.errors.gender}</div>
                            )}
                            </div>
                            <div  className='flex-fill col-3'>
                            <label className='form-label required fs-8'>Civil Status</label>
                            <select
                                name='civilStatus'
                                className='form-control form-control-sm'
                                value={formik.values.civilStatus}
                                onChange={formik.handleChange}
                            >
                                <option value='' disabled>Select Civil Status</option>
                                <option value='Married'>Married</option>
                                <option value='Widowed'>Widowed</option>
                                <option value='Separate'>Separate</option>
                                <option value='Divorced'>Divorced</option>
                                <option value='Single'>Single</option>
                            </select>
                            {formik.touched.civilStatus && formik.errors.civilStatus && (
                                <div className='text-danger mt-2'>{formik.errors.civilStatus}</div>
                            )}
                            </div>
                          </div>

                          <div className='fv-row d-flex mb-3'>
                            <div className='me-2 col-3'>
                                <label className='form-label required fs-8'>Date of Birth</label>
                                <input 
                                    type="dateOfBirth" 
                                    className="form-control form-control-sm" 
                                    value={formik.values.dateOfBirth}
                                    onChange={formik.handleChange}
                                />
                                {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
                                    <div className='text-danger mt-2'>{formik.errors.dateOfBirth}</div>
                                )}
                            </div>
                            <div className='col-3'>
                                <label className='form-label required fs-8'>Educational Attainment</label>
                                <select
                                    name='educationalAttainment'
                                    className='form-control form-control-sm'
                                    value={formik.values.educationalAttainment}
                                    onChange={formik.handleChange}
                                >
                                    <option value='' disabled>Select Education Attainment</option>
                                    <option value='Elementary Graduate'>Elementary Graduate</option>
                                    <option value='High School Gradute'>High School Gradute</option>
                                    <option value='Undergradute'>Undergradute</option>
                                    <option value='Trade/Technical/Vocational Traning'>Trade/Technical/Vocational Traning</option>
                                    <option value="Master's Degree">Master's Degree</option>
                                    <option value="Professional Degree">Professional Degree</option>
                                    <option value="Doctoral Degree">Doctoral Degree</option>
                                </select>
                                {formik.touched.educationalAttainment && formik.errors.educationalAttainment && (
                                    <div className='text-danger mt-2'>{formik.errors.educationalAttainment}</div>
                                )}
                            </div>
                          </div>

                          <div className='fv-row d-flex mb-3'>
                            <div className='me-2 flex-fill col-3'>
                            <label className='form-label required fs-8'>Current Address</label>
                            <input
                                name='currentAddress'
                                className='form-control form-control-sm'
                                value={formik.values.currentAddress}
                                onChange={formik.handleChange}
                            />
                            {formik.touched.currentAddress && formik.errors.currentAddress && (
                                <div className='text-danger mt-2'>{formik.errors.currentAddress}</div>
                            )}
                            </div>
                            <div className='me-2 flex-fill col-3'>
                            <label className='form-label required fs-8'>City/Province</label>

                            <select
                                name='currentCityProvince'
                                className='form-control form-control-sm'
                                value={formik.values.currentCityProvince}
                                onChange={formik.handleChange}
                            >
                                <option value='' disabled>Select Province</option>
                                {provinces.map((prov) => (
                                <option key={prov.code} value={prov.code}>
                                    {prov.name}
                                </option>
                                ))}
                            </select>
                            {formik.touched.currentCityProvince && formik.errors.currentCityProvince && (
                                <div className='text-danger mt-2'>{formik.errors.currentCityProvince}</div>
                            )}
                            </div>
                            <div className='me-2 flex-fill col-3'>
                            <label className='form-label required fs-8'>Location</label>
                            <select
                                name='currentLocation'
                                className='form-control form-control-sm'
                                value={formik.values.currentLocation}
                                onChange={formik.handleChange}
                            >
                                <option value='' disabled>Select City/Municipality</option>
                                {availableCities.map((city) => (
                                <option key={city.code} value={city.name}>
                                    {city.name}
                                </option>
                                ))}
                            </select>
                            {formik.touched.currentLocation && formik.errors.currentLocation && (
                                <div className='text-danger mt-2'>{formik.errors.currentLocation}</div>
                            )}
                            </div>
                            <div  className='flex-fill col-3'>
                            <label className='form-label required fs-8'>Zipcode</label>
                            <input
                                name='currentZipcode'
                                className='form-control form-control-sm'
                                value={formik.values.currentZipcode}
                                onChange={formik.handleChange}
                            />
                            {formik.touched.currentZipcode && formik.errors.currentZipcode && (
                                <div className='text-danger mt-2'>{formik.errors.currentZipcode}</div>
                            )}
                            </div>
                          </div>

                          <div className='fv-row d-flex mb-3'>
                            <div className='me-2 flex-fill col-3'>
                            <label className='form-label required fs-8'>Permanent Address</label>
                            <input
                                name='permanentAddress'
                                className='form-control form-control-sm'
                                value={formik.values.permanentAddress}
                                onChange={formik.handleChange}
                            />
                            {formik.touched.permanentAddress && formik.errors.permanentAddress && (
                                <div className='text-danger mt-2'>{formik.errors.permanentAddress}</div>
                            )}
                            </div>
                            <div className='me-2 flex-fill col-3'>
                            <label className='form-label required fs-8'>City/Province</label>
                            <select
                                name='permanentCityProvince'
                                className='form-control form-control-sm'
                                value={formik.values.permanentCityProvince}
                                onChange={formik.handleChange}
                            >
                                <option value='' disabled>Select Province</option>
                                {provinces.map((prov) => (
                                <option key={prov.code} value={prov.code}>
                                    {prov.name}
                                </option>
                                ))}
                            </select>
                            {formik.touched.permanentCityProvince && formik.errors.permanentCityProvince && (
                                <div className='text-danger mt-2'>{formik.errors.permanentCityProvince}</div>
                            )}
                            </div>
                            <div className='me-2 flex-fill col-3'>
                            <label className='form-label required fs-8'>Location</label>
                            <select
                                name='permanentLocation'
                                className='form-control form-control-sm'
                                value={formik.values.permanentLocation}
                                onChange={formik.handleChange}
                            >
                                <option value='' disabled>Select City</option>
                                {availablePermanentCities.map((city) => (
                                <option key={city.code} value={city.name}>
                                    {city.name}
                                </option>
                                ))}
                            </select>
                            {formik.touched.permanentLocation && formik.errors.permanentLocation && (
                                <div className='text-danger mt-2'>{formik.errors.permanentLocation}</div>
                            )}
                            </div>
                            <div  className='flex-fill col-3'>
                            <label className='form-label required fs-8'>Zipcode</label>
                            <input
                                name='permanentZipcode'
                                className='form-control form-control-sm'
                                value={formik.values.permanentZipcode}
                                onChange={formik.handleChange}
                            />
                            {formik.touched.permanentZipcode && formik.errors.permanentZipcode && (
                                <div className='text-danger mt-2'>{formik.errors.permanentZipcode}</div>
                            )}
                            </div>
                          </div>

                          <div className="separator border-secondary my-2"></div>

                          <h4 className="text-danger mt-4">Contact Information</h4>

                          <div className='fv-row d-flex mb-3'>
                            <div className='me-2 flex-fill'>
                            <label className='form-label fs-8'>landlineNo</label>
                            <input
                                name='landlineNo'
                                className='form-control form-control-sm'
                                value={formik.values.landlineNo}
                                onChange={formik.handleChange}
                            />
                            </div>
                            <div className='me-2 flex-fill'>
                            <label className='form-label required fs-8'>Mobile Number</label>

                            <input
                                name='mobileNo'
                                className='form-control form-control-sm'
                                value={formik.values.mobileNo}
                                onChange={formik.handleChange}
                            />
                            {formik.touched.mobileNo && formik.errors.mobileNo && (
                                <div className='text-danger mt-2'>{formik.errors.mobileNo}</div>
                            )}
                            </div>
                            <div className='me-2 flex-fill'>
                            <label className='form-label required fs-8'>Alternate Number</label>
                            <input
                                name='alternativeMobileNo'
                                className='form-control form-control-sm'
                                value={formik.values.alternativeMobileNo}
                                onChange={formik.handleChange}
                            />
                            {formik.touched.alternativeMobileNo && formik.errors.alternativeMobileNo && (
                                <div className='text-danger mt-2'>{formik.errors.alternativeMobileNo}</div>
                            )}
                            </div>
                            <div  className='flex-fill'>
                            <label className='form-label required fs-8'>Email</label>
                            <input
                                name='personalEmail'
                                className='form-control form-control-sm'
                                value={formik.values.alternativeMobileNo}
                                onChange={formik.handleChange}
                            />
                            {formik.touched.personalEmail && formik.errors.personalEmail && (
                                <div className='text-danger mt-2'>{formik.errors.personalEmail}</div>
                            )}
                            </div>
                          </div>

                          <div className='fv-row gap-1 d-flex mb-3'>
                            <div className=' col-3'>
                            <label className='form-label required fs-8'>Emergency Contact Person</label>
                            <input
                                name='emergencyContactPerson'
                                className='form-control form-control-sm'
                                value={formik.values.emergencyContactPerson}
                                onChange={formik.handleChange}
                            />
                            {formik.touched.emergencyContactPerson && formik.errors.emergencyContactPerson && (
                                <div className='text-danger mt-2'>{formik.errors.emergencyContactPerson}</div>
                            )}
                            </div>
                            <div className=' col-3'>
                            <label className='form-label required fs-8'>Emergency Contact Number</label>

                            <input
                                name='emergencyContactNo'
                                className='form-control form-control-sm'
                                value={formik.values.emergencyContactNo}
                                onChange={formik.handleChange}
                            />
                            {formik.touched.emergencyContactNo && formik.errors.emergencyContactNo && (
                                <div className='text-danger mt-2'>{formik.errors.emergencyContactNo}</div>
                            )}
                            </div>
                            <div className='col-3'>
                            <label className='form-label required fs-8'>Relation</label>
                            <input
                                name='emergencyRelation'
                                className='form-control form-control-sm'
                                value={formik.values.emergencyContactNo}
                                onChange={formik.handleChange}
                            />
                            {formik.touched.emergencyRelation && formik.errors.emergencyRelation && (
                                <div className='text-danger mt-2'>{formik.errors.emergencyRelation}</div>
                            )}
                            </div>
                          </div>

                          <div className="separator border-secondary my-2"></div>

                          <h4 className="text-danger mt-4">Government Information</h4>

                          <div className='fv-row d-flex mb-3'>
                            <div className='me-2 flex-fill'>
                            <label className='form-label required fs-8'>Social Security System (SSS)</label>
                            <input
                                name='sssidNo'
                                className='form-control form-control-sm'
                                value={formik.values.sssidNo}
                                onChange={formik.handleChange}
                            />
                            {formik.touched.sssidNo && formik.errors.sssidNo && (
                                <div className='text-danger mt-2'>{formik.errors.sssidNo}</div>
                            )}
                            </div>
                            <div className='me-2 flex-fill'>
                            <label className='form-label required fs-8'>Philhealth</label>
                            <input
                                name='philhealthIdNo'
                                className='form-control form-control-sm'
                                value={formik.values.philhealthIdNo}
                                onChange={formik.handleChange}
                            />
                            {formik.touched.philhealthIdNo && formik.errors.philhealthIdNo && (
                                <div className='text-danger mt-2'>{formik.errors.philhealthIdNo}</div>
                            )}
                            </div>
                            <div className='me-2 flex-fill'>
                            <label className='form-label required fs-8'>TIN</label>
                            <input
                                name='tinidNo'
                                className='form-control form-control-sm'
                                value={formik.values.tinidNo}
                                onChange={formik.handleChange}
                            />
                            {formik.touched.tinidNo && formik.errors.tinidNo && (
                                <div className='text-danger mt-2'>{formik.errors.tinidNo}</div>
                            )}
                            </div>
                            <div  className='flex-fill'>
                            <label className='form-label required fs-8'>PagIBIG</label>
                            <input
                                name='pagibigIdNo'
                                className='form-control form-control-sm'
                                value={formik.values.pagibigIdNo}
                                onChange={formik.handleChange}
                            />
                            {formik.touched.pagibigIdNo && formik.errors.pagibigIdNo && (
                                <div className='text-danger mt-2'>{formik.errors.pagibigIdNo}</div>
                            )}
                            </div>
                          </div>

                          <div className="separator border-secondary my-2"></div>

                          <h4 className="text-danger mt-4">Government Information</h4>

                          <div className='fv-row d-flex mb-3'>
                            <div className='me-2 flex-fill'>
                            <label className='form-label required fs-8'>Department</label>
                            <input
                                name='department'
                                className='form-control form-control-sm'
                                value={formik.values.department}
                                onChange={formik.handleChange}
                            />
                            {/* {formik.touched.menuName && formik.errors.menuName && (
                                <div className='text-danger mt-2'>{formik.errors.menuName}</div>
                            )} */}
                            </div>
                            <div className='me-2 flex-fill'>
                            <label className='form-label required fs-8'>Start Date</label>

                            <input
                                name='startDate'
                                className='form-control form-control-sm'
                                // {...formik.getFieldProps('menuName')}
                            />
                            {/* {formik.touched.menuName && formik.errors.menuName && (
                                <div className='text-danger mt-2'>{formik.errors.menuName}</div>
                            )} */}
                            </div>
                            <div className='me-2 flex-fill'>
                            <label className='form-label required fs-8'>Orientation Date</label>
                            <input
                                name='orientationDate'
                                className='form-control form-control-sm'
                                // {...formik.getFieldProps('menuName')}
                            />
                            {/* {formik.touched.menuName && formik.errors.menuName && (
                                <div className='text-danger mt-2'>{formik.errors.menuName}</div>
                            )} */}
                            </div>
                            <div  className='flex-fill'>
                            <label className='form-label required fs-8'>NT Login</label>
                            <input
                                name='NTLogin'
                                className='form-control form-control-sm'
                                // {...formik.getFieldProps('menuPath')}
                            />
                            {/* {formik.touched.menuPath && formik.errors.menuPath && (
                                <div className='text-danger mt-2'>{formik.errors.menuPath}</div>
                            )} */}
                            </div>
                          </div>

                          <div className='fv-row d-flex mb-3'>
                            <div className='me-2 flex-fill'>
                            <label className='form-label required fs-8'>Company Email</label>
                            <input
                                name='companyEmail'
                                className='form-control form-control-sm'
                                // {...formik.getFieldProps('menuName')}
                            />
                            {/* {formik.touched.menuName && formik.errors.menuName && (
                                <div className='text-danger mt-2'>{formik.errors.menuName}</div>
                            )} */}
                            </div>
                            <div  className='w-25'>
                            </div>
                            <div  className='w-25'>
                            </div>
                            <div  className='w-25'>
                            </div>
                          </div>
                          <button type='submit' className='btn btn-primary'>Submit</button>
                          </form>
                        </div>
                        <div className="tab-pane fade" id="tab_pre_requisite" role="tabpanel " >
                            <h4 className="card-title text-danger mb-5 fw-bold">Pre-Requisite Requirements</h4>
                            {/* <Accordion>
                                <Accordion.Item eventKey="0" className='text-center'>
                                    <Accordion.Header >
                                        <Form.Check type="checkbox" checked={nbiClearance.exists} disabled className="me-3" />
                                        <h3 className='fw-bold m-0 '>Updated and original NBI clearance/ Police/ Barangay Clearance</h3>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <PdfOrImagePreview fileUrl={nbiFileUrl} fileType={nbiClearance.type} />
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>

                            <Accordion>
                                <Accordion.Item eventKey="0" className='text-center'>
                                    <Accordion.Header >
                                        <Form.Check type="checkbox" checked={birthCertificate.exists} disabled className="me-3" />
                                        <h3 className='fw-bold m-0 '>PSA/ NSO Birth Certificate</h3>
                                        </Accordion.Header>
                                    <Accordion.Body>
                                        <PdfOrImagePreview fileUrl={birthCertFileUrl} fileType={birthCertificate.type} />
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>

                            <Accordion>
                                <Accordion.Item eventKey="0" className='text-center'>
                                    <Accordion.Header >
                                        <Form.Check type="checkbox" checked={medicalExam.exists} disabled className="me-3" />
                                        <h3 className='fw-bold m-0 '>Pre-Employment Medical Exam</h3>
                                        </Accordion.Header>
                                    <Accordion.Body>
                                        <PdfOrImagePreview fileUrl={medicalFileUrl} fileType={medicalExam.type} />
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion> */}
                        </div>
                        <div className="tab-pane fade" id="tab_general_req" role="tabpanel">
                            <h4 className="card-title text-danger mb-5 fw-bold">General Requirements</h4>
                            {/* <Accordion>
                                <Accordion.Item eventKey="0" className='text-center'>
                                    <Accordion.Header >
                                        <Form.Check type="checkbox" checked={pagibig.exists} disabled className="me-3" />
                                        <h3 className='fw-bold m-0 '>PagIBIG / MID</h3>
                                    </Accordion.Header>
                                    {pagibig.exists && 
                                    <Accordion.Body>
                                        <PdfOrImagePreview fileUrl={pagibigFileUrl} fileType={pagibig.type} />
                                    </Accordion.Body>}
                                    
                                </Accordion.Item>
                            </Accordion>

                            <Accordion>
                                <Accordion.Item eventKey="0" className='text-center'>
                                    <Accordion.Header >
                                        <Form.Check type="checkbox" checked={philhealth.exists} disabled className="me-3" />
                                        <h3 className='fw-bold m-0 '>Philhealth</h3>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <PdfOrImagePreview fileUrl={philhealthFileUrl} fileType={philhealth.type} />
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>

                            <Accordion>
                                <Accordion.Item eventKey="0" className='text-center'>
                                    <Accordion.Header >
                                        <Form.Check type="checkbox" checked={tin.exists} disabled className="me-3" />
                                        <h3 className='fw-bold m-0 '>Tax Identification Number (TIN)</h3>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                    <PdfOrImagePreview fileUrl={tinFileUrl} fileType={tin.type} />
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>

                            <Accordion>
                                <Accordion.Item eventKey="0" className='text-center'>
                                    <Accordion.Header >
                                        <Form.Check type="checkbox" checked={sss.exists} disabled className="me-3" />
                                        <h3 className='fw-bold m-0 '>Social Security System(SSS)</h3>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <PdfOrImagePreview fileUrl={sssFileUrl} fileType={sss.type} />
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>

                            <Accordion>
                                <Accordion.Item eventKey="0" className='text-center'>
                                    <Accordion.Header >
                                        <Form.Check type="checkbox" checked={diploma.exists} disabled className="me-3" />
                                        <h3 className='fw-bold m-0 '>Diploma/ Transcript of Records/ Any proof of educational attainment</h3>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <PdfOrImagePreview fileUrl={diplomaFileUrl} fileType={diploma.type} />
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>

                            <Accordion>
                                <Accordion.Item eventKey="0" className='text-center'>
                                    <Accordion.Header >
                                        <Form.Check type="checkbox" checked={marriageCert.exists} disabled className="me-3" />
                                        <h3 className='fw-bold m-0 '>PSA/ NSO Marriage Certificate (if married) </h3>
                                    </Accordion.Header>
                                    {marriageCert.exists &&
                                    <Accordion.Body>
                                        <PdfOrImagePreview fileUrl={marriageFileUrl} fileType={marriageCert.type} />    
                                    </Accordion.Body>
                                    }
                                    
                                </Accordion.Item>
                            </Accordion>

                            <Accordion>
                                <Accordion.Item eventKey="0" className='text-center'>
                                    <Accordion.Header >
                                        <Form.Check type="checkbox" checked={dependentCert.exists} disabled className="me-3" />
                                        <h3 className='fw-bold m-0 '>Dependent/ s PSA/ NSO Birth Certificate</h3>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <PdfOrImagePreview fileUrl={dependentFileUrl} fileType={dependentCert.type} />    
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>

                            <Accordion>
                                <Accordion.Item eventKey="0" className='text-center'>
                                    <Accordion.Header >
                                        <Form.Check type="checkbox" checked={employmentCert.exists} disabled className="me-3" />
                                        <h3 className='fw-bold m-0 '>Certificate of Employment from most recent employer/ Signed resignation letter/ Clearance</h3>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                      <PdfOrImagePreview fileUrl={employmentFileUrl} fileType={employmentCert.type} />    
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>

                            <Accordion>
                                <Accordion.Item eventKey="0" className='text-center'>
                                    <Accordion.Header >
                                        <Form.Check type="checkbox" checked={form2316.exists} disabled className="me-3" />
                                        <h3 className='fw-bold m-0 '>Current Year’s 2316</h3>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <PdfOrImagePreview fileUrl={form2316FileUrl} fileType={form2316.type} />
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion> */}
                            
                        </div>
                        <div className="tab-pane fade" id="tab_wfh_eligibility" role="tabpanel">
                        <h4 className="text-danger">WFH Application</h4>

                          <div className='fv-row d-flex mb-3'>
                            <div className='me-2 col-4'>
                            <label className='form-label required fs-8'>Work Location</label>

                            <input
                                name='workLocation'
                                className='form-control form-control-sm'
                                defaultValue={wfhInformation.workLocation}
                            />
                            </div>
                            <div className='me-2 col-4'>
                            <label className='form-label required fs-8'>What is the pin location of your address?</label>
                            <input
                                name='pinLocation'
                                className='form-control form-control-sm'
                                defaultValue={wfhInformation.pinLocation}
                            />
                            </div>
                            <div  className='col-4'>
                            <label className='form-label required fs-8'>Which is your internet provider?</label>
                            <input
                                name='internetProvider'
                                className='form-control form-control-sm'
                                defaultValue={wfhInformation.internetProvider}
                            />
                            </div>
                          </div>

                          <div className='fv-row d-flex mb-3'>
                            <div className='me-2 col-4'>
                            <label className='form-label required fs-8'>What type of internet service do you have?</label>

                            <input
                                name='internetService'
                                className='form-control form-control-sm'
                                defaultValue={wfhInformation.internetService}
                            />
                            </div>
                            <div className='me-2 col-4'>
                            <label className='form-label required fs-8'>Upload Internet Speed</label>
                            <input
                                name='uploadSpeed'
                                className='form-control form-control-sm'
                                defaultValue={wfhInformation.uploadInternetSpeed}
                            />
                            </div>
                            <div  className='col-4'>
                            <label className='form-label required fs-8'>Download Internet Speed</label>
                            <input
                                name='downloadSpeed'
                                className='form-control form-control-sm'
                                defaultValue={wfhInformation.downloadInternetSpeed}
                            />
                            </div>
                          </div>

                          <div className='fv-row d-flex mb-3'>
                            <div className='me-2 col-4'>
                            <label className='form-label required fs-8'>Preferred Platform for Video Call</label>

                            <input
                                name='platform'
                                className='form-control form-control-sm'
                                defaultValue={wfhInformation.platformVideoCall}
                            />
                            </div>
                            <div className='me-2 col-4'>
                            <label className='form-label fs-8'>If messenger, provide your account.</label>
                            <input
                                name='messengerAccount'
                                className='form-control form-control-sm'
                                defaultValue={wfhInformation.messengerAccount}
                            />
                            </div>
                            <div  className='col-4'>
                            <label className='form-label required fs-8'>Time Availability for a call</label>
                            <input
                                name='timeAvailability'
                                className='form-control form-control-sm'
                                defaultValue={wfhInformation.availabilityCall}
                            />
                            </div>
                          </div>

                          <div className="separator border-secondary my-5"></div>

                          <div className='fv-row d-flex mb-3'>
                            <div className='me-2 col-6'>
                            {/* <Accordion>
                                <Accordion.Item eventKey="0" className='text-center'>
                                    <Accordion.Header >
                                        <span className='fw-bold m-0 fs-7'>HOW DO I SET UP A WORKSTATION AT HOME?</span>
                                    </Accordion.Header>
                                    {pagibig.exists && 
                                    <Accordion.Body>
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
                                                defaultChecked={wfhInformation[`setUpWorkStation${i+1}`]}
                                            />
                                            <label className="form-check-label text-muted fs-8" htmlFor={`SetUpWorkStation_${i+1}`}>
                                                {label}
                                            </label>
                                            </div>
                                        ))}
                                    </Accordion.Body>}
                                    
                                </Accordion.Item>
                            </Accordion> */}
                            </div>
                            <div className='col-6'>
                            {/* <Accordion>
                                <Accordion.Item eventKey="0" className='text-center'>
                                    <Accordion.Header >
                                        <span className='fw-bold m-0 fs-7'>WHAT ABOUT THE SURROUND AREAS IN MY HOME?</span>
                                    </Accordion.Header>
                                    {pagibig.exists && 
                                    <Accordion.Body>
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
                                                defaultChecked={wfhInformation[`surroundAreas${i+1}`]}
                                            />
                                            <label className="form-check-label text-muted fs-8" htmlFor={`SurroundAreas_${i+1}`}>
                                                {label}
                                            </label>
                                            </div>
                                        ))}
                                    </Accordion.Body>} 
                                </Accordion.Item>
                            </Accordion> */}
                            </div>
                          </div>

                          <div className="separator border-secondary my-5"></div>

                          <div>
                          {documents.map((doc, index) => (
                            <div key={index} className="border rounded p-2">
                                <img
                                    src={doc.url}
                                    alt={`Document ${doc.url}`}
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                />
                            </div>
                        ))}
                          </div>
                        </div>
                    </div>
                </div>
                
              </div>
        </div>
  )
}

export {VerticalNavBar}
