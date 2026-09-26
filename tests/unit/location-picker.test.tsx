import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within, fireEvent, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LocationPicker } from "@/features/properties/LocationPicker";
import type { LocationPickerSelection } from "@/features/properties/location-picker/types";
import { __resetRecentLocationsCacheForTest } from "@/features/properties/location-picker/useRecentLocations";

const GREATER_ACCRA: LocationPickerSelection = {
  level: "region",
  id: "GH07",
  slug: "greater-accra",
  label: "Greater Accra",
};
const ABLEKUMA_CENTRAL: LocationPickerSelection = {
  level: "city",
  id: "GH0701",
  slug: "ablekuma-central",
  label: "Ablekuma Central",
};

function open(props: Partial<React.ComponentProps<typeof LocationPicker>> = {}) {
  const onOpenChange = vi.fn();
  const onSelect = vi.fn();
  const onClear = vi.fn();
  render(
    <LocationPicker
      open
      onOpenChange={onOpenChange}
      onSelect={onSelect}
      onClear={onClear}
      {...props}
    />,
  );
  return { onOpenChange, onSelect, onClear };
}

const options = () => within(screen.getByRole("listbox")).getAllByRole("option");
const option = (name: string | RegExp) =>
  within(screen.getByRole("listbox")).getByRole("option", { name });
const browseInto = (id: string) => screen.getByTestId(`location-browse-${id}`);

beforeEach(() => {
  localStorage.clear();
  __resetRecentLocationsCacheForTest();
});

afterEach(() => {
  cleanup();
});

