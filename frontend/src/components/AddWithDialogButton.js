import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { getErrorObjectFromResponse } from '../Api';
import TopProgressBar from '../components/TopProgressBar';
import Notification from '../components/Notification';

export function AddDialog(props) {
  const { t } = useTranslation();
  const [addErrorTexts, setAddErrorTexts] = useState({});
  const [addSuccessOpen, setAddSuccessOpen] = useState(false);

  return (
    <>
      <Notification
        open={addSuccessOpen}
        handleClose={() => setAddSuccessOpen(false)}
        text={props.successText}
      />

      <Dialog
        open={props.open}
        onClose={props.onClose}
        aria-labelledby={props.title}
      >
        <Formik
          initialValues={props.formInitialValues}
          onSubmit={(data, { setSubmitting }) => {
            setSubmitting(true);
            setAddErrorTexts({});

            props
              .submit(data)
              .then((_) => {
                setSubmitting(false);
                props.onClose();
                setAddSuccessOpen(true);
                props.onSuccess();
              })
              .catch((e) => {
                setAddErrorTexts(
                  getErrorObjectFromResponse(e, t, props.defaultErrorField)
                );
                setSubmitting(false);
              });
          }}
        >
          {({ handleSubmit, isSubmitting }) => (
            <>
              <TopProgressBar visible={isSubmitting} />
              <DialogTitle>{props.title}</DialogTitle>
              <form onSubmit={handleSubmit}>
                <DialogContent>
                  {props.infoText && (
                    <DialogContentText>{props.infoText}</DialogContentText>
                  )}
                  {props.formContent(addErrorTexts)}
                </DialogContent>
                <DialogActions>
                  <Button onClick={props.onClose}>{t('common:cancel')}</Button>
                  <Button type="submit" disabled={isSubmitting} color="primary">
                    {props.submitText || props.title}
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

export default function (props) {
  const [addOpen, setAddOpen] = useState(false);

  const handleClickOpen = () => {
    setAddOpen(true);
  };

  const handleClose = () => {
    setAddOpen(false);
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={handleClickOpen}
        startIcon={props.startIcon}
      >
        {props.title}...
      </Button>

      <AddDialog
        open={addOpen}
        onClose={handleClose}
        submit={props.submit}
        onSuccess={props.onSuccess}
        formContent={props.formContent}
        title={props.title}
        submitText={props.submitText}
        successText={props.successText}
        infoText={props.infoText}
        defaultErrorField={props.defaultErrorField}
        formInitialValues={props.formInitialValues}
      />
    </>
  );
}
