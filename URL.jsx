const BaseURL = "http://localhost:5001/";
export const APPURL = {
  login: BaseURL + "user/login",
  logout: BaseURL + "user/logout",
  real_journal: BaseURL + "journal/with-trades/?type=real",
  portfolio: BaseURL + "portfolio/",
  journal: BaseURL + "journal/",
  trade: BaseURL + "trade/",
  symbol: BaseURL + "symbol/",
  strategy: BaseURL + "strategy/",
};
