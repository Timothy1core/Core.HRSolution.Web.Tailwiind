import { useState, useEffect, useRef } from 'react';
// import { Modal, Button } from 'react-bootstrap';
import SignaturePad from 'signature_pad';

const SigOptionComponentDecline = ({ onSave }) => {
  const [show, setShow] = useState(false);
  const [reason, setReason] = useState('');

  const clearReason = () => {
    setReason('');
  };

  const saveReason = () => {
    if (!reason.trim()) {
      alert('Please provide a reason for declining.');
      return;
    }
    onSave(reason);
    setShow(false);
    setReason('');
  };

  return (
    <>
    1
      {/* <Button onClick={() => setShow(true)} className='btn btn-sm btn-danger'>Decline</Button>
      <Modal show={show} onHide={() => setShow(false)} animation={false} dialogClassName="modal-dialog-centered modal-lg">
        <Modal.Header>
          <Modal.Title>Decline</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="input-group mb-3">
            <span className="input-group-text">Reason:</span>
            <textarea
              className="form-control"
              rows="4"
              aria-label="With textarea"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className='btn btn-secondary' onClick={clearReason}>Clear</Button>
          <Button className='btn btn-dark' onClick={saveReason}>Save</Button>
        </Modal.Footer>
      </Modal> */}
    </>
  );
};

export { SigOptionComponentDecline };
