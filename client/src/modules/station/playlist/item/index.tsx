import { ListItem, ListItemText } from '@material-ui/core';
import { SongStatusEnum, StationPlayistQuery } from 'operations';
import React from 'react';
import { useStyles } from './styles';

interface Props {
  data: NonNullable<StationPlayistQuery['playlist'][0]>;
}

export const PlaylistItem: React.FC<Props> = props => {
  const classes = useStyles();
  const { title, status, thumbnail } = props.data;
  return (
    <ListItem selected={status === SongStatusEnum.Playing} dense>
      <div className={classes.thumbnailContainer}>
        <img src={thumbnail} alt={title} className={classes.thumbnail} />
      </div>
      <ListItemText disableTypography primary={<div className={classes.text}>{title}</div>} secondary={status} />
    </ListItem>
  );
};