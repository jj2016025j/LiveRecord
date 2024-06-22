import { GlobalOutlined } from "@ant-design/icons";
import { MenuProps, Dropdown, Space, Button } from "antd";

export const I18n = () => {
    const items: MenuProps['items'] = [
        {
            label: '繁體中文',
            key: '0',
        },
        {
            label: '簡体中文',
            key: '1',
        },
        {
            type: 'divider',
        },
        {
            label: 'English',
            key: '3',
        },
    ];
    return (
        <Button ghost size='small'>
            <Dropdown menu={{ items }} trigger={['click']} placement="top" arrow>
                <Space>
                    <GlobalOutlined />
                    {'繁體中文'}
                </Space>
            </Dropdown>
        </Button>
    )
}