import React from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import App from "./App";
import { UserAuthContextProvider } from "./LoginComponents/userAuth";
import userEvent from "@testing-library/user-event";
import { MdEventBusy } from "react-icons/md";

test("render", () => {
  render(
    <UserAuthContextProvider>
      <App />
    </UserAuthContextProvider>
  );
});

test("render menu", () => {
  render(
    <UserAuthContextProvider>
      <App />
    </UserAuthContextProvider>
  );
  const homeButton = screen.getByRole("button", { name: "menu-button-home" });
  const searchButton = screen.getByRole("button", {
    name: "menu-button-search",
  });
  const collectionButton = screen.getByRole("button", {
    name: "menu-button-collection",
  });
  const profileButton = screen.getByRole("button", {
    name: "menu-button-profile",
  });

  expect(homeButton).toBeInTheDocument();
  expect(searchButton).toBeInTheDocument();
  expect(collectionButton).toBeInTheDocument();
  expect(profileButton).toBeInTheDocument();
});

test("on clicking Home, i see a page that says home.", () => {
  render(
    <UserAuthContextProvider>
      <App />
    </UserAuthContextProvider>
  );
  userEvent.click(screen.getByRole("button", { name: "menu-button-home" }));
  expect(screen.getByText(/homepage/i)).toBeInTheDocument();
});

test("on clicking Search, i see an empty input, then i click home, then Search again. expect to switch screen", () => {
  render(
    <UserAuthContextProvider>
      <App />
    </UserAuthContextProvider>
  );
  userEvent.click(screen.getByRole("button", { name: "menu-button-search" }));
  expect(screen.getByRole("textbox")).toBeInTheDocument();
  expect(screen.getByText(/no items/i)).toBeInTheDocument();

  userEvent.click(screen.getByRole("button", { name: "menu-button-home" }));
  expect(screen.getByText(/homepage/i)).toBeInTheDocument();

  userEvent.click(screen.getByRole("button", { name: "menu-button-search" }));
  expect(screen.getByRole("textbox")).toBeInTheDocument();
  expect(screen.getByText(/no items/i)).toBeInTheDocument();
});


describe("test",()=>{
  let originalFetch;
  beforeEach(() => {
      originalFetch = global.fetch;
      global.fetch = jest.fn(() => Promise.resolve({
          json: () => Promise.resolve({
              value: "add array here"
              
        
          })
      }));
  });

  afterEach(() => {
      global.fetch = originalFetch;
  });

  it("search and add one card", async () => {
    render(
      <UserAuthContextProvider>
        <App />
      </UserAuthContextProvider>
    );
    userEvent.click(screen.getByRole("button", { name: "menu-button-search" }));
    userEvent.type(screen.getByRole("textbox"), "p");
    expect(screen.getByRole("textbox")).toHaveValue("p");
    userEvent.click(screen.getByRole("button", { name: "Search" }));
    await waitFor(() => screen.findByText("results: 2"))
    expect(screen.findByText("results: 2")).toBeInTheDocument();
    screen.debug()
  });

})