describe("LocationPicker — closed vs open", () => {
  it("renders nothing when closed", () => {
    render(<LocationPicker open={false} onOpenChange={vi.fn()} onSelect={vi.fn()} />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("lists 'Anywhere in Ghana' then all 16 regions", () => {
    open();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(options()).toHaveLength(17);
    expect(options()[0]).toHaveTextContent("Anywhere in Ghana");
  });
});

describe("LocationPicker — a region is one tap", () => {
  it("clicking a region filters to it straight away", async () => {
    const { onSelect, onOpenChange } = open();
    await userEvent.click(option(/^Greater Accra/));

    expect(onSelect).toHaveBeenCalledWith(GREATER_ACCRA);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("'Anywhere in Ghana' clears the location", async () => {
    const { onClear, onSelect } = open({ selectedId: "GH07" });
    await userEvent.click(option(/^Anywhere in Ghana/));

    expect(onClear).toHaveBeenCalledTimes(1);
    expect(onSelect).not.toHaveBeenCalled();
  });
});

describe("LocationPicker — browsing inside a place", () => {
  it("the district count browses in without selecting anything", async () => {
    const { onSelect } = open();
    await userEvent.click(browseInto("GH07"));

    expect(onSelect).not.toHaveBeenCalled();
    expect(screen.getByRole("navigation", { name: "Location breadcrumb" })).toHaveTextContent(
      "GhanaGreater Accra",
    );
    expect(options()[0]).toHaveTextContent("All of Greater Accra");
    expect(options().length).toBeGreaterThan(10);
  });

  it("a district filters at the district level", async () => {
    const { onSelect } = open();
    await userEvent.click(browseInto("GH07"));
    await userEvent.click(option(/^Ablekuma Central/));

    expect(onSelect).toHaveBeenCalledWith(ABLEKUMA_CENTRAL);
  });

  it("'All of {region}' filters to the region itself", async () => {
    const { onSelect } = open();
    await userEvent.click(browseInto("GH07"));
    await userEvent.click(option(/^All of Greater Accra/));

    expect(onSelect).toHaveBeenCalledWith(GREATER_ACCRA);
  });

  it("the breadcrumb and Back both return to the regions", async () => {
    open();
    await userEvent.click(browseInto("GH07"));
    await userEvent.click(screen.getByRole("button", { name: "Ghana" }));
    expect(options()).toHaveLength(17);

    await userEvent.click(browseInto("GH07"));
    await userEvent.click(screen.getByRole("button", { name: "Back" }));
    expect(options()).toHaveLength(17);
  });

  it("a leaf offers nothing to browse into", async () => {
    open();
    await userEvent.click(browseInto("GH07"));
    expect(screen.queryByTestId("location-browse-GH0701")).toBeNull();
  });
});

describe("LocationPicker — search", () => {
  it("finds places at every level, each with its breadcrumb", async () => {
    open();
    await userEvent.type(screen.getByRole("combobox"), "ablekuma");

    expect(options().length).toBeGreaterThan(0);
    expect(screen.getAllByText("Greater Accra").length).toBeGreaterThan(0);
  });

  it("a searched district filters to it", async () => {
    const { onSelect } = open();
    await userEvent.type(screen.getByRole("combobox"), "ablekuma central");
    await userEvent.click(option(/^Ablekuma Central/));

    expect(onSelect).toHaveBeenCalledWith(ABLEKUMA_CENTRAL);
  });

  it("a searched region filters to it too — no forced drill-in", async () => {
    const { onSelect } = open();
    await userEvent.type(screen.getByRole("combobox"), "greater accra");
    await userEvent.click(option(/^Greater Accra/));

    expect(onSelect).toHaveBeenCalledWith(GREATER_ACCRA);
  });

  it("browsing into a searched region lands inside it with a real breadcrumb", async () => {
    open();
    await userEvent.type(screen.getByRole("combobox"), "greater accra");
    await userEvent.click(browseInto("GH07"));

    expect(screen.getByRole("combobox")).toHaveValue("");
    expect(options()[0]).toHaveTextContent("All of Greater Accra");
  });

  it("shows an empty state for a query with no matches", async () => {
    open();
    await userEvent.type(screen.getByRole("combobox"), "zzzznotarealplacezzzz");
    expect(screen.getByText(/no matches/i)).toBeInTheDocument();
  });
});

describe("LocationPicker — opens where the selection lives", () => {
  it("a selected district opens inside its region, marked selected", () => {
    open({ selectedId: "GH0701" });

    expect(options()[0]).toHaveTextContent("All of Greater Accra");
    expect(option(/^Ablekuma Central/)).toHaveAttribute("aria-selected", "true");
  });

  it("a selected region opens at the top, marked selected", () => {
    open({ selectedId: "GH07" });
    expect(option(/^Greater Accra/)).toHaveAttribute("aria-selected", "true");
  });

  it("the region holding a selected district says so", async () => {
    open({ selectedId: "GH0701" });
    await userEvent.click(screen.getByRole("button", { name: "Ghana" }));
    expect(screen.getByLabelText("includes your selection")).toBeInTheDocument();
  });
});

describe("LocationPicker — keyboard", () => {
  it("ArrowDown moves focus to the next option", () => {
    open();
    const listbox = screen.getByRole("listbox");
    expect(options()[0]).toHaveAttribute("tabIndex", "0");

    fireEvent.keyDown(listbox, { key: "ArrowDown" });
    expect(options()[0]).toHaveAttribute("tabIndex", "-1");
    expect(options()[1]).toHaveAttribute("tabIndex", "0");
  });

  it("Enter selects the focused region; ArrowRight browses into it instead", () => {
    const first = open();
    const search = screen.getByRole("combobox");
    fireEvent.keyDown(search, { key: "ArrowDown" });
    const focusedLabel = options()[1].textContent;
    fireEvent.keyDown(search, { key: "Enter" });
    expect(first.onSelect).toHaveBeenCalledWith(expect.objectContaining({ level: "region" }));
    cleanup();

    const second = open();
    const search2 = screen.getByRole("combobox");
    fireEvent.keyDown(search2, { key: "ArrowDown" });
    fireEvent.keyDown(search2, { key: "ArrowRight" });
    expect(second.onSelect).not.toHaveBeenCalled();
    expect(options()[0].textContent).toContain(`All of ${focusedLabel}`);

    fireEvent.keyDown(search2, { key: "ArrowLeft" });
    expect(options()).toHaveLength(17);
  });
});

describe("LocationPicker — counts", () => {
  it("shows how many listings each place holds, including none", () => {
    open({ counts: { GH07: 3 } });
    expect(option(/^Greater Accra/)).toHaveTextContent("3 listings");
    expect(option(/^Ashanti/)).toHaveTextContent("no listings");
  });
});

describe("LocationPicker — recent locations", () => {
  it("a selection is offered as Recent the next time the picker opens", async () => {
    const first = open();
    await userEvent.click(browseInto("GH07"));
    await userEvent.click(option(/^Ablekuma Central/));
    cleanup();

    open({ onSelect: first.onSelect });
    expect(screen.getByText("Recent")).toBeInTheDocument();
    expect(screen.getByText("Ablekuma Central", { selector: "button" })).toBeInTheDocument();
  });
});
