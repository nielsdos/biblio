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

export const renderDateTimeField = data => <>{formatDateTime(data)}</>;

export const renderCreatedAtField = row => renderDateTimeField(row.created_at);
