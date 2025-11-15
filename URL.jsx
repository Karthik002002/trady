const BaseURL = "http://localhost:5001/";
export const APPURL = {
  login: BaseURL + "user/login",
  logout: BaseURL + "user/logout",
  real_journal: BaseURL + "journal/with-trades/?type=real",
  all_journal: BaseURL + "journal/with-trades/",
  test_journal: BaseURL + "journal/with-trades/?type=test",
  portfolio: BaseURL + "portfolio/",
  journal: BaseURL + "journal/",
  trade: BaseURL + "trade/",
  symbol: BaseURL + "symbol/",
  execution: BaseURL + "execution/",
  strategy: BaseURL + "strategy/",
  goal: BaseURL + "goal/",
};
