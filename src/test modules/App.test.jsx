import { render, screen, waitFor } from "@testing-library/react";
import App from "../App";
import { UserAuthContextProvider } from "../ProfileComponents/userAuth";
import userEvent from "@testing-library/user-event";

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

// describe("test", () => {
//   it("search P and get two elements (Unown P and Unown [P]), click add for the first one, expect to find only one add button available as the first one is disabled", async () => {
//     render(
//       <UserAuthContextProvider>
//         <App />
//       </UserAuthContextProvider>
//     );
//     userEvent.click(screen.getByRole("button", { name: "menu-button-search" }));
//     userEvent.type(screen.getByRole("textbox"), "p");
//     expect(screen.getByRole("textbox")).toHaveValue("p");
//     userEvent.click(screen.getByRole("button", { name: "Search" }));

//     await waitFor(() => {
//       expect(screen.getByText(/unown p/i)).toBeInTheDocument();
//       expect(screen.getByText(/unown [p]/i)).toBeInTheDocument();
//       expect(screen.getAllByRole("button",{name:"card-add-button", hidden:true})).toHaveLength(2)
//       userEvent.click(screen.getAllByRole("button",{name:"card-add-button", hidden:true})[0])
//       expect(screen.getAllByRole("button",{name:"card-add-button", hidden:true})).toHaveLength(1)

//     });
//   });
// });
