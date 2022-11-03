import React from 'react';
import BaseIcon from 'components/Icon';
import styles from './BackButton.module.scss';
import { Link } from 'react-router-dom';
import LinkButton from "components/Buttons/LinkButton";
import Icon from 'components/Icon';

export default function Button({ link, color, size, children, onClick, ...props }) {
  return (<LinkButton  secondary to={link} ><Icon name="arrow-left"/> Back</LinkButton>);

  {/*  <BaseIcon */}
  {/*    icon={['far', 'long-arrow-left']}*/}
  {/*    transform="shrink-12"*/}
  {/*    color={color || 'white'}*/}
  {/*    mask={['fas', 'circle']}*/}
  {/*    pointer*/}
  {/*    size={size || '4x'}*/}
  {/*    onClick={onClick}*/}
  {/*  />*/}
  {/*);*/}

  {/*return link ? (*/}
  {/*  <Link to={link}>*/}
  {/*    {renderIcon()}*/}
  {/*    {children}*/}
  {/*  </Link>*/}
  {/*) : (*/}
  {/*  renderIcon()*/}
  {/*);*/}
}