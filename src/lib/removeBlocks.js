import { JSDOM } from "jsdom";

export default function removeUnselectedBlocksFromHtml(
  snapshotHtml,
  selectedBlockIds,
) {
  const dom = new JSDOM(snapshotHtml);
  const document = dom.window.document;

  if (
    typeof selectedBlockIds === "object" &&
    !Array.isArray(selectedBlockIds)
  ) {
    selectedBlockIds = Object.keys(selectedBlockIds).filter(
      (id) => selectedBlockIds[id] === true,
    );
  }

  const allBlocks = document.querySelectorAll("[data-block-id]");

  allBlocks.forEach((block) => {
    const blockId = block.getAttribute("data-block-id");

    const parentBlockSelected = selectedBlockIds.includes(blockId);
    const childBlocks = block.querySelectorAll("[data-block-id]");

    if (
      !parentBlockSelected &&
      !selectedBlockIds.some(
        (id) =>
          childBlocks &&
          block.contains(document.querySelector(`[data-block-id="${id}"]`)),
      )
    ) {
      block.remove();
    }
  });

  return dom.serialize();
}
