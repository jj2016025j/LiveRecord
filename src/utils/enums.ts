enum MessageTypeNum {
  Img = 1,
  Text = 2,
}

enum TradeStatusNum {
  Cancelled = -1,
  Signing = 0,
  Completed = 4,
  // BUY
  Receiving = 1,
  UnderReview = 2,
  BuyerCheck = 3,
  // SELL
  AdminChecking = 1,
  AdminChecked = 2,
  PaidToGuest = 3,
}

enum TradeTypeNum {
  CustomerBuy = 1,
  CustomerSell = 2,
}

enum ChannelStatus {
  UndefinedStatus = -1,
  Online = 1,
  Offline = 2,
  Recording = 3,
  Saving = 4
}

enum TradeAmountRange {
  LessOneThousand = 1,
  LessTenThousands = 2,
  OneToTwo = 3,
  TwoToThree = 4,
  ThreeToFive = 5,
  OverFive = 6,
}

enum VerifyStatusNum {
  Verifing = 0,
  Fail = 1,
  Pass = 2,
}

enum CounterOperateTypeNum {
  Buy = 1,
  Sell = 2,
  FillIn = 3,
  TakeOut = 4,
}

enum CountryKeyNum {
  Taiwan = 'TW',
  Honkon = 'HK',
}

enum CounterTabKeys {
  Cash = '1',
  Trade = '2',
  Shift = '3',
}

export {
  ChannelStatus,
  MessageTypeNum,
  TradeTypeNum,
  TradeStatusNum,
  CounterTabKeys,
  CounterOperateTypeNum,
  TradeAmountRange,
  VerifyStatusNum,
  CountryKeyNum,
};
