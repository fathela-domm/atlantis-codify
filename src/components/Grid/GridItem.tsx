import React from 'react';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import { createStyles } from '@material-ui/core';

const style = createStyles({
  grid: {
    padding: '0px 3px !important'
  }
});

function GridItem({ ...props }: any) {
  const { classes, children, ...rest } = props;
  return (
    <Grid item={true} {...rest} className={`${classes.grid} grid-style`}>
      {children}
    </Grid>
  );
}

export default withStyles(style)(GridItem);
