import { BackBtn } from "../../components/BackBtn";
import { VerifyCodeModal } from "../../components/VerifyCodeModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Space, Button, Tag, List, Steps, Typography, Descriptions, DescriptionsProps } from 'antd'
import SignatureContract from "../SignatureContract";

const { Title, Text, Link } = Typography;

const data2 = [
  {
    txType: 1,
    crypto: "USDT泰達幣",
    payMethod: "現金",
    quantity: "1,000.00",
    exRate: 30,
    memberName: "汪曉明",
    memberNum: 1000316516,
    memberAddress: "Tasjio54qwSAD846asd48q6f46",
    apecAddress: "TWxcf1698ef1365f46ef8749e8",
    orderNum: "clientBuyUSDT001",
    orderCreationDate: "2024.03.01 00:00:00",
    amount: 30000,
    fee: 150,
    currency: "TWD",
    country: "台灣",
    store: "台中逢甲",
    storeCounterNum: "櫃台01",
    storeStaff: "櫃台君01",
    // (if交易方式===轉帳){銀行資訊}
    TWD: {
      accountName: "銀行戶名",
      account: "銀行帳號",
      bankCode: "銀行代碼",
    },
    HKD: {
      accountName: "銀行戶名",
      account: "銀行帳號",
      bankName: "銀行名稱",
    },
  },
];
const items2: DescriptionsProps["items"] = [
  {
    key: "1",
    label: "交易種類",
    children: "USDT泰達幣-TRC20",
  },
  {
    key: "2",
    label: "交易方式",
    children: "現金",
  },
  {
    key: "3",
    label: "交易匯率",
    children: "30",
  },
  {
    key: "4",
    label: "交易金額",
    children: "TWD 1,500",
  },
  {
    key: "5",
    label: "",
    children: "",
  },
  {
    key: "6",
    label: "交易手續費",
    children: "TWD 150",
  },
];
const items3: DescriptionsProps["items"] = [
  {
    key: "1",
    label: "交易數量",
    children: (
      <Space align="baseline">
        <Title
          style={{
            color: data2.filter((txType) => txType.txType === 1)
              ? "red"
              : "blue",
          }}
        >
          {data2.filter((txType) => txType.txType === 1) ? "出售" : "購買"}
        </Title>
        USDT
        <Title style={{ fontWeight: "bold" }}>1,000.00</Title>
      </Space>
    ),
  },
  {
    key: "2",
    label: "總計",
    children: (
      <Space align="baseline">
        <Title>
          {data2.filter((txType) => txType.txType === 1) ? "收款" : "付款"}
        </Title>
        TWD
        <Title style={{ fontWeight: "bold" }}>30,150</Title>
      </Space>
    ),
  },
];
const IndexPage = () => {
  const [OpenVerifyCodeModal, setOpenVerifyCodeModal] = useState(false);
  const [openContract, setOpenContract] = useState(false);

  const navigate = useNavigate();
  return (
    <div className="page">
      <div className="pageContent" style={{ maxWidth: 900 }}>
        <Card
          title={
            <Space size="large" align="baseline">
              <Text>
                訂單號: <Text copyable>clientBuyUSDT001</Text>
              </Text>
              <Text>
                PPAP訂單號:<Text copyable>USDTOut000</Text>
              </Text>
              <Text>
                交易合約書:
                <Link onClick={() => setOpenContract(true)}>
                  20240314000001
                </Link>
              </Text>
            </Space>
          }
          extra={<BackBtn />}
        >
          <Steps
            style={{ margin: "40px 0 40px auto" }}
            progressDot
            current={2}
            items={[
              {
                title: "訂單發起時間",
                description: "2024.02.26 00:00:00",
              },
              {
                title: "訂單成立時間",
                description: "2024.02.26 00:00:00",
              },
              {
                title: "付款時間",
                description: "2024.02.26 00:00:00",
              },
              {
                title: "完成時間",
                description: "2024.02.26 00:00:00",
              },
            ]}
          />
          <Descriptions
            items={items2}
            column={2}
            contentStyle={{
              justifyContent: "end",
              fontWeight: "bold",
              marginRight: 20,
            }}
            labelStyle={{ marginLeft: 20, alignItems: "center" }}
            size="small"
          />
          <Descriptions
            items={items3}
            column={2}
            style={{ background: "#EDEDED", borderRadius: 5 }}
            contentStyle={{
              justifyContent: "end",
              fontWeight: "bold",
              marginRight: 20,
            }}
            labelStyle={{ marginLeft: 20, alignItems: "center" }}
            size="small"
          />
          <List
            dataSource={data2}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={
                    <div
                      style={{
                        color: "#FDA200",
                        fontSize: 20,
                      }}
                    >
                      {item.txType === 1 ? "付款方" : "收款方"}
                    </div>
                  }
                  description={
                    <div>
                      <table>
                        <tr>
                          客人姓名：
                          <td>{item.memberName}</td>
                        </tr>
                        <tr>
                          會員編號：
                          <td>{item.memberNum}</td>
                        </tr>
                        <tr>
                          {item.txType === 1 ? "接收" : "發送"}錢包地址：
                          <td>{item.memberAddress}</td>
                        </tr>
                        {item.payMethod === "轉帳" && (
                          <tr>
                            銀行戶名
                            <td>{item.TWD.accountName}</td>
                          </tr>
                        )}
                      </table>
                      <tr>
                        hash：
                        <td>--</td>
                      </tr>
                      <tr>
                        狀態
                        <td>
                          <Tag color="orange">待確認</Tag>
                        </td>
                      </tr>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
          <List
            dataSource={data2}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={
                    <div
                      style={{
                        color: "#FDA200",
                        fontSize: 20,
                      }}
                    >
                      {item.txType === 1 ? "收款方" : "付款方"}
                    </div>
                  }
                  description={
                    <table>
                      <tr>
                        國家：
                        <td>{item.country}</td>
                      </tr>
                      <tr>
                        門市：
                        <td>{item.store}</td>
                      </tr>
                      <tr>
                        櫃台：
                        <td>{item.storeCounterNum}</td>
                      </tr>
                      <tr>
                        櫃台人員：
                        <td>{item.storeStaff}</td>
                      </tr>
                      <tr>
                        {item.txType === 1 ? "接收" : "發送"}錢包地址：
                        <td>--</td>
                      </tr>
                    </table>
                  }
                />
              </List.Item>
            )}
          />
          <Button
            type="primary"
            block
            onClick={() => setOpenVerifyCodeModal(true)}
          >
            確認收款，轉出加密貨幣
          </Button>
        </Card>

        <VerifyCodeModal
          open={OpenVerifyCodeModal}
          onCancel={() => setOpenVerifyCodeModal(false)}
          onOk={() => {
            navigate("/txComplete");
          }}
        />

        <SignatureContract
          {...{ contractInfo: undefined }}
          open={openContract}
          setOpen={setOpenContract}
        />
      </div>
    </div>
  );
};
export default IndexPage;
