import { useState, useEffect, useRef } from 'react';
// import { Modal, Button } from 'react-bootstrap';
import SignaturePad from 'signature_pad';

const SigOptionComponentApprove = ({ onSave }) => {
  const [show, setShow] = useState(false);
  const canvasRef = useRef(null);
  const signaturePadRef = useRef(null);

  useEffect(() => {
    if (!show) return;

    const canvas = canvasRef.current;
    if (!canvas) {
      console.error('Canvas reference is null');
      return;
    }

    signaturePadRef.current = new SignaturePad(canvas, {
      minWidth: 1,
      maxWidth: 2.5,
      penColor: 'black',
    });

    const resizeCanvas = () => {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = 250 * ratio;
      canvas.getContext('2d').scale(ratio, ratio);
      signaturePadRef.current.clear();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [show]);

  const clearSignature = () => {
    signaturePadRef.current.clear();
  };

  const saveSignature = () => {
    if (signaturePadRef.current.isEmpty()) {
      alert('Please provide a signature first.');
      return;
    }
    const dataURL = signaturePadRef.current.toDataURL();
    onSave(dataURL);
    setShow(false);
  };

  return (
    <>
    1
      {/* <Button onClick={() => setShow(true)} className='btn btn-sm btn-danger'>Approve</Button>
      <Modal show={show} onHide={() => setShow(false)} animation={false} dialogClassName="modal-dialog-centered modal-lg">
        <Modal.Header>
          <Modal.Title>Approve</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <canvas
            ref={canvasRef}
            className="border border-gray-300 w-100"
            style={{ maxWidth: '100%', height: '250px' }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button className='btn btn-secondary' onClick={clearSignature}>Clear</Button>
          <Button className='btn btn-dark' onClick={saveSignature}>Save</Button>
        </Modal.Footer>
      </Modal> */}
    </>
  );
};

export { SigOptionComponentApprove };
