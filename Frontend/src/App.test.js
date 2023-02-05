import { render, screen, cleanup } from '@testing-library/react';
import App from './App';
import ReactDOM from "react-dom";
//import "jest-dom/extend-expect";
import {ColorModeScript} from "@chakra-ui/react";
import theme from "./styles/theme";
import React from "react";
import renderer from "react-test-renderer";

afterEach(() => {
  cleanup();
});

window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  };
};
test('test name', () => {

  expect(true).toBe(true);
});

test('test2', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it("matches snapshot", () => {
  const tree = renderer.create(<div></div>).toJSON();
  expect(tree).toMatchSnapshot();
});

//compoents are spilling outside parent components test to see if a component overflows
