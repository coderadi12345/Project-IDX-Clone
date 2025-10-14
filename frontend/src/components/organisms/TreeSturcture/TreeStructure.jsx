import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useTreeStructureStore } from "../../../store/treeStructureStore";
import { Tree } from "../../molecules/Tree/Tree";
import { useFileContextMenuStore } from "../../../store/fileContextMenuStore";
import { FileContextMenu } from "../../molecules/ContextMenu/FileContextMenu";

export const TreeStructure = () => {
  const { projectId } = useParams();

  const { treeStructure, loading, error, setTreeStructure } = useTreeStructureStore();
  const {
    file,
    isOpen: isFileContextOpen,
    x: fileContextX,
    y: fileContextY
  } = useFileContextMenuStore();

  useEffect(() => {
    if (projectId) {
      setTreeStructure(projectId);
    }
  }, [projectId, setTreeStructure]);

  if (loading) {
    return <p style={{ color: "white" }}>Loading tree structure...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>Error loading tree: {error}</p>;
  }

  if (!treeStructure || Object.keys(treeStructure).length === 0) {
    return <p style={{ color: "white" }}>No tree structure available</p>;
  }

  return (
    <>
      {isFileContextOpen && fileContextX && fileContextY && (
        <FileContextMenu
          x={fileContextX}
          y={fileContextY}
          path={file}
        />
      )}
      <Tree fileFolderData={treeStructure} />
    </>
  );
};
