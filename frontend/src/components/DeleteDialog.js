import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import {Formik} from "formik";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TopProgressBar from '../components/TopProgressBar';
import Notification from '../components/Notification';

export default function(props) {
  const {t} = useTranslation();
  const [deleteSuccessOpen, setDeleteSuccessOpen] = useState(false);

  return (
    <>
      <Notification
        open={deleteSuccessOpen}
        handleClose={() => setDeleteSuccessOpen(false)}
        text={props.successText}
      />
      <Dialog open={props.open} onClose={props.onClose} aria-labelledby={t('manage:deleteInvite')}>
        <Formik
          initialValues={{}}
          onSubmit={(data, {setSubmitting}) => {
            setSubmitting(true);

            props.submit(data)
              .then(_ => {
                setSubmitting(false);
                setDeleteSuccessOpen(true);
                props.onClose();
              })
              .catch(_e => {
                setSubmitting(false);
              });
          }}>
          {({handleSubmit, isSubmitting}) => (
            <>
              <TopProgressBar visible={isSubmitting} />
              <DialogTitle>{props.title}</DialogTitle>
              <form onSubmit={handleSubmit}>
                <DialogContent>
                  <DialogContentText>
                    {props.text}
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={props.onClose}>
                    {t('common:cancel')}
                  </Button>
                  <Button type="submit" disabled={isSubmitting} color="secondary">
                    {t('common:delete')}
                  </Button>
                </DialogActions>
              </form>
            </>
          )}
        </Formik>
      </Dialog>
    </>
  );
}
