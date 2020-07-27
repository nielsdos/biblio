import React, { useState, useRef } from 'react';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Title from '../components/Title';
import InputAdornment from '@material-ui/core/InputAdornment';
import { useTranslation } from 'react-i18next';
import {makeStyles} from "@material-ui/core/styles";
import ManageStyles from './ManageStyles';
import TextField from '@material-ui/core/TextField';
import {Field, Formik} from "formik";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import EmailOutlinedIcon from '@material-ui/icons/EmailOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import Api from "../Api";
import AddWithDialogButton from '../components/AddWithDialogButton';
import {renderDateTimeField} from '../helpers/renderHelpers';
import TopProgressBar from '../components/TopProgressBar';
import RemoteTable from '../components/RemoteTable';
import Notification from '../components/Notification';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

const useStyles = makeStyles((theme) => ({
  section: {
    marginBottom: theme.spacing(5),
  }
}));

function UserManagement(props) {
  const {t} = useTranslation();
  const classes = ManageStyles();

  return (
    <>
      <div className={classes.toolbar}>
        <AddWithDialogButton
          startIcon={<PersonAddIcon />}
          onSuccess={props.onInvite}
          submit={data => Api.post('users/invites', data)}
          infoText={t('manage:inviteUserText')}
          title={t('manage:inviteUser')}
          successText={t('manage:inviteUserSuccess')}
          defaultErrorField="email"
          submitText={t('manage:sendInvite')}
          formContent={errors => {
            return (
              <>
                <Field
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlinedIcon />
                      </InputAdornment>
                    )
                  }}
                  name="email"
                  type="email"
                  as={TextField}
                  required
                  margin="normal"
                  fullWidth
                  label={t('common:email')}
                  placeholder="email@example.com"
                  autoComplete="email"
                  autoFocus
                  error={!!errors.email}
                  helperText={t(errors.email)}
                />
              </>
            );
          }}
          formInitialValues={{email: ''}}
        />
      </div>

      <RemoteTable
        columns={[
          { title: t('common:firstName'), field: 'first_name' },
          { title: t('common:lastName'), field: 'last_name' },
          { title: t('common:email'), field: 'email' },
          {
            title: t('common:registeredOn'),
            field: 'created_at',
            render: renderDateTimeField,
          },
        ]}
        basePath="users"
      />
    </>
  );
}

function InviteManagement(props) {
  const {t} = useTranslation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteSuccessOpen, setDeleteSuccessOpen] = useState(false);
  const [inviteId, setInviteId] = useState(0);

  const handleClose = () => {
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <Notification
        open={deleteSuccessOpen}
        handleClose={() => setDeleteSuccessOpen(false)}
        text={t('manage:deleteInviteSuccess')}
      />

      <Dialog open={deleteDialogOpen} onClose={handleClose} aria-labelledby={t('manage:deleteInvite')}>
        <Formik
          initialValues={{}}
          onSubmit={(data, {setSubmitting}) => {
            setSubmitting(true);

            Api.delete('users/invites/' + inviteId, data)
              .then(_ => {
                setSubmitting(false);
                handleClose();
                setDeleteSuccessOpen(true);
                props.tableRef.current.onQueryChange();
              })
              .catch(e => {
                setSubmitting(false);
              });
          }}>
          {({handleSubmit, isSubmitting}) => (
            <>
              <TopProgressBar visible={isSubmitting} />
              <DialogTitle>{t('manage:deleteInvite')}</DialogTitle>
              <form onSubmit={handleSubmit}>
                <DialogContent>
                  <DialogContentText>
                    {t('manage:deleteInviteText')}
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>
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

      <RemoteTable
        tableRef={props.tableRef}
        columns={[
          { title: t('manage:emailInvited'), field: 'email' },
          { title: t('manage:emailInviter'), field: 'creator.email', sorting: false },
          {
            title: t('manage:invitedOn'),
            field: 'created_at',
            render: renderDateTimeField,
          },
        ]}
        actions={[
          {
            icon: () => <DeleteIcon color="secondary" />,
            tooltip: t('manage:deleteInvite'),
            onClick: (_event, row) => {
              setInviteId(row.id);
              setDeleteDialogOpen(true);
            }
          }
        ]}
        basePath="users/invites"
      />
    </>
  );
}

export default function() {
  const {t} = useTranslation();
  const tableRef = useRef();
  const classes = useStyles();

  return (
    <Container>
      <div className={classes.section}>
        <Title title={t('manage:users')} />
        <UserManagement
          onInvite={() => tableRef.current.onQueryChange()}
        />
      </div>
      <div className={classes.section}>
        <Title title={t('manage:invites')} />
        <InviteManagement
          tableRef={tableRef}
        />
      </div>
    </Container>
  )
}
