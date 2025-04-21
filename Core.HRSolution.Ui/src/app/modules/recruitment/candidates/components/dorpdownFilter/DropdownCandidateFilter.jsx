import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '@/app/auth'; 
import React, { useState, useEffect  } from 'react';
import { toAbsoluteUrl } from '@/_metronic/utils';
import { useSettings } from '@/_metronic/providers/SettingsProvider';
import { DefaultTooltip, KeenIcon } from '@/_metronic/components';
import { MenuItem, MenuLink, MenuSub, MenuTitle, MenuSeparator, MenuArrow, MenuIcon } from '@/_metronic/components/menu';
import { SelectFilterDropdown } from '../../core/requests/_request';
const DropdownCandidateFilter = ({
  menuItemRef,
  filters,
  setFilters,
  onApply
}) => {
  const {
    selectedClient,
    selectedClientGroup,
    selectedJob,
    selectedSource,
    selectedQualification
  } = filters;

  const [jobProfiles, setJobProfiles] = useState([]);
  const [clients, setClients] = useState([]);
  const [clientGroups, setClientGroups] = useState([]);
  const [sources, setSources] = useState([]);

  useEffect(() => {
    SelectFilterDropdown()
      .then(response => {
        setJobProfiles(response.data.job);
        setClients(response.data.client);
        setClientGroups(response.data.clientGroup);
        setSources(response.data.source);
      })
      .catch(err => console.error("Error fetching filter dropdown data:", err));
  }, []);

  const buildFooter = () => (
    <div className="flex justify-end gap-2 mx-2">
      <button
        type="reset"
        className="btn btn-sm btn-light"
        data-kt-menu-dismiss="true"
        onClick={() => setFilters({
          selectedClient: 0,
          selectedClientGroup: 0,
          selectedJob: 0,
          selectedSource: 0,
          selectedQualification: 0
        })}
      >
        Reset
      </button>
      <button
        type="submit"
        className="btn btn-sm btn-danger"
        data-kt-menu-dismiss="true"
        onClick={onApply}
      >
        Apply
      </button>
    </div>
  );

  return (
    <MenuSub className="menu-default light:border-gray-300 w-[200px] md:w-[250px]" rootClassName="p-0">
      <div className="flex items-center justify-between px-5 gap-1.5">
        <span className='font-bold text-sm'>Filter Options</span>
      </div>

      <MenuSeparator />
      <div className="flex flex-col gap-1">
        <MenuItem className="mx-2">
          <label className="form-label">Department Group:</label>
          <select
            value={selectedClientGroup}
            className='select select-sm'
            onChange={(e) => setFilters(prev => ({ ...prev, selectedClientGroup: parseInt(e.target.value) }))}
          >
            <option value='0' hidden>All</option>
            {clientGroups.map(item => (
              <option key={item.id} value={item.id}>{item.label}</option>
            ))}
          </select>
        </MenuItem>

        <MenuItem className="mx-2">
          <label className="form-label">Department:</label>
          <select
            value={selectedClient}
            className='select select-sm'
            onChange={(e) => setFilters(prev => ({ ...prev, selectedClient: parseInt(e.target.value) }))}
          >
            <option value='0' hidden>All</option>
            {clients.map(item => (
              <option key={item.id} value={item.id}>{item.label}</option>
            ))}
          </select>
        </MenuItem>

        <MenuItem className="mx-2">
          <label className="form-label">Job Position:</label>
          <select
            value={selectedJob}
            className='select select-sm'
            onChange={(e) => setFilters(prev => ({ ...prev, selectedJob: parseInt(e.target.value) }))}
          >
            <option value='0' hidden>All</option>
            {jobProfiles.map(item => (
              <option key={item.id} value={item.id}>{item.position}</option>
            ))}
          </select>
        </MenuItem>

        <MenuItem className="mx-2">
          <label className="form-label">Source:</label>
          <select
            value={selectedSource}
            className='select select-sm'
            onChange={(e) => setFilters(prev => ({ ...prev, selectedSource: parseInt(e.target.value) }))}
          >
            <option value='0' hidden>All</option>
            {sources.map(item => (
              <option key={item.id} value={item.id}>{item.label}</option>
            ))}
          </select>
        </MenuItem>

        <MenuItem className="mx-2">
          <label className="form-label">Qualification:</label>
          <ul className="grid w-full gap-2 md:grid-cols-2">
            {[{ id: 0, label: "Qualified" }, { id: 1, label: "Disqualified" }].map(option => (
              <li key={option.id}>
                <input
                  type="radio"
                  id={`qualification-${option.id}`}
                  name="qualification"
                  value={option.id}
                  className="hidden peer"
                  checked={selectedQualification === option.id}
                  onChange={() => setFilters(prev => ({ ...prev, selectedQualification: option.id }))}
                />
                <label
                  htmlFor={`qualification-${option.id}`}
                  className="inline-flex items-center justify-center w-full text-gray-500 bg-white border border-gray-200 rounded-xl cursor-pointer peer-checked:border-danger peer-checked:text-black peer-checked:bg-red-50 hover:bg-gray-100"
                >
                  <div className="block w-full text-sm justify-center text-center">{option.label}</div>
                </label>
              </li>
            ))}
          </ul>
        </MenuItem>
      </div>

      <MenuSeparator />
      {buildFooter()}
    </MenuSub>
  );
};

export { DropdownCandidateFilter };
