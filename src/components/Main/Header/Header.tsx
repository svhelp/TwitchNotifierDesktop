import { Dropdown, Avatar, Image, MenuProps } from "antd"
import { useLogOut } from "customHooks/useLogOut";
import { useUserData } from "customHooks/useUserData";
import styled from "styled-components"

export const HeaderContent = () => {
    const { data: userData, isLoading } = useUserData();
  
    const onLogOut = useLogOut();
  
    const user = userData?.data[0];
    
    const items: MenuProps['items'] = [
      {
        label: <a onClick={onLogOut}>Log out</a>,
        key: '0',
      },
    ];
    
    return (
        <HeaderContainer>
          <HeaderCaption>Followed channels</HeaderCaption>
          <Dropdown menu={{ items }} trigger={['click']}>
            <a onClick={(e) => e.preventDefault()}>
              <Avatar src={<Image src={user?.profile_image_url} preview={false} />} />
              <UserLink>
                {user?.display_name}
              </UserLink>
            </a>
          </Dropdown>
        </HeaderContainer>
    )
}

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
`

const HeaderCaption = styled.h1`
  margin: 0;
`

const UserLink = styled.span`
  margin-left: 8px;

  color: #323232;
  font-weight: 500;
`