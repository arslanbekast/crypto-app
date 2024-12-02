import {AppHeader} from "./AppHeader.jsx";
import {Layout, Spin} from "antd";
import {AppSider} from "./AppSider.jsx";
import {AppContent} from "./AppContent.jsx";
import {useCrypto} from "../../context/crypto-context.jsx";

export const AppLayout = () => {

    const {loading} = useCrypto()

    if (loading) {
        return <Spin fullscreen />
    }
    return (
        <Layout>
            <AppHeader />
            <Layout>
                <AppSider />
                <AppContent />
            </Layout>
        </Layout>
    );
};