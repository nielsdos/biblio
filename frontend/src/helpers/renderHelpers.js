import React from 'react';
import moment from 'moment';

/**
 * Format date time
 * @param {string} dt Date+time string
 * @return {string}
 */
export function formatDateTime(dt) {
  return moment(dt).local().format('LLL');
}

export const renderDateTimeField = (row) => {
  return <>{formatDateTime(row.created_at)}</>;
};
