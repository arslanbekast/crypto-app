import {Button, Drawer, Layout, Modal, Select, Space} from "antd";
import {useCrypto} from "../../context/crypto-context.jsx";
import {useEffect, useState} from "react";
import {CoinInfoModal} from "../CoinInfoModal.jsx";
import {AddAssetForm} from "../AddAssetForm.jsx";

const headerStyle = {
    width: "100%",
    textAlign: 'center',
    height: 60,
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
};

export const AppHeader = () => {

    const [select, setSelect] = useState(false)
    const [coin, setCoin] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const {crypto} = useCrypto()

    useEffect(() => {
        const keypress = (event) => {
            if (event.key === "/") {
                setSelect(prev => !prev)
            }
        }
        document.addEventListener("keypress", keypress)
        return () => document.removeEventListener("keypress", keypress)
    }, [])

    const handleSelect = (value) => {
        setCoin(crypto.find(c => c.id === value))
        setIsModalOpen(true)
    }

    return (
        <Layout.Header style={headerStyle}>
            <Select
                style={{width: 250}}
                value="press / to open"
                open={select}
                onSelect={handleSelect}
                onClick={() => setSelect(prev => !prev)}
                options={crypto.map(coin => ({
                    label: coin.name,
                    value: coin.id,
                    icon: coin.icon,
                }))}
                optionRender={(option) => (
                    <Space>
                        <img width={20} src={option.data.icon} alt={option?.data.label}/>
                        {option.data.label}
                    </Space>
                )}
            />

            <Button type="primary" onClick={() => setIsDrawerOpen(true)}>Add Asset</Button>
            <Modal open={isModalOpen}
                   onCancel={() => setIsModalOpen(false)}
                    footer={null}>
                <CoinInfoModal coin={coin}/>
            </Modal>
            <Drawer destroyOnClose={true}
                    width={600}
                    title="Basic Drawer"
                    onClose={() => setIsDrawerOpen(false)}
                    open={isDrawerOpen}>
                <AddAssetForm onClose={() => setIsDrawerOpen(false)}/>
            </Drawer>
        </Layout.Header>
    );
};