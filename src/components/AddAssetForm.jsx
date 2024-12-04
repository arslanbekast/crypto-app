import {useRef, useState} from "react";
import {
    Button,
    Checkbox,
    DatePicker,
    Divider,
    Flex,
    Form,
    Input,
    InputNumber,
    Result,
    Select,
    Space,
    Typography
} from "antd";
import {useCrypto} from "../context/crypto-context.jsx";
import {CoinInfo} from "./CoinInfo.jsx";

const validateMessages = {
    required: '${label} is required',
    types: {
        number: '${label} is not valid number',
    },
    number: {
        range: '${label} must be between ${min} and ${max}',
    }
}

export const AddAssetForm = ({onClose}) => {
    const [form] = Form.useForm();
    const [coin, setCoin] = useState(null)
    const [submitted, setSubmitted] = useState(false)
    const {crypto, addAsset} = useCrypto()
    const assetRef = useRef()

    if (submitted) {
        return (
            <Result
                status="success"
                title="New Asset Added"
                subTitle={`Added ${assetRef.current.amount} of ${coin.name} by price ${assetRef.current.price}`}
                extra={[
                    <Button type="primary" key="console" onClick={onClose}>
                        Close
                    </Button>,
                ]}
            />
        )
    }

    if (!coin) {
        return (
            <Select
                style={{width: '100%'}}
                placeholder="Select coin"
                onSelect={(v) => setCoin(crypto.find((c) => c.id === v))}
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
        )
    }

    const onFinish = (values) => {
        const newAsset = {
            id: coin.id,
            amount: values.amount,
            price: values.price,
            date: values.date?.$d ?? new Date(),
        }
        assetRef.current = newAsset
        addAsset(newAsset)
        setSubmitted(true)
    };

    const handleAmountChange = (value) => {
        const price = form.getFieldValue('price')
        form.setFieldsValue({
            total: +(value * price).toFixed(2),
        })
    }

    const handlePriceChange = (value) => {
        const amount = form.getFieldValue('amount')
        form.setFieldsValue({
            total: +(amount * value).toFixed(2),
        })
    }

    return (
        <Form
            form={form}
            name="basic"
            labelCol={{
                span: 4,
            }}
            wrapperCol={{
                span: 10,
            }}
            style={{
                maxWidth: 600,
            }}
            initialValues={{
                price: +coin.price.toFixed(2),
            }}
            onFinish={onFinish}
            validateMessages={validateMessages}
        >
            <CoinInfo coin={coin}/>
            <Divider />


            <Form.Item
                label="Amount"
                name="amount"
                rules={[
                    {
                        required: true,
                        type: 'number',
                        min: 0
                    },
                ]}
            >
                <InputNumber
                    placeholder='Enter coin amount'
                    onChange={handleAmountChange}
                    style={{width: '100%'}}/>
            </Form.Item>

            <Form.Item label="Price" name="price">
                <InputNumber onChange={handlePriceChange} style={{width: '100%'}}/>
            </Form.Item>

            <Form.Item label="Date & time" name="date">
                <DatePicker showTime />
            </Form.Item>

            <Form.Item label="Total" name="total">
                <InputNumber disabled style={{width: '100%'}}/>
            </Form.Item>

            <Form.Item label={null}>
                <Button type="primary" htmlType="submit">
                    Add Asset
                </Button>
            </Form.Item>
        </Form>
    );
};