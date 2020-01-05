import React from 'react';

/* eslint-disable react/prop-types, react/no-danger */
function Html({ content, state, css }) {
  return (
    <html>
      <head>
        <style>{[...css].join('')}</style>
      </head>
      <body>
        <div id="root" dangerouslySetInnerHTML={{ __html: content }} />
        <script dangerouslySetInnerHTML={{
          __html: `window.__APOLLO_STATE__=${JSON.stringify(state).replace(/</g, '\\u003c')};`,
        }}
        />
      </body>
    </html>
  );
}

export default Html;
