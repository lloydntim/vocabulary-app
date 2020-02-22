import React, { Children, useState } from 'react';
import {
  oneOfType,
  arrayOf,
  node,
  string,
} from 'prop-types';

import './Tabs.scss';

/* eslint-disable react/jsx-props-no-spreading */
const Tabs = ({ children, titles }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const getSelectedClass = (selectedTab, index) => ((selectedTab === index) ? 'is-selected' : '');
  const tabs = Children.map(children, (child, index) => (
    <div className={`tab-content ${getSelectedClass(selectedTab, index)}`}>{child.props.children}</div>
  ));

  return (
    <div className="tabs">
      <div className="tab-titles">
        {titles.map((title, index) => (
          <button
            key={index}
            className={`tab-title ${getSelectedClass(selectedTab, index)}`}
            type="button"
            onClick={() => setSelectedTab(index)}
          >
            {title}
          </button>
        ))}
      </div>
      {tabs}
    </div>
  );
};

Tabs.propTypes = {
  titles: arrayOf(string).isRequired,
  children: oneOfType([
    arrayOf(node).isRequired,
    node,
  ]).isRequired,
};

export default Tabs;