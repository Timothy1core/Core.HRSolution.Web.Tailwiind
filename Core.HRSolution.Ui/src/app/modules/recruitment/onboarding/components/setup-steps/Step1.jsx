import * as Yup from 'yup';
// import { Container } from 'react-bootstrap';
import { useFormik } from 'formik';
import { useState, useEffect } from 'react';
import InputMask from 'react-input-mask';
import { useAuth } from '../../../../../modules/auth';
import { saveOnboardingInformation, updateOnboardingFormInfo } from '../../core/requests/_request';
import provinces from '../../../../../../../public/json/provinces.json';
import cities from '../../../../../../../public/json/citiesMunicipalities.json';
const step1Schema = Yup.object().shape({
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
  currentZipCode: Yup.string().required('Required'),
  permanentAddress: Yup.string().required('Required'),
  permanentCityProvince: Yup.string().required('Required'),
  permanentLocation: Yup.string().required('Required'),
  permanentZipCode: Yup.string().required('Required'),
  mobileNo: Yup.string().required('Required'),
  alternativeMobileNo: Yup.string().required('Required'),
  personalEmail: Yup.string().required('Required'),
  emergencyContactPerson: Yup.string().required('Required'),
  emergencyContactNo: Yup.string().required('Required'),
  emergencyRelation: Yup.string().required('Required'),
  sssidNo: Yup.string().required('Required'),
  philhealthIdNo: Yup.string().required('Required'),
  tinidNo: Yup.string().required('Required'),
  pagibigIdNo: Yup.string().required('Required'),
});

const hasFormChanged = (initialValues, currentValues) => {
  return JSON.stringify(initialValues) !== JSON.stringify(currentValues);
};

