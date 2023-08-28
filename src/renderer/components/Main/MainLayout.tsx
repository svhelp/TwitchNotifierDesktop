import { Layout } from "antd"
import { Header, Content } from "antd/es/layout/layout"
import { useAuthRedirect } from "renderer/customHooks/useAuthRedirect"
import { HeaderContent } from "./Header/Header"
import { StreamList } from "./Streams/StreamList"

export const MainLayout = () => {
  useAuthRedirect();

  return (
    <Layout className="site-layout">
      <Header style={{ background: "white" }}>
        <HeaderContent />
      </Header>
      <Content>
        <StreamList />
      </Content>
    </Layout>
  )
}

