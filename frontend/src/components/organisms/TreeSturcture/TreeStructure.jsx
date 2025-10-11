import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useTreeStructureStore } from "../../../store/treeStructureStore";
import { Tree } from "../../molecules/Tree/Tree";

export const TreeStructure = () => {
  const { projectId } = useParams();

  const { treeStructure, loading, error, setTreeStructure } = useTreeStructureStore();

  useEffect(() => {
    if (projectId) {
      setTreeStructure(projectId);
    }
  }, [projectId, setTreeStructure]);

  // ✅ Render priority: loading -> error -> empty -> tree
  if (loading) {
    return <p style={{ color: "white" }}>Loading tree structure...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>Error loading tree: {error}</p>;
  }

  if (!treeStructure || Object.keys(treeStructure).length === 0) {
    return <p style={{ color: "white" }}>No tree structure available</p>;
  }

  return <Tree fileFolderData={treeStructure} />;
};
  