const Step1Div = ({ handleNext, id, onboardingInfoSheet }) => {
  const [loading, setLoading] = useState(false);
  const [sameAsCurrentAddress, setSameAsCurrentAddress] = useState(false);
  const [availableCurrentCities, setAvailableCurrentCities] = useState([]);
  const [availablePermanentCities, setAvailablePermanentCities] = useState([]);

  const formik = useFormik({
    initialValues: {
      lastName: onboardingInfoSheet?.lastName || '',
      firstName: onboardingInfoSheet?.firstName || '',
      middleName: onboardingInfoSheet?.middleName || '',
      middleNamePrefix: onboardingInfoSheet?.middleNamePrefix || '',
      salutation: onboardingInfoSheet?.salutation || '',
      gender: onboardingInfoSheet?.gender || '',
      civilStatus: onboardingInfoSheet?.civilStatus || '',
      dateOfBirth: onboardingInfoSheet?.dateOfBirth?.split('T')[0] || '',
      educationalAttainment: onboardingInfoSheet?.educationalAttainment || '',
      currentAddress: onboardingInfoSheet?.currentAddress || '',
      currentCityProvince: onboardingInfoSheet?.currentCityProvince || '',
      currentLocation: onboardingInfoSheet?.currentLocation || '',
      currentZipCode: onboardingInfoSheet?.currentZipcode || '',
      permanentAddress: onboardingInfoSheet?.permanentAddress || '',
      permanentCityProvince: onboardingInfoSheet?.permanentCityProvince || '',
      permanentLocation: onboardingInfoSheet?.permanentLocation || '',
      permanentZipCode: onboardingInfoSheet?.permanentZipcode || '',
      mobileNo: onboardingInfoSheet?.mobileNo || '',
      alternativeMobileNo: onboardingInfoSheet?.alternativeMobileNo || '',
      personalEmail: onboardingInfoSheet?.personalEmail || '',
      emergencyContactPerson: onboardingInfoSheet?.emergencyContactPerson || '',
      emergencyContactNo: onboardingInfoSheet?.emergencyContactNo || '',
      emergencyRelation: onboardingInfoSheet?.emergencyRelation || '',
      sssidNo: onboardingInfoSheet?.sssidNo || '',
      philhealthIdNo: onboardingInfoSheet?.philhealthIdNo || '',
      tinidNo: onboardingInfoSheet?.tinidNo || '',
      pagibigIdNo: onboardingInfoSheet?.pagibigIdNo || '',
    },
    validationSchema: step1Schema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      const hasChanged = hasFormChanged(formik.initialValues, values);
      if (!hasChanged) {
        handleNext();
        return;
      }

      setLoading(true);
      const formData = new FormData();

      Object.entries({
        CandidateId: id,
        LastName: values.lastName,
        FirstName: values.firstName,
        MiddleName: values.middleName,
        MiddleNamePrefix: values.middleNamePrefix,
        Suffix: values.suffix,
        Salutation: values.salutation,
        Gender: values.gender,
        CivilStatus: values.civilStatus,
        DateOfBirth: values.dateOfBirth,
        EducationalAttainment: values.educationalAttainment,
        CurrentAddress: values.currentAddress,
        CurrentCityProvince: values.currentCityProvince,
        CurrentLocation: values.currentLocation,
        CurrentZipCode: values.currentZipCode,
        PermanentAddress: values.permanentAddress,
        PermanentCityProvince: values.permanentCityProvince,
        PermanentLocation: values.permanentLocation,
        PermanentZipCode: values.permanentZipCode,
        MobileNo: values.mobileNo,
        AlternativeMobileNo: values.alternativeMobileNo,
        PersonalEmail: values.personalEmail,
        EmergencyContactPerson: values.emergencyContactPerson,
        EmergencyContactNo: values.emergencyContactNo,
        EmergencyRelation: values.emergencyRelation,
        SssidNo: values.sssidNo,
        PhilhealthIdNo: values.philhealthIdNo,
        TinidNo: values.tinidNo,
        PagibigIdNo: values.pagibigIdNo,
      }).forEach(([key, value]) => formData.append(key, value));

      try {
        const response = onboardingInfoSheet?.lastName
          ? await updateOnboardingFormInfo(id, formData)
          : await saveOnboardingInformation(formData);

        if (response.data.success) {
          handleNext();
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

  useEffect(() => {
    const selectedProvCode = formik.values.currentCityProvince;
    if (selectedProvCode) {
      setAvailableCurrentCities(
        cities.filter((c) => c.province === selectedProvCode)
      );
    } else {
      setAvailableCurrentCities([]);
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

  return (
    // <div className="d-flex flex-column flex-sm-row">
      // <Container className="my-5">
        <form onSubmit={formik.handleSubmit}>
        <h4 className="text-danger">Personal Informations</h4>

          <div className='fv-row d-flex mb-3'>
            <div className='me-2 flex-fill'>
            <label className='form-label required fs-8'>Last Name</label>
            <input
                name='lastName'
                className='form-control form-control-sm'
                {...formik.getFieldProps('lastName')}
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
                {...formik.getFieldProps('firstName')}
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
                {...formik.getFieldProps('middleName')}
            />
            </div>
            <div  className='flex-fill'>
            <label className='form-label required fs-8'>Middle Name Prefix</label>
            <input
                name='middleNamePrefix'
                className='form-control form-control-sm'
                {...formik.getFieldProps('middleNamePrefix')}
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
                {...formik.getFieldProps('suffix')}
            />
            </div>
            <div className='me-2 flex-fill col-3'>
            <label className='form-label required fs-8'>Salutation</label>
            <select
                name='salutation'
                className='form-control form-control-sm'
                {...formik.getFieldProps('salutation')}
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
                {...formik.getFieldProps('gender')}
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
                {...formik.getFieldProps('civilStatus')}
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
             <input type="date" className="form-control form-control-sm" {...formik.getFieldProps('dateOfBirth')} />
             {formik.errors.dateOfBirth && <div className="text-danger mt-2">{formik.errors.dateOfBirth}</div>}
            </div>
            <div className=' col-3'>
            <label className='form-label required fs-8'>Educational Attainment</label>
            <select
                name='educationalAttainment'
                className='form-control form-control-sm'
                {...formik.getFieldProps('educationalAttainment')}
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
            <div className='col-3'>
            </div>
            <div className='col-3'>
            </div>
          </div>

          <div className='fv-row d-flex mb-3'>
            <div className='me-2 flex-fill'>
            <label className='form-label required fs-8'>Current Address</label>
            <input
                name='currentAddress'
                className='form-control form-control-sm'
                {...formik.getFieldProps('currentAddress')}
            />
            {formik.touched.currentAddress && formik.errors.currentAddress && (
                <div className='text-danger mt-2'>{formik.errors.currentAddress}</div>
            )}
            </div>
            <div className='me-2 flex-fill'>
            <label className='form-label required fs-8'>City/Province</label>

            <select
                name='currentCityProvince'
                className='form-control form-control-sm'
                {...formik.getFieldProps('currentCityProvince')}
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
            <div className='me-2 flex-fill'>
            <label className='form-label required fs-8'>Location</label>
            <select
                name='currentLocation'
                className='form-control form-control-sm'
                {...formik.getFieldProps('currentLocation')}
            >
                <option value='' disabled>Select City/Municipality</option>
                {availableCurrentCities.map((city) => (
                <option key={city.code} value={city.name}>
                    {city.name}
                </option>
                ))}
            </select>
            {formik.touched.currentLocation && formik.errors.currentLocation && (
                <div className='text-danger mt-2'>{formik.errors.currentLocation}</div>
            )}
            </div>
            <div  className='flex-fill'>
            <label className='form-label required fs-8'>Zipcode</label>
            {/* <input
                name='currentZipCode'
                className='form-control form-control-sm'
                {...formik.getFieldProps('currentZipCode')}
            />
            {formik.touched.currentZipCode && formik.errors.currentZipCode && (
                <div className='text-danger mt-2'>{formik.errors.currentZipCode}</div>
            )} */}

            <InputMask
            mask="9999"
            {...formik.getFieldProps('currentZipCode')}
            >
            {(inputProps) => (
                <input
                {...inputProps}
                type="text"
                name="currentZipCode"
                className="form-control form-control-sm"
                />
            )}
            </InputMask>
            {formik.touched.currentZipCode && formik.errors.currentZipCode && (
            <div className='text-danger mt-2'>{formik.errors.currentZipCode}</div>
            )}
            </div>
          </div>
          <div className='form-check mb-3'>
        <input
            type='checkbox'
            className='form-check-input'
            id='sameAsCurrentAddress'
            checked={sameAsCurrentAddress}
            onChange={(e) => {
            const checked = e.target.checked;
            setSameAsCurrentAddress(checked);

            if (checked) {
                formik.setFieldValue('permanentAddress', formik.values.currentAddress);
                formik.setFieldValue('permanentCityProvince', formik.values.currentCityProvince);
                formik.setFieldValue('permanentLocation', formik.values.currentLocation);
                formik.setFieldValue('permanentZipCode', formik.values.currentZipCode);
            } else {
                formik.setFieldValue('permanentAddress', '');
                formik.setFieldValue('permanentCityProvince', '');
                formik.setFieldValue('permanentLocation', '');
                formik.setFieldValue('permanentZipCode', '');
            }
            }}
        />
        <label className='form-check-label' htmlFor='sameAsCurrentAddress'>
            Same as current address
        </label>
        </div>
          <div className='fv-row d-flex mb-3'>
            <div className='me-2 flex-fill'>
            <label className='form-label required fs-8'>Permanent Address</label>
            <input
                name='permanentAddress'
                className='form-control form-control-sm'
                {...formik.getFieldProps('permanentAddress')}
            />
            {formik.touched.permanentAddress && formik.errors.permanentAddress && (
                <div className='text-danger mt-2'>{formik.errors.permanentAddress}</div>
            )}
            </div>
            <div className='me-2 flex-fill'>
            <label className='form-label required fs-8'>City/Province</label>
            <select
                name='permanentCityProvince'
                className='form-control form-control-sm'
                {...formik.getFieldProps('permanentCityProvince')}
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
            <div className='me-2 flex-fill'>
            <label className='form-label required fs-8'>Location</label>
            <select
                name='permanentLocation'
                className='form-control form-control-sm'
                {...formik.getFieldProps('permanentLocation')}
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
            <div  className='flex-fill'>
            <label className='form-label required fs-8'>Zipcode</label>
            <InputMask
            mask="9999"
            {...formik.getFieldProps('permanentZipCode')}
            >
            {(inputProps) => (
                <input
                {...inputProps}
                type="text"
                name="permanentZipCode"
                className="form-control form-control-sm"
                />
            )}
            </InputMask>
            {formik.touched.permanentZipCode && formik.errors.permanentZipCode && (
                <div className='text-danger mt-2'>{formik.errors.permanentZipCode}</div>
            )}
            </div>
          </div>

          <div className="separator border-secondary my-2"></div>

          <h4 className="text-danger mt-4">Contact Information</h4>

          <div className='fv-row d-flex mb-3'>
            <div className='me-2 flex-fill'>
            <label className='form-label fs-8'>Landline</label>
            <input
                name='landline'
                className='form-control form-control-sm'
                {...formik.getFieldProps('landline')}
            />
            </div>
            <div className='me-2 flex-fill'>
            <label className='form-label required fs-8'>Mobile Number</label>
            <InputMask
            mask="9999-999-9999"
            {...formik.getFieldProps('mobileNo')}
            >
            {(inputProps) => (
                <input
                {...inputProps}
                type="text"
                name="mobileNo"
                className="form-control form-control-sm"
                />
            )}
            </InputMask>
            {formik.touched.mobileNo && formik.errors.mobileNo && (
                <div className='text-danger mt-2'>{formik.errors.mobileNo}</div>
            )}
            </div>
            <div className='me-2 flex-fill'>
            <label className='form-label fs-8'>Alternate Number</label>
            <InputMask
            mask="9999-999-9999"
            {...formik.getFieldProps('alternativeMobileNo')}
            >
            {(inputProps) => (
                <input
                {...inputProps}
                type="text"
                name="alternativeMobileNo"
                className="form-control form-control-sm"
                />
            )}
            </InputMask>
            </div>
            <div  className='flex-fill'>
            <label className='form-label required fs-8'>Email</label>
            <input
                name='personalEmail'
                className='form-control form-control-sm'
                {...formik.getFieldProps('personalEmail')}
            />
            {formik.touched.personalEmail && formik.errors.personalEmail && (
                <div className='text-danger mt-2'>{formik.errors.personalEmail}</div>
            )}
            </div>
          </div>

          <div className='fv-row d-flex mb-3'>
            <div className='me-2 w-25'>
            <label className='form-label required fs-8'>Emergency Contact Person</label>
            <input
                name='emergencyContactPerson'
                className='form-control form-control-sm'
                {...formik.getFieldProps('emergencyContactPerson')}
            />
            {formik.touched.emergencyContactPerson && formik.errors.emergencyContactPerson && (
                <div className='text-danger mt-2'>{formik.errors.emergencyContactPerson}</div>
            )}
            </div>
            <div className='me-2 w-25'>
            <label className='form-label required fs-8'>Emergency Contact Number</label>
            <InputMask
            mask="9999-999-9999"
            {...formik.getFieldProps('emergencyContactNo')}
            >
            {(inputProps) => (
                <input
                {...inputProps}
                type="text"
                name="emergencyContactNo"
                className="form-control form-control-sm"
                />
            )}
            </InputMask>
            {formik.touched.emergencyContactNo && formik.errors.emergencyContactNo && (
                <div className='text-danger mt-2'>{formik.errors.emergencyContactNo}</div>
            )}
            </div>
            <div className='w-25'>
            <label className='form-label required fs-8'>Relation</label>
            <input
                name='emergencyRelation'
                className='form-control form-control-sm'
                {...formik.getFieldProps('emergencyRelation')}
            />
            {formik.touched.emergencyRelation && formik.errors.emergencyRelation && (
                <div className='text-danger mt-2'>{formik.errors.emergencyRelation}</div>
            )}
            </div>
            <div className='w-25'>
            </div>
          </div>

          <div className="separator border-secondary my-2"></div>

          <h4 className="text-danger mt-4">Government Information</h4>

          <div className='fv-row d-flex mb-3'>
            <div className='me-2 flex-fill'>
            <label className='form-label required fs-8'>Social Security System (SSS)</label>
            <InputMask
            mask="99-9999999-9"
            {...formik.getFieldProps('sssidNo')}
            >
            {(inputProps) => (
                <input
                {...inputProps}
                type="text"
                name="sssidNo"
                className="form-control form-control-sm"
                />
            )}
            </InputMask>
            {formik.touched.sssidNo && formik.errors.sssidNo && (
                <div className='text-danger mt-2'>{formik.errors.sssidNo}</div>
            )}
            </div>
            <div className='me-2 flex-fill'>
            <label className='form-label required fs-8'>Philhealth</label>
            <InputMask
            mask="99-999999999-9"
            {...formik.getFieldProps('philhealthIdNo')}
            >
            {(inputProps) => (
                <input
                {...inputProps}
                type="text"
                name="philhealthIdNo"
                className="form-control form-control-sm"
                />
            )}
            </InputMask>
            {formik.touched.philhealthIdNo && formik.errors.philhealthIdNo && (
                <div className='text-danger mt-2'>{formik.errors.philhealthIdNo}</div>
            )}
            </div>
            <div className='me-2 flex-fill'>
            <label className='form-label required fs-8'>TIN</label>
            <InputMask
            mask="99999-999-999"
            {...formik.getFieldProps('tinidNo')}
            >
            {(inputProps) => (
                <input
                {...inputProps}
                type="text"
                name="tinidNo"
                className="form-control form-control-sm"
                />
            )}
            </InputMask>
            {formik.touched.tinidNo && formik.errors.tinidNo && (
                <div className='text-danger mt-2'>{formik.errors.tinidNo}</div>
            )}
            </div>
            <div  className='flex-fill'>
            <label className='form-label required fs-8'>PagIBIG</label>
            <InputMask
            mask="9999-9999-9999"
            {...formik.getFieldProps('pagibigIdNo')}
            >
            {(inputProps) => (
                <input
                {...inputProps}
                type="text"
                name="pagibigIdNo"
                className="form-control form-control-sm"
                />
            )}
            </InputMask>
            {formik.touched.pagibigIdNo && formik.errors.pagibigIdNo && (
                <div className='text-danger mt-2'>{formik.errors.pagibigIdNo}</div>
            )}
            </div>
          </div>
          <div className="d-flex bd-highlight  gap-5 justify-content-end py-2 mt-5">
            
            <button type="submit" className="btn btn-danger" disabled={loading || formik.isSubmitting}>
              {loading ? 'Saving...' : 'Continue'}
            </button>
          </div>
          </form>
      // </Container>
    /* </div> */
  );
};

export { Step1Div };
