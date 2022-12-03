import { useGetFollowedStreamsQuery, useGetUsersQuery } from "api/twitchApi";
import styled from "styled-components";
import { StreamInfo } from "./StreamInfo";

export const StreamList = () => {
    const { data: userData, isLoading, error } = useGetUsersQuery({});
    const { data: streamsData } = useGetFollowedStreamsQuery({user_id: userData?.data[0]?.id ?? ""},
      {
        skip: !userData,
        pollingInterval: 30000,
      });
    
    return (
      <VerticalInfoBlock>
        {streamsData?.data.map(s =>
          <StreamInfo key={s.id} stream={s} />)}
      </VerticalInfoBlock>
    );
}

const VerticalInfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  margin: 12px 0;
`