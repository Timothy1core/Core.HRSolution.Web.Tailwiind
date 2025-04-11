import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { KTIcon } from '@/_metronic/helpers';
import { useFormik } from 'formik';
// import { Modal } from 'bootstrap';
import { listQuestionTypes } from '../../../core/requests/_request';
import Swal from 'sweetalert2';
import { Dialog, DialogTitle } from '@/_metronic/components/ui/dialog';

const questionSchema = Yup.object().shape({
  questionType: Yup.string().required('Required'),
  questionBody: Yup.string().required('Required'),
  marks: Yup.number().min(0, 'mark cannot be negative').required('Required'),
  answer: Yup.string().required('Required'),
  videoDuration: Yup.number().min(0, 'Video duration cannot be negative').required('Required'),
});

const CreateEditQuestion = ({ onCreateQuestion, selectedQuestion, questions, isCreating, open, }) => {
  // const [editMode, setEditMode] = useState(false);
  // const [loading, setLoading] = useState(false);
  // const [Creating, setCreating] = useState(isCreating);
  // const [choices, setChoices] = useState([]);
  // const [newChoice, setNewChoice] = useState('');
  // const [isEditing, setIsEditing] = useState(false);
  // const [editingIndex, setEditingIndex] = useState(null);
  // const [isAddingChoice, setIsAddingChoice] = useState(false);
  // const [questionTypes, setQuestionTypes] = useState([]);

  // const handleHideModal = () => {
  //   formik.resetForm();
  //   setCreating(true);
  //   const modalElement = document.getElementById('create-question');
  //   // const modalInstance = Modal.getInstance(modalElement);
  //   if (modalElement) {
  //     // Get the modal instance
  //     const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement);

  //     if (modalInstance) {
  //         // Hide the modal using Bootstrap's API
  //         modalInstance.hide();
  //         // Fallback if modal instance isn't correctly initialized
  //         modalElement.classList.remove('show');
  //         modalElement.setAttribute('aria-hidden', 'true');
  //         modalElement.style.display = 'none';

  //         // Remove backdrop manually if any
  //         const backdrop = document.querySelector('.modal-backdrop');
  //         if (backdrop) {
  //             backdrop.parentNode.removeChild(backdrop);
  //         }  
          
  //         // Restore scrolling by removing the 'modal-open' class
  //         document.body.classList.remove('modal-open');
  //         document.body.style.overflow = '';
  //         document.body.style.paddingRight = '';
  //       }
  // }
  // };
  
  // const handleEditChoice = (index) => {
  //   setNewChoice(choices[index]);
  //   setIsAddingChoice(true);
  //   setIsEditing(true);
  //   setEditingIndex(index);
  // };

  // const handleAddChoiceButton = () => {
  //   setIsAddingChoice(true);
  // };

  // const handleSaveChoice = () => {
  //   if (newChoice.trim()) {
  //     if (isEditing) {
  //       const updatedChoices = [...choices];
  //       updatedChoices[editingIndex] = newChoice;
  //       setChoices(updatedChoices);
  //       setIsEditing(false);
  //       setEditingIndex(null);
  //     } else {
  //       setChoices([...choices, newChoice]);
  //     }
  //     setNewChoice('');
  //     setIsAddingChoice(false);
  //   }
  // };

  // const handleDeleteChoice = (index) => {
  //   setChoices(choices.filter((_, i) => i !== index));
  // };

  // const handleCancelChoice = () => {
  //   setNewChoice('');
  //   setIsAddingChoice(false);
  //   setIsEditing(false);
  // };

  // const handleChoiceInputChange = (event) => {
  //   setNewChoice(event.target.value);
  // };


  // // Fetch question types when the component mounts
  // useState(() => {
  //   const fetchQuestionTypes = async () => {
  //     try {
  //       const response = await listQuestionTypes();
  //       if (response.data?.questionTypes) {
  //         setQuestionTypes(response.data.questionTypes);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching question types:", error);
  //       formik.setStatus("Error fetching question types");
  //     }
  //   };



  //   fetchQuestionTypes();
  // }, []);


  // useEffect(() => {
  //   // const modal = new Modal(modalElement);

  //   const handleModalShown = () => {
  //     // const edit = button.getAttribute('data-edit') === 'true';
  //     if (selectedQuestion) {
  //       formik.setValues({
  //         questionType: selectedQuestion.type || '',
  //         questionBody: selectedQuestion.body || '',
  //         marks: selectedQuestion.marks || '',
  //         answer: selectedQuestion.answers?.[0]?.answerBody || '',
  //         required: selectedQuestion.required || false,
  //         videoDuration: selectedQuestion.videoDurations?.[0]?.VideoDurationMinute || 0,
  //       });

  //       if (selectedQuestion.choices) {
  //         setChoices(selectedQuestion.choices.map(choice => choice.choiceBody) || []);
  //       }
  //     }
  //     // setEditMode(edit);
  //     setCreating(Creating);
  //   };



  //   return () => {
  //   handleModalShown()
  //   };
  // }, [selectedQuestion]);

  return (
  <>
    <Dialog open={open} className="relative z-10">
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                    Deactivate account
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to deactivate your account? All of your data will be permanently removed.
                      This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto"
              >
                Deactivate
              </button>
              <button
                type="button"
                data-autofocus
                onClick={() => setOpen(false)}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
        </div>
      </div>
    </Dialog>
  </>
    // <div className="modal fade" id="create-question" aria-hidden="true">
    //   <div className="modal-dialog mw-650px">
    //     <div className="modal-content">
    //       <div className="modal-header pb-0 border-0 justify-content-end">
    //         <div className="btn btn-sm btn-icon btn-active-color-danger" data-bs-dismiss="modal" onClick={handleHideModal}>
    //           <KTIcon iconName="cross" className="fs-1" />
    //         </div>
    //       </div>

    //       <div className="modal-body mx-5 mx-xl-18 pt-0 pb-5">
            
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export {CreateEditQuestion};
