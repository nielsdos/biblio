import React from 'react';
import Container from '@material-ui/core/Container';
import Title from '../components/Title';
import { useTranslation } from 'react-i18next';
import BookAddEditForm from '../components/BookAddEditForm';
import Api from '../Api';

export default function () {
  const { t } = useTranslation();

  return (
    <Container>
      <Title title={t('manage:addBook')} />
      <BookAddEditForm
        add
        initialAddValues={{ number_of_copies: 1 }}
        submit={(bookData, inputData) => {
          return Api.post('books', {
            isbn: bookData.isbn13,
            number_of_copies: inputData.number_of_copies,
          });
        }}
      />
    </Container>
  );
}
