import { Clock } from "lucide-react";
import { LocationPickerRow } from "./LocationPickerRow";
import type { LocationPickerGroups } from "./grouping";
import type { LocationPickerNode, LocationPickerSelection } from "./types";

const SECTION_LABEL = "text-ink-400 text-[11px] font-semibold tracking-wider uppercase";

export function LocationPickerEmpty({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <p className="text-ink-400 text-[13px]">{message}</p>
    </div>
  );
}

/** What every row needs to know about the active filter and keyboard focus. */
export interface RowContext {
  selectedId?: string;
  /** Ids of every place that contains the selection (its ancestors). */
  selectionAncestorIds: ReadonlySet<string>;
  isFocused: (node: LocationPickerNode) => boolean;
  onSelect: (node: LocationPickerNode) => void;
  onBrowse: (node: LocationPickerNode) => void;
}

export function LocationRowList({ nodes, ctx }: { nodes: LocationPickerNode[]; ctx: RowContext }) {
  return (
    <>
      {nodes.map((node) => (
        <LocationPickerRow
          key={node.id}
          node={node}
          selected={node.id === ctx.selectedId}
          containsSelection={ctx.selectionAncestorIds.has(node.id)}
          focused={ctx.isFocused(node)}
          optionId={`location-option-${node.id}`}
          onSelect={() => ctx.onSelect(node)}
          onBrowse={node.hasChildren ? () => ctx.onBrowse(node) : undefined}
        />
      ))}
    </>
  );
}

interface LocationPickerBrowseProps extends LocationPickerGroups {
  /** The "whole of here" row: all of Ghana at the top, or all of the place
   *  being browsed. Always first, so widening back out is one tap. */
  scopeNode: LocationPickerNode;
  scopeHint: string;
  scopeSelected: boolean;
  onSelectScope: () => void;
  recent: LocationPickerSelection[];
  onSelectRecent: (selection: LocationPickerSelection) => void;
  ctx: RowContext;
}

/** Browsing: the scope row, recents, popular, then A–Z. */
export function LocationPickerBrowse({
  scopeNode,
  scopeHint,
  scopeSelected,
  onSelectScope,
  popular,
  alphabetical,
  recent,
  onSelectRecent,
  ctx,
}: LocationPickerBrowseProps) {
  return (
    <div>
      <div className="mb-3">
        <LocationPickerRow
          node={scopeNode}
          selected={scopeSelected}
          focused={ctx.isFocused(scopeNode)}
          optionId={`location-option-${scopeNode.id}`}
          onSelect={onSelectScope}
          hint={scopeHint}
        />
      </div>

      {recent.length > 0 && (
        <div className="mb-4">
          <p className={`${SECTION_LABEL} mb-2 px-1`}>Recent</p>
          <div className="flex flex-wrap gap-2">
            {recent.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => onSelectRecent(r)}
                className="border-ink-100 text-ink-900 hover:border-brand-500 flex min-h-9 items-center gap-1.5 rounded-full border bg-transparent px-3 py-1.5 text-[12px] font-medium transition-colors"
              >
                <Clock className="text-ink-400 h-3 w-3" />
                {r.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {popular.length > 0 && (
        <div className="mb-4">
          <p className={`${SECTION_LABEL} mb-1 px-1`}>Popular</p>
          <LocationRowList nodes={popular} ctx={ctx} />
        </div>
      )}

      {alphabetical.length === 0 && popular.length === 0 ? (
        <LocationPickerEmpty message="Nothing here yet." />
      ) : (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {alphabetical.map((group) => (
            <div key={group.letter} className="mb-3 break-inside-avoid-column">
              <p className={`${SECTION_LABEL} sticky top-0 z-1 mb-1 bg-white px-1 normal-case`}>
                {group.letter}
              </p>
              <LocationRowList nodes={group.nodes} ctx={ctx} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
