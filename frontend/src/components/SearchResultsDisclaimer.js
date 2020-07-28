import React from 'react';
import { useTranslation } from 'react-i18next';

export default function () {
  const { t } = useTranslation();

  return (
    <div style={{ marginTop: '1em', textAlign: 'right' }}>
      <span>{t('common:searchResultsDisclaimer')}</span>
    </div>
  );
}
