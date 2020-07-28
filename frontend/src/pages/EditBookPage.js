import React, {useEffect} from 'react';
import Container from '@material-ui/core/Container';
import Title from '../components/Title';
import { useTranslation } from 'react-i18next';
import BookAddEditForm from '../components/BookAddEditForm';

export default function() {
  const {t} = useTranslation();

  // TODO
  return (
    <Container>
      <Title title={t('manage:editBook')} />
      <BookAddEditForm
        add={false}
        isbn={'123'} // TODO
      />
    </Container>
  );
}
