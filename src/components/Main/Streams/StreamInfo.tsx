import { Avatar, Card } from "antd"
import Meta from "antd/es/card/Meta"
import { IStreamInfo, useGetUsersQuery } from "api/twitchApi"

interface IStreamInfoProps {
    stream: IStreamInfo;
}

export const StreamInfo = (props: IStreamInfoProps) => {
    const { stream } = props;

    const { data: streamerData, isLoading } = useGetUsersQuery({ id: stream.user_id });

    return (
        <Card
            style={{ width: 500, margin: "4px" }}
            onClick={() => window.open(`https://twitch.tv/${stream.user_login}`, '_blank', 'noopener,noreferrer')}
            hoverable
        >
            <Meta
                avatar={<Avatar src={streamerData?.data[0].profile_image_url} />}
                title={stream.user_name}
                description={stream.title}
                />
        </Card>
    )
}