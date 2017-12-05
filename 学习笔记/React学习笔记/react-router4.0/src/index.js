import React from "react";
import ReactDOM from "react-dom";

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";

import Foo from "./Foo";
import B from "./Foo0";
import C from "./Foo1";
import NavBar from "./App";

import Ha from "./error";

const App = () => (
  <Router>
    <div>
      <NavBar />
      <Switch>
        <Route exact path="/" component={Foo} />
        <Route path="/b" component={B} />
        <Route path="/c/:id" component={C} />

        <Redirect from="/redirect" to="/b" />

        <Route component={Ha} />
      </Switch>
    </div>
  </Router>
);

ReactDOM.render(<App />, document.getElementById("root"));
