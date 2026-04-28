import { useState } from "react";
import { useCreateProject } from "../hooks/apis/mutation/useCreateProject";
import { Button, Layout, Card, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const { Header, Footer, Content } = Layout;
const { Title, Text } = Typography;

export const CreateProject = () => {
  const { createProjectMutation } = useCreateProject();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function handleCreateProject() {
    try {
      setLoading(true);
      const response = await createProjectMutation();
      navigate(`/project/${response.projectId}`);
    } catch (error) {
      console.log("Error creating project", error);
      setLoading(false);
    }
  }

  return (
    <Layout
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
background: "#fffaf0" ,
   padding: 20,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: "100%", maxWidth: 500 }}
      >
        <Card
          bordered={false}
          style={{
            borderRadius: 16,
            textAlign: "center",
            boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
          }}
        >
          <Title level={2} style={{ marginBottom: 10 }}>
            🚀 Launch Your Playground
          </Title>

          <Text type="secondary">
            Create a new React environment instantly with Docker-powered
            sandbox execution.
          </Text>

          <div style={{ marginTop: 30 }}>
            <Button
              type="primary"
              size="large"
              loading={loading}
              onClick={handleCreateProject}
              style={{
                borderRadius: 30,
                padding: "0 40px",
                height: 50,
                fontSize: 16,
                transition: "all 0.3s ease",
              }}
            >
              {loading ? "Setting up environment..." : "Create Playground"}
            </Button>
          </div>
        </Card>
      </motion.div>

      <Footer
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          textAlign: "center",
          background: "transparent",
          color: "black",
        }}
      >
        © {new Date().getFullYear()} React Online Compiler
      </Footer>
    </Layout>
  );
};