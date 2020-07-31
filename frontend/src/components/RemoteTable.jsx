import React, { forwardRef } from 'react';
import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import MaterialTable from 'material-table';
import Api from '../Api';
import { useTranslation } from 'react-i18next';

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

function getDefaultOptions() {
  return {
    debounceInterval: 500,
    searchFieldVariant: 'outlined',
    actionsColumnIndex: -1,
    padding: 'dense',
  };
}

function getLocalization(t) {
  return {
    pagination: {
      labelDisplayedRows: t('common:labelDisplayedRows'),
      labelRowsSelect: t('common:labelRowsSelect'),
      labelRowsPerPage: t('common:labelRowsPerPage'),
      firstAriaLabel: t('common:firstTooltip'),
      firstTooltip: t('common:firstTooltip'),
      previousAriaLabel: t('common:previousTooltip'),
      previousTooltip: t('common:previousTooltip'),
      nextAriaLabel: t('common:nextTooltip'),
      nextTooltip: t('common:nextTooltip'),
      lastAriaLabel: t('common:lastTooltip'),
      lastTooltip: t('common:lastTooltip'),
    },
    header: {
      actions: t('common:actions'),
    },
    body: {
      emptyDataSourceMessage: t('error:emptyDataSourceMessage'),
      editRow: {
        saveTooltip: t('common:save'),
        cancelTooltip: t('common:cancel'),
      },
      editTooltip: t('common:edit'),
    },
  };
}

export const RemoteTable = (props) => {
  const { t } = useTranslation();
  const localization = getLocalization(t);

  return (
    <MaterialTable
      icons={tableIcons}
      title=""
      tableRef={props.tableRef}
      localization={localization}
      options={Object.assign(getDefaultOptions(), props.options)}
      columns={props.columns}
      actions={props.actions}
      editable={props.editable}
      data={(query) => {
        let url = props.basePath + '?';
        url += 'per_page=' + query.pageSize;
        url += '&page=' + (query.page + 1);
        if (query.orderDirection !== '') {
          url += '&order_dir=' + query.orderDirection;
          url += '&order_field=' + query.orderBy.field;
        }
        if (query.search !== '') {
          url += '&q=' + encodeURIComponent(query.search);
        }
        return Api.get(url).then((res) => {
          const result = res.data;
          return {
            data: result.data,
            page: result.page - 1,
            totalCount: result.total,
          };
        });
      }}
    />
  );
};

export const PartiallyRemoteTable = (props) => {
  const { t } = useTranslation();
  const localization = getLocalization(t);

  return (
    <MaterialTable
      icons={tableIcons}
      title=""
      tableRef={props.tableRef}
      localization={localization}
      options={Object.assign(getDefaultOptions(), props.options)}
      columns={props.columns}
      actions={props.actions}
      editable={props.editable}
      components={props.components}
      data={props.data}
    />
  );
};
