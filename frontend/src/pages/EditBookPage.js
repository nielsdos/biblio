import React, { useEffect, useState } from 'react';
import Container from '@material-ui/core/Container';
import Alert from '@material-ui/lab/Alert';
import Title from '../components/Title';
import { useTranslation } from 'react-i18next';
import BookAddEditForm from '../components/BookAddEditForm';
import { useParams } from 'react-router-dom';
import Api, { getErrorObjectFromResponse } from '../Api';
import { postProcessResult } from '../components/BookResult';
import NormalSpinner from '../components/NormalSpinner';

export default function () {
  const { t } = useTranslation();
  const { id } = useParams();
  const [bookData, setBookData] = useState(undefined);
  const [updateErrorTexts, setUpdateErrorTexts] = useState({});

  useEffect(() => {
    Api.get('/books/' + id)
      .then((res) => {
        setBookData(postProcessResult(res.data.data));
      })
      .catch((e) => {
        setUpdateErrorTexts(getErrorObjectFromResponse(e, t, 'general'));
      });
  }, [id, t]);

  return (
    <Container>
      <Title title={t('manage:editBook')} />
      {updateErrorTexts.general && (
        <Alert severity="error">{updateErrorTexts.general}</Alert>
      )}
      {bookData ? (
        <BookAddEditForm
          add={false}
          bookData={bookData}
          initialAddValues={{ number_of_copies: bookData.number_of_copies }}
          submit={(_bookData, inputData) => {
            return Api.put('books/' + id, {
              number_of_copies: inputData.number_of_copies,
            });
          }}
        />
      ) : (
        <NormalSpinner />
      )}
    </Container>
  );
}
