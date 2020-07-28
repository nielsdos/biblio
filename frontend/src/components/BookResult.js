import React from 'react';
import { useTranslation } from 'react-i18next';
import {makeStyles} from "@material-ui/core/styles";
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Link from '@material-ui/core/Link';
import moment from "moment";

const useStyles = makeStyles(theme => ({
  cover: {
    //width: '180px',
    //height: '271px',
    width: '144px',
    height: '216px',
    marginRight: theme.spacing(1),
  },
}));

/**
 * Maybe add a padded string.
 * Used for date handling in post processing.
 *
 * @param {Object} item 
 * @param {Object} dest 
 * @param {string} src 
 */
function maybeAddPadded(item, dest, src) {
  if(src) {
    if(src < 10) {
      item[dest] += '-0' + src;
    } else {
      item[dest] += '-' + src;
    }
  }
}

/**
 * Post process result to transform the data to a more friendly internal format.
 *
 * @param {Object} item Result
 */
export function postProcessResult(item) {
  if(item.first_available) {
    item.first_available_obj = moment(item.first_available);
    item.first_available = item.first_available_obj.local().format('LLL');
  }
  item.authors = item.authors.map(a => a.name).join(', ');
  item.publish_date = item.publish_year;
  maybeAddPadded(item, 'publish_date', item.publish_month);
  maybeAddPadded(item, 'publish_date', item.publish_day);
}

/**
 * Post process result array to transform the data to a more friendly internal format.
 *
 * @param {Array} array Result array
 */
export function postProcessResults(array) {
  for(const item of array) {
    postProcessResult(item);
  }
}

// TODO: only show options & borrow when permitted
export default (props) => {
  const {t} = useTranslation();
  const classes = useStyles();
  const item = props.item;

  return (
    <ListItem alignItems="flex-start">
      <ListItemAvatar>
        <img alt={item.title} className={classes.cover} src={item.cover_url} />
      </ListItemAvatar>
      <ListItemText
        primary={item.title}
        secondary={
          <>
            <Typography
              component="span"
              variant="subtitle2"
              display="block"
              color="textSecondary"
            >
              ISBN 13: {item.isbn13}
              {item.isbn10 && (
                <>, ISBN 10: {item.isbn10}</>
              )}
            </Typography>
            <Typography
              component="span"
              variant="caption"
              display="block"
              color="textSecondary"
            >
              {item.authors}
            </Typography>
            <Typography
              component="span"
              variant="caption"
              display="block"
              color="textSecondary"
              style={{marginBottom: '1em'}}
            >
              {item.publisher.name}, {item.publish_date}
            </Typography>

            <Typography
              component="p"
              variant="body2"
              color="textPrimary"
              style={{marginBottom: '1em'}}
            >
              {item.description}
            </Typography>

            {props.showAvailability && (
              <>
                <Typography
                  component="p"
                  variant="caption"
                >
                  {item.available === 0 ? (
                    <Box color="error.main">
                      {t('common:noAvailable')}
                      <br />
                      {item.first_available_obj.isBefore() /* should've been available by now, but isn't */ ? (
                        <>{t('common:firstAvailableExpired', {ts: item.first_available})}</>
                      ) : (
                        <>{t('common:firstAvailable', {ts: item.first_available})}</>
                      )}
                    </Box>
                  ) : (
                    <Box color="success.main">
                      {t('common:availability', {available: item.available, number_of_copies: item.number_of_copies})}
                    </Box>
                  )}
                </Typography>

                TODO: enkel weergeven als er nog capaciteit is &amp; permissie (en checken op server als het kan)
                <Button
                  variant="contained"
                  color="primary"
                >
                  {t('common:registerBorrow')}
                </Button>
              </>
            )}

            {item.data_source === 'openlibrary' && (
              <Link href={`https://openlibrary.org/search?q=ISBN:${item.isbn13}&mode=everything`} target="_blank" rel="noopener noreferrer">
                {t('common:lookOnOpenLibrary')}
              </Link>
            )}
          </>
        }
      />
      {props.addendum}
    </ListItem>
  );
};
