import React, { useCallback, useState, useMemo } from 'react';
import { InputBase, IconButton, Icon } from '@material-ui/core';
import { InputBaseProps } from '@material-ui/core/InputBase';
import { MdSearch as SearchIcon, MdClose as CloseIcon } from 'react-icons/md';
import { useStyles } from './styles';

interface Props extends InputBaseProps {
  icon?: React.ReactNode;
  onIconClick?(): void;
  iconButton?: boolean;
}

export const ReSearch: React.FC<Props> = ({ icon, onBlur, onFocus, onIconClick, className, iconButton, ...rest }) => {
  const classes = useStyles();
  const [isInputFocused, setIsInputFocused] = useState(false);
  const handleInputFocus = useCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      setIsInputFocused(true);
      if (onFocus) {
        onFocus(event);
      }
    },
    [onFocus],
  );
  const handleInputBlur = useCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      setIsInputFocused(false);
      if (onBlur) {
        onBlur(event);
      }
    },
    [onBlur],
  );

  const enhancedClassName = useMemo(
    () => [classes.root, isInputFocused ? classes.rootFocused : '', className].join(' ').trim(),
    [classes.root, classes.rootFocused, isInputFocused, className],
  );

  const isNotEmpty = useMemo(() => !!rest.value, [rest.value]);
  const IconComponent = useMemo(() => (iconButton ? IconButton : Icon), [iconButton]);
  return (
    <div className={enhancedClassName}>
      <InputBase
        type="text"
        {...rest}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        endAdornment={
          icon || (
            <IconComponent
              size="small"
              onClick={onIconClick}
              className={classes.icon}
              id={isNotEmpty ? 'close-button' : 'search-button'}
            >
              {isNotEmpty ? <CloseIcon /> : <SearchIcon />}
            </IconComponent>
          )
        }
      />
    </div>
  );
};
