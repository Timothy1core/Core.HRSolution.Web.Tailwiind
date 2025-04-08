import { 
  sendEmailForPendingPreReqDocs, 
  sendEmailForPendingGeneralReqDocs
} from '../../core/requests/_request';
import { ApiGateWayUrl} from '../../core/requests/_request';
import { KTIcon } from '@/_metronic/helpers';
// import { Form, Button, Alert,ButtonToolbar, ButtonGroup, Dropdown, Offcanvas  } from 'react-bootstrap';
const ProfileRow = ({
candidateId,
candidateName,
email
}) => {
//   const { mode } = useThemeMode()
//   const cardBg = mode === 'light' ? 'abstract-2.svg' :'abstract-2-dark.svg'

  const handleSendEmailPreRequirements = async () => {
     try {
              const res = await sendEmailForPendingPreReqDocs(candidateId);
      
              if (res?.data?.success) {
                Swal.fire('Email Sent!', 'Email Successfully sent to Candidate.', 'success');
                fetchCandidateInfo();
              } else {
                Swal.fire(
                  'Failed!',
                  res?.data?.responseText || 'An unexpected error occurred.',
                  'warning'
                );
              }
            } catch (error) {
              const errorMessage =
                error?.response?.data?.title || 'Failed to email the candidate.';
              console.error(errorMessage);
              Swal.fire('Error!', errorMessage, 'error');
            }
  } 

  const handleSendEmailGeneralRequirements = async () => {
    try {
             const res = await sendEmailForPendingGeneralReqDocs(candidateId);
     
             if (res?.data?.success) {
               Swal.fire('Email Sent!', 'Email Successfully sent to Candidate.', 'success');
               fetchCandidateInfo();
             } else {
               Swal.fire(
                 'Failed!',
                 res?.data?.responseText || 'An unexpected error occurred.',
                 'warning'
               );
             }
           } catch (error) {
             const errorMessage =
               error?.response?.data?.title || 'Failed to email the candidate.';
             console.error(errorMessage);
             Swal.fire('Error!', errorMessage, 'error');
           }
 } 

  return (
    <div className="card row fs-5 mb-5 mx-1 d-flex">
      <div
        className="hero-bg text-start p-5 py-5 "
        style={{
        //   backgroundImage: `url('${toAbsoluteUrl(`/media/svg/shapes/${cardBg}`)}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'repeat',
        }}
      >
        <div className="container-fluid">
          <div className="d-flex gap-3 align-items-center justify-content-between">
            {candidateId && (
              <div className='d-flex gap-4'>
              <img src={`${ApiGateWayUrl()}/recruitment/onboarding/candidate_document/${candidateId}/idPicture`} alt="Document" className='border rounded' style={{ width: '100%', maxWidth: '120px', aspectRatio: '1 / 1', objectFit: 'cover' }} />
              <div>
                <div className="d-flex align-items-center gap-2 pt-4">
                    <h2 className="card-title mb-0 fw-bold">{candidateName}</h2>
                </div>
                <div className="d-flex align-items-center gap-2 ">
                  <span className="fw-medium text-muted fs-6">{email}</span>
                </div>
                </div>
              </div>
            )}
            <div>
              
            </div>
            <div className="text-end align-items-end justify-content-end">
            {/* <ButtonToolbar aria-label="Toolbar with button groups" className='text-end'>
              <ButtonGroup size="sm" className="me-2 py-1" aria-label="First group">
                <Dropdown>
                  <Dropdown.Toggle variant="light" type="button" className='' id="dropdown-basic" >
                    <KTIcon iconName='update-folder'  className='fs-3'/>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item 
                    onClick={handleSendEmailPreRequirements}
                    >
                      Remind Pre-Requisite Requirements
                    </Dropdown.Item>
                    <Dropdown.Item 
                    onClick={handleSendEmailGeneralRequirements}
                    >
                      Remind General Requirements
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </ButtonGroup>
              <ButtonGroup size="sm" className="me-2 py-1" aria-label="First group"> 
                <Button 
                  variant='light' 
                  type="button" 
                  //  onClick={handleShowMoveToStageDrawer}
                >
                  Move Candidate <KTIcon iconName='double-right' className='fs-3'/>
                </Button>
              </ButtonGroup>    
            </ButtonToolbar> */}
            </div>
          </div> 
        </div>
      </div>
    </div>
  )
}

export {ProfileRow}
