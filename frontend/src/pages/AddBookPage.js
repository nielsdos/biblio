import React, {useState} from 'react';
import Container from '@material-ui/core/Container';
import Title from '../components/Title';
import { useTranslation } from 'react-i18next';
import BookAddEditForm from '../components/BookAddEditForm';

export default function() {
  const {t} = useTranslation();

  // TODO
  return (
    <Container>
      <Title title={t('manage:addBook')} />
      <BookAddEditForm
        add
        initialAddValues={{number_of_copies: 1}}
      />
    </Container>
  );
}
