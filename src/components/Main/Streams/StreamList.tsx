import { useGetFollowedStreamsQuery, useGetUsersQuery } from "api/twitchApi";
import styled from "styled-components";

export const StreamList = () => {
    const { data: userData, isLoading, error } = useGetUsersQuery({});
    const { data: streamsData } = useGetFollowedStreamsQuery({user_id: userData?.data[0]?.id ?? ""}, {skip: !userData});
    
    return (
        <InfoBlock>
          <span>Streams:</span>
          <VerticalInfoBlock>
            {streamsData?.data.map(s =>
              <div key={s.id}>{s.user_login}</div>)}
          </VerticalInfoBlock>
        </InfoBlock>
    );
}

const InfoBlock = styled.div`
  display: flex;
`

const VerticalInfoBlock = styled.div`
  display: flex;
  flex-direction: column;
`