import {createContext, useContext, useEffect, useState} from "react";
import {fetchAssets, fetchCrypto} from "../api.js";
import {percentDifference} from "../utils.js";


export const CryptoContext = createContext({
    assets: [],
    crypto: [],
    loading: false,
})

export function CryptoContextProvider({ children }) {
    const [loading, setLoading] = useState(false)
    const [crypto, setCrypto] = useState([])
    const [assets, setassets] = useState([])

    useEffect(() => {
        async function preload() {
            setLoading(true)
            const {result} = await fetchCrypto()
            const assets = await fetchAssets()

            setCrypto(result)
            setassets(assets.map((asset) => {
                const coin = result.find(c => c.id === asset.id)
                return {
                    grow: asset.price < coin.price,
                    growPercent: percentDifference(asset.price, coin.price),
                    totalAmount: asset.amount * coin.price,
                    totalProfit: asset.amount * coin.price - asset.amount * asset.price,
                    ...asset
                }
            }))
            setLoading(false)
        }
        preload()

    }, [])
    return (
        <CryptoContext.Provider value={{loading, crypto, assets}}>
            {children}
        </CryptoContext.Provider>
    )
}

export const useCrypto = () => {
    return useContext(CryptoContext)
}