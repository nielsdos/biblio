import React, { useRef } from 'react';
import Container from '@material-ui/core/Container';
import Title from '../components/Title';
import InputAdornment from '@material-ui/core/InputAdornment';
import ManageStyles from '../components/ManageStyles';
import { useTranslation } from 'react-i18next';
import TextField from '@material-ui/core/TextField';
import { Field } from 'formik';
import Api from '../Api';
import AddWithDialogButton from '../components/AddWithDialogButton';
import { renderDateTimeField } from '../helpers/renderHelpers';
import RemoteTable from '../components/RemoteTable';
import PermIdentityOutlinedIcon from '@material-ui/icons/PermIdentityOutlined';
import AddCircleIcon from '@material-ui/icons/AddCircle';

function BorrowerManagement(props) {
  const { t } = useTranslation();
  const classes = ManageStyles();
  const tableRef = useRef();

  return (
    <>
      <div className={classes.toolbar}>
        <AddWithDialogButton
          startIcon={<AddCircleIcon />}
          onSuccess={() => tableRef.current.onQueryChange()}
          submit={(data) => Api.post('borrowers', data)}
          title={t('manage:addBorrower')}
          successText={t('manage:addBorrowerSuccess')}
          defaultErrorField="first_name"
          formContent={(errors) => {
            return (
              <>
                <Field
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PermIdentityOutlinedIcon />
                      </InputAdornment>
                    ),
                  }}
                  name="first_name"
                  type="text"
                  as={TextField}
                  required
                  margin="normal"
                  fullWidth
                  label={t('common:firstName')}
                  placeholder={t('common:firstName')}
                  autoFocus
                  error={!!errors.first_name}
                  helperText={errors.first_name}
                />
                <Field
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PermIdentityOutlinedIcon />
                      </InputAdornment>
                    ),
                  }}
                  name="last_name"
                  type="text"
                  as={TextField}
                  required
                  margin="normal"
                  fullWidth
                  label={t('common:lastName')}
                  placeholder={t('common:lastName')}
                  error={!!errors.last_name}
                  helperText={errors.last_name}
                />
              </>
            );
          }}
          formInitialValues={{ first_name: '', last_name: '' }}
        />
      </div>

      <RemoteTable
        tableRef={tableRef}
        columns={[
          { title: t('common:firstName'), field: 'first_name' },
          { title: t('common:lastName'), field: 'last_name' },
          {
            title: t('common:registeredOn'),
            field: 'created_at',
            editable: 'never',
            render: renderDateTimeField,
          },
        ]}
        editable={{
          isEditable: (_row) => true,
          onRowUpdate: (newData, oldData) => {
            const { first_name, last_name } = newData;
            return Api.put('borrowers/' + oldData.id, {
              first_name,
              last_name,
            });
          },
        }}
        basePath="borrowers"
      />
    </>
  );
}

export default function () {
  const { t } = useTranslation();

  return (
    <Container>
      <Title title={t('manage:borrowers')} />
      <BorrowerManagement />
    </Container>
  );
}
