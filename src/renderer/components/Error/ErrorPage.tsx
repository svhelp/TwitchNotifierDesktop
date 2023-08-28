import { Button, Result } from "antd"
import { useLogOut } from "renderer/customHooks/useLogOut";

export const ErrorPage = () => {
    const onLogOut = useLogOut();

    return (
        <Result
            status="error"
            title="Unexpected error"
            extra={
                <Button type="primary" onClick={onLogOut}>
                    Log out
                </Button>
            }
        />
    )
}