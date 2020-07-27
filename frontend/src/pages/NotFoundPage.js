import React from 'react';
import { Container } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Title from '../components/Title';

export default function() {
  const {t} = useTranslation();

  return (
    <Container>
      <Title title={t('error:notFound')} />
    </Container>
  );
}
