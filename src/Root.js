import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './service/redux/store';
import css from './Root.scss';

import Container from './pages/container';

class Root extends Component {

  render() {
    return (
      <div id={css.background}>
        <BrowserRouter>
          <Provider store={store}>
            <div id={css.routeDiv}>
              <Route path="/" component={Container} />
            </div>
          </Provider>
        </BrowserRouter>
      </div>
    );
  }
}

export default Root;
