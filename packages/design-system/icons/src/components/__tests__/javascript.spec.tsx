  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Javascript from "../javascript"

  describe("Javascript", () => {
    it("should render without crashing", async () => {
      render(<Javascript data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })