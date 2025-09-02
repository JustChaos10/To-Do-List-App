import { render, screen } from "@testing-library/react";
import DashboardPage from "../page";

describe("DashboardPage", () => {
  it("renders header", () => {
    render(<DashboardPage />);
    expect(screen.getByText(/Your To-Dos/i)).toBeInTheDocument();
  });
});


