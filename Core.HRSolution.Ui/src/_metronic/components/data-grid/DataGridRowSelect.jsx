import React from 'react';
import { Checkbox } from '@/_metronic/components/ui/checkbox';
const DataGridRowSelect = ({
  row
}) => {
  return <Checkbox checked={row.getIsSelected()} onCheckedChange={value => row.toggleSelected(!!value)} aria-label="Select row" className="align-[inherit]" />;
};
export { DataGridRowSelect };