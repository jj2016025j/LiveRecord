import { CountryKeyNum, TradeAmountRange, VerifyStatusNum } from './enums';

type CryptoTypes = 'BTC' | 'ETH' | 'TRX' | 'ERC20_USDT' | 'TRC20_USDT';

const crytTypeOptions: Array<{
  value: CryptoTypes;
  label: CryptoTypes;
}> = [
  { value: 'BTC', label: 'BTC' },
  { value: 'ETH', label: 'ETH' },
  { value: 'TRX', label: 'TRX' },
  { value: 'ERC20_USDT', label: 'ERC20_USDT' },
  { value: 'TRC20_USDT', label: 'TRC20_USDT' },
];

const verifyStatusOptions = [
  { value: VerifyStatusNum.Verifing, label: '驗證中' },
  { value: VerifyStatusNum.Fail, label: '失敗' },
  { value: VerifyStatusNum.Pass, label: '通過' },
];

const tradeAmountRangeOptions = [
  { value: TradeAmountRange.LessOneThousand, label: '小於一千' },
  { value: TradeAmountRange.LessTenThousands, label: '小於一萬' },
  { value: TradeAmountRange.OneToTwo, label: '一萬 ~ 兩萬' },
  { value: TradeAmountRange.TwoToThree, label: '兩萬 ~ 五萬' },
  { value: TradeAmountRange.OverFive, label: '五萬以上' },
];

const countryOptions = [
  { value: CountryKeyNum.Taiwan, label: '台灣' },
  { value: CountryKeyNum.Honkon, label: '香港' },
];

const kycFieldOptions = [
  {
    value: 'IdNumber',
    label: '身分證字號'
  },
  {
    value: 'RealName',
    label: '姓名'
  },
  {
    value: 'Nationality',
    label: '國籍'
  },
  {
    value: 'DateOfBirth',
    label: '生日'
  },
  {
    value: 'RegisteredAddress',
    label: '戶籍地址'
  },
  {
    value: 'ContactAddress',
    label: '聯絡地址'
  },
  {
    value: 'ContactPhoneNumber',
    label: '連絡電話'
  },
  {
    value: 'Email',
    label: '電子信箱'
  },
  {
    value: 'ID_Front',
    label: '身分證正面'
  },
  {
    value: 'ID_Back',
    label: '身分證背面'
  },
  {
    value: 'ID_Holder',
    label: '手持身分證自拍'
  },
]

const getCountryBankOptions = (countyKey: CountryKeyNum | undefined) => {
  if (countyKey === CountryKeyNum.Taiwan)
    return [
      { value: '163', label: '臺灣銀行 Bank of Taiwan (163)' },
      { value: '149', label: '臺灣土地銀行 Land Bank of Taiwan（149）' },
      {
        value: '269',
        label: '合作金庫商業銀行 Taiwan Cooperative Bank（269）',
      },
      { value: '186', label: '第一商業銀行 First Commercial Bank（186）' },
      {
        value: '185',
        label: '華南商業銀行 Hua Nan Commercial Bank, Ltd.（185）',
      },
    ];
  return [];
};

export type { CryptoTypes };
export { getCountryBankOptions, crytTypeOptions, kycFieldOptions, verifyStatusOptions, tradeAmountRangeOptions, countryOptions };
