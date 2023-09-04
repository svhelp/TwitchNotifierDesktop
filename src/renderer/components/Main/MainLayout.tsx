import { Layout } from "antd"
import { Header, Content } from "antd/es/layout/layout"
import { useAuthRedirect } from "renderer/customHooks/useAuthRedirect"
import { HeaderContent } from "./Header/Header"
import { StreamList } from "./Streams/StreamList"
import styled from "styled-components"

export const MainLayout = () => {
  useAuthRedirect();

  const version = window.electron.currentVersion

  return (
    <Layout className="site-layout">
      <Header style={{ background: "white" }}>
        <HeaderContent />
      </Header>
      <Content>
        <StreamList />
      </Content>
      <VersionContainer>v.{version}</VersionContainer>
    </Layout>
  )
}

const VersionContainer = styled.div`
  display: flex;
  justify-content: flex-end;

  margin: 0 4px 4px;

  color: #00000040
`
