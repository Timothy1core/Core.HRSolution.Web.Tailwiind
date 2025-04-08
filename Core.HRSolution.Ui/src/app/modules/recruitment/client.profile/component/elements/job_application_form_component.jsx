import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import { KTIcon } from '@/_metronic/helpers';
import { CreateJobApplicationForm } from '../../core/request/job_profile_request';
import {
  enableLoadingRequest,
  disableLoadingRequest,
} from '../../../../../helpers/loading_request';

const FormRepeater = ({ choices, setChoices }) => {
  useEffect(() => {
    if (!choices.length) {
      setChoices([{ value: '' }]);
    }
  }, [choices, setChoices]);

  const handleAddField = () => setChoices((prev) => [...prev, { value: '' }]);
  const handleRemoveField = (index) =>
    setChoices((prev) => prev.filter((_, i) => i !== index));
  const handleInputChange = (index, event) => {
    setChoices((prev) =>
      prev.map((choice, i) =>
        i === index ? { ...choice, value: event.target.value } : choice
      )
    );
  };

  return (
    <div>
      {choices.map((choice, index) => (
        <div key={index} className="d-flex align-items-center w-100 mb-3">
          <input
            type="text"
            placeholder="Enter choice"
            className="form-control form-control-sm w-75"
            value={choice.value}
            onChange={(e) => handleInputChange(index, e)}
          />
          <button
            type="button"
            className="btn btn-sm btn-icon ms-2"
            onClick={() => handleRemoveField(index)}
          >
            <KTIcon iconName="cross-circle" className="fs-3" />
          </button>
          {index === choices.length - 1 && (
            <button
              type="button"
              className="btn btn-sm btn-icon ms-2"
              onClick={handleAddField}
            >
              <KTIcon iconName="plus-circle" className="fs-3" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

const JobApplicationForm = ({ applicationQuestions }) => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newQuestionType, setNewQuestionType] = useState('');
  const [dropdownChoices, setDropdownChoices] = useState([]);
  const [isRequired, setIsRequired] = useState(false); // Added state for "Required"
  const [validationError, setValidationError] = useState('');
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editedChoices, setEditedChoices] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    if (applicationQuestions) {
      const formattedQuestions = applicationQuestions.map((q) => ({
        id: q.id.toString(),
        question: q.body,
        questionType: q.type,
        required: q.required || false,
        choices:
          q.applicationChoices?.map((choice) => ({
            id: choice.id,
            value: choice.body,
          })) || [],
      }));
      setQuestions(formattedQuestions);
    }
  }, [applicationQuestions]);

  const resetForm = () => {
    setNewQuestion('');
    setNewQuestionType('');
    setDropdownChoices([]);
    setIsRequired(false);
    setValidationError('');
    setEditingQuestion(null);
    setEditedChoices([]);
  };

  const handleSubmit = () => {
    if (!newQuestion.trim() || !newQuestionType.trim()) {
      setValidationError('Question and Type are required.');
      return;
    }
    const newQuestionObj = {
      id: '0',
      question: newQuestion.trim(),
      questionType: newQuestionType.trim(),
      isRequired: isRequired,
      choices: newQuestionType === 'Dropdown' ? [...dropdownChoices] : [],
    };
    setQuestions((prev) => [...prev, newQuestionObj]);
    resetForm();
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setNewQuestion(question.question);
    setNewQuestionType(question.questionType);
    setIsRequired(question.isRequired || false);
    setEditedChoices([...question.choices]);
  };

  const handleSaveEditedQuestion = () => {
    if (!newQuestion.trim()) {
      setValidationError('Question cannot be empty.');
      return;
    }
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === editingQuestion.id
          ? {
              ...q,
              question: newQuestion.trim(),
              questionType: newQuestionType,
              isRequired,
              choices: newQuestionType === 'Dropdown' ? [...editedChoices] : [],
            }
          : q
      )
    );
    resetForm();
  };

  const handleSaveToAPI = async () => {
    enableLoadingRequest();
    try {
      const payload = {
        applicationQuestion: questions.map((q) => ({
          jobId: id,
          id: q.id,
          body: q.question,
          type: q.questionType,
          required: q.isRequired,
          applicationChoices: q.choices.map((choice) => ({
            id: choice.id || 0,
            body: choice.value,
          })),
        })),
      };
      await CreateJobApplicationForm(payload);
      Swal.fire('Success', 'Questions saved successfully!', 'success');
    } catch (error) {
      Swal.fire('Error', 'Failed to save. Please try again.', 'error');
    } finally {
      disableLoadingRequest();
    }
  };

  return (
    <div className="pb-5" data-kt-stepper-element="content">
      <div className="row">
        <div className="col-5">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="text-gray-700">
                {editingQuestion ? 'Edit Question' : 'Add Question'}
              </h3>
              <div className="mb-4">
                <label className="fs-6 fw-semibold mb-2">Type</label>
                <select
                  className="form-select"
                  value={newQuestionType}
                  onChange={(e) => setNewQuestionType(e.target.value)}
                >
                  <option value="">Select Type</option>
                  <option value="ShortAnswer">Short Answer</option>
                  <option value="Dropdown">Dropdown</option>
                  <option value="YesNo">Yes/No</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="fs-6 fw-semibold mb-2">Question</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter a question"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={isRequired}
                    onChange={(e) => setIsRequired(e.target.checked)}
                  />
                  <span className="form-check-label">Required</span>
                </label>
              </div>
              {newQuestionType === 'Dropdown' && (
                <FormRepeater
                  choices={editingQuestion ? editedChoices : dropdownChoices}
                  setChoices={editingQuestion ? setEditedChoices : setDropdownChoices}
                />
              )}
              {validationError && (
                <p className="text-danger small">{validationError}</p>
              )}
              <button
                type="button"
                className={`btn btn-link mb-2 me-5 ${
                  editingQuestion ? 'btn-color-success' : 'btn-color-primary'
                } btn-sm`}
                onClick={editingQuestion ? handleSaveEditedQuestion : handleSubmit}
              >
                {editingQuestion ? 'Save Changes' : 'Add Question'}
              </button>
              {editingQuestion && (
                <button
                  type="button"
                  className="btn btn-link btn-color-gray-500 btn-sm me-5 mb-2"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="col-7">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="text-gray-700">Questions List</h3>
              <ul className="list-group">
                {questions.map((q, index) => (
                  <li
                    key={index}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <span>
                      <strong>{q.questionType}:</strong> {q.question}{' '}
                      {q.required && <span className="badge badge-light-danger">Required</span>}
                      {q.choices?.length > 0 && (
                        <ul className="mt-2">
                          {q.choices.map((choice, idx) => (
                            <li key={idx}>{choice.value}</li>
                          ))}
                        </ul>
                      )}
                    </span>
                    <div>
                      <button
                        className="btn btn-icon btn-sm btn-secondary me-2"
                        onClick={() => handleEditQuestion(q)}
                      >
                        <KTIcon iconName="pencil" className="fs-3" />
                      </button>
                      {/* <button
                        className="btn btn-sm btn-danger"
                        onClick={() =>
                          setQuestions((prev) =>
                            prev.filter((item) => item.id !== q.id)
                          )
                        }
                      >
                        Delete
                      </button> */}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="text-end mt-4">
          <button
            type="button"
            className="btn btn-dark"
            onClick={handleSaveToAPI}
          >
            Save & Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export { JobApplicationForm };
