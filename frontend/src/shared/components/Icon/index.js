import React from 'react';
import { string } from 'prop-types';

import IconView from './IconView';
import IconSwap from './IconSwap';
import IconTick from './IconTick';
import IconForward from './IconForward';
import IconBackward from './IconBackward';
import IconArrowRight from './IconArrowRight';
import IconArrowLeft from './IconArrowLeft';
import IconDelete from './IconDelete';
import IconEdit from './IconEdit';
import IconPlus from './IconPlus';
import IconMenu from './IconMenu';
import IconClose from './IconClose';
import IconAddList from './IconAddList';
import IconRefresh from './IconRefresh';
import IconHome from './IconHome';
import IconLanguage from './IconLanguage';

const Icon = ({ type }) => {
  switch (type) {
    case 'view': return <IconView />;
    case 'swap': return <IconSwap />;
    case 'forward': return <IconForward />;
    case 'backward': return <IconBackward />;
    case 'tick': return <IconTick />;
    case 'arrow-right': return <IconArrowRight />;
    case 'arrow-left': return <IconArrowLeft />;
    case 'delete': return <IconDelete />;
    case 'edit': return <IconEdit />;
    case 'plus': return <IconPlus />;
    case 'menu': return <IconMenu />;
    case 'close': return <IconClose />;
    case 'add-list': return <IconAddList />;
    case 'refresh': return <IconRefresh />;
    case 'home': return <IconHome />;
    case 'language': return <IconLanguage />;
    default: return <div>Please select valid icon.</div>;
  }
};

Icon.propTypes = {
  type: string.isRequired,
};

export default Icon;
