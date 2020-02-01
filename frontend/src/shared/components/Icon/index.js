import React from 'react';

import IconView from './IconView';
import IconSwap from './IconSwap';
import IconTick from './IconTick';
import IconForward from './IconForward';
import IconBackward from './IconBackward';
import IconArrowRight from './IconArrowRight';
import IconDelete from './IconDelete';
import IconEdit from './IconEdit';
import IconPlus from './IconPlus';
import IconMenu from './IconMenu';
import IconClose from './IconClose';

const Icon = ({ type }) => {
  switch (type) {
    case 'view': {
      return <IconView />;
    }
    case 'swap': {
      return <IconSwap />;
    }
    case 'forward': {
      return <IconForward />;
    }
    case 'backward': {
      return <IconBackward />;
    }
    case 'tick': {
      return <IconTick />;
    }
    case 'arrow-right': {
      return <IconArrowRight />;
    }
    case 'delete': {
      return <IconDelete />;
    }
    case 'edit': {
      return <IconEdit />;
    }
    case 'plus': {
      return <IconPlus />;
    }
    case 'menu': {
      return <IconMenu />;
    }
    case 'close': {
      return <IconClose />;
    }
    default: {
      return <div>Please select valid icon.</div>;
    }
  }
};

export default Icon;
