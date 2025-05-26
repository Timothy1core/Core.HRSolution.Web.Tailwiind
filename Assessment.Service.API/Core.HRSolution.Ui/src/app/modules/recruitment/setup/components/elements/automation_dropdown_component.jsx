import React, { useState, useEffect } from "react";
import {
  SelectAllJobProfileDropDown,
  SelectJobApplicationProcessDropDown,
  SelectEmailTemplateDropDown
} from '../../request/email_template'
import Select from 'react-select'
const SelectAllJobProfileComponent = ({
  name,
  onChange,
  value,
  className,
}) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await SelectAllJobProfileDropDown();
        setOptions(response.data.values || []);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, []);

  return (
    <select name={name} onChange={onChange} value={value} className={className}>
      <option value="">any job</option>
      {options.map((option) => (
        <option key={option.id} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

const SelectJobProfileApplicationProccessComponent = ({
  name,
  onChange,
  value,
  className,
}) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await SelectJobApplicationProcessDropDown();
        setOptions(response.data.values || []);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, []);

  return (
    <select name={name} onChange={onChange} value={value} className={className}>
      <option value="">a stage</option>
      {options.map((option) => (
        <option key={option.id} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};


const SelectEmailTemplateComponent = ({
  name,
  onChange,
  value,
  className,
}) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await SelectEmailTemplateDropDown();
        setOptions(response.data.values || []);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, []);

  return (
    <select name={name} onChange={onChange} value={value} className={className}>
      <option value="">a message template</option>
      {options.map((option) => (
        <option key={option.id} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export {
  SelectAllJobProfileComponent,
  SelectJobProfileApplicationProccessComponent,
  SelectEmailTemplateComponent
};
