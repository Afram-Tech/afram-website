import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within, fireEvent, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  LocationPicker,
  type LocationPickerSelection,
} from "@/features/properties/LocationPicker";
import { __resetRecentLocationsCacheForTest } from "@/features/properties/location-picker/useRecentLocations";

function open(props: Partial<React.ComponentProps<typeof LocationPicker>> = {}) {
  const onOpenChange = vi.fn();
  const onSelect = vi.fn();
  render(<LocationPicker open onOpenChange={onOpenChange} onSelect={onSelect} {...props} />);
  return { onOpenChange, onSelect };
}

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

  it("renders the dialog with a listbox of all 16 regions when open", () => {
    open();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    const listbox = screen.getByRole("listbox");
    expect(within(listbox).getAllByRole("option")).toHaveLength(16);
  });

  it("shows 'All Ghana' as the title at the root", () => {
    open();
    expect(screen.getByText("All Ghana")).toBeInTheDocument();
  });
});

describe("LocationPicker — drill-down", () => {
  it("clicking a region with children drills into its districts, not a final selection", async () => {
    const { onSelect, onOpenChange } = open();
    await userEvent.click(screen.getByText("Greater Accra"));

    expect(onSelect).not.toHaveBeenCalled();
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.getByText("Back")).toBeInTheDocument();
    // Title switches to the region name once drilled in.
    expect(
      screen.getByText("Greater Accra", { selector: "[id='location-picker-title']" }),
    ).toBeInTheDocument();
    // Districts now populate the listbox — 260 across the whole taxonomy,
    // Greater Accra alone has a real, non-trivial subset.
    const listbox = screen.getByRole("listbox");
    expect(within(listbox).getAllByRole("option").length).toBeGreaterThan(10);
  });

  it("clicking a leaf district calls onSelect with level 'city' and closes", async () => {
    const { onSelect, onOpenChange } = open();
    await userEvent.click(screen.getByText("Greater Accra"));
    await userEvent.click(screen.getByText("Ablekuma Central"));

    expect(onSelect).toHaveBeenCalledWith<[LocationPickerSelection]>({
      level: "city",
      id: "GH0701",
      slug: "ablekuma-central",
      label: "Ablekuma Central",
    });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("the 'All {region}' row selects the region itself at level 'region'", async () => {
    const { onSelect } = open();
    await userEvent.click(screen.getByText("Greater Accra"));
    await userEvent.click(screen.getByText("All Greater Accra"));

    expect(onSelect).toHaveBeenCalledWith<[LocationPickerSelection]>({
      level: "region",
      id: "GH07",
      slug: "greater-accra",
      label: "Greater Accra",
    });
  });

  it("Back returns to the region list", async () => {
    open();
    await userEvent.click(screen.getByText("Greater Accra"));
    await userEvent.click(screen.getByText("Back"));

    expect(screen.getByText("All Ghana")).toBeInTheDocument();
    expect(within(screen.getByRole("listbox")).getAllByRole("option")).toHaveLength(16);
  });
});

describe("LocationPicker — search", () => {
  it("typing filters to matches with a breadcrumb, across levels", async () => {
    open();
    await userEvent.type(screen.getByRole("combobox"), "ablekuma");

    const listbox = screen.getByRole("listbox");
    const options = within(listbox).getAllByRole("option");
    expect(options.length).toBeGreaterThan(0);
    expect(screen.getAllByText("Greater Accra").length).toBeGreaterThan(0); // breadcrumb(s)
  });

  it("selecting a searched leaf result calls onSelect and closes", async () => {
    const { onSelect } = open();
    await userEvent.type(screen.getByRole("combobox"), "ablekuma central");
    await userEvent.click(screen.getByText("Ablekuma Central"));

    expect(onSelect).toHaveBeenCalledWith<[LocationPickerSelection]>({
      level: "city",
      id: "GH0701",
      slug: "ablekuma-central",
      label: "Ablekuma Central",
    });
  });

  it("shows an empty state for a query with no matches", async () => {
    open();
    await userEvent.type(screen.getByRole("combobox"), "zzzznotarealplacezzzz");
    expect(screen.getByText(/no matches/i)).toBeInTheDocument();
  });

  it("selecting a searched region drills in rather than selecting it outright", async () => {
    const { onSelect } = open();
    await userEvent.type(screen.getByRole("combobox"), "greater accra");
    await userEvent.click(screen.getByText("Greater Accra"));

    expect(onSelect).not.toHaveBeenCalled();
    expect(screen.getByText("Back")).toBeInTheDocument();
  });
});

describe("LocationPicker — keyboard", () => {
  it("ArrowDown moves focus to the next option (roving tabindex)", () => {
    open();
    const listbox = screen.getByRole("listbox");
    const optionsBefore = within(listbox).getAllByRole("option");
    expect(optionsBefore[0]).toHaveAttribute("tabIndex", "0");

    fireEvent.keyDown(listbox, { key: "ArrowDown" });

    const optionsAfter = within(listbox).getAllByRole("option");
    expect(optionsAfter[0]).toHaveAttribute("tabIndex", "-1");
    expect(optionsAfter[1]).toHaveAttribute("tabIndex", "0");
  });

  it("Enter activates the focused option", async () => {
    const { onSelect } = open();
    const search = screen.getByRole("combobox");
    fireEvent.keyDown(search, { key: "ArrowDown" }); // focus index 1
    fireEvent.keyDown(search, { key: "Enter" });

    // Index 1's region has children, so Enter drills in rather than
    // selecting — proves Enter reached the currently-focused option at all.
    expect(screen.getByText("Back")).toBeInTheDocument();
    expect(onSelect).not.toHaveBeenCalled();
  });
});

describe("LocationPicker — recent locations", () => {
  it("a selection is offered as Recent the next time the picker opens", async () => {
    const first = open();
    await userEvent.click(screen.getByText("Greater Accra"));
    await userEvent.click(screen.getByText("Ablekuma Central"));
    cleanup();

    open({ onSelect: first.onSelect });
    expect(screen.getByText("Recent")).toBeInTheDocument();
    expect(screen.getByText("Ablekuma Central", { selector: "button" })).toBeInTheDocument();
  });
});

describe("LocationPicker — selected highlight", () => {
  it("marks the matching option aria-selected", () => {
    open({ selectedId: "GH07" });
    const option = screen.getByText("Greater Accra").closest('[role="option"]');
    expect(option).toHaveAttribute("aria-selected", "true");
  });
});
