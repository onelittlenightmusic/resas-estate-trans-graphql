# ----Title
GraphQL for RESAS estate transaction API

RESAS APIで公開されている不動産価格のGraphQL API
（RESAS（地域経済分析システム）を加工して作成したものである）

## Data source and Licence

https://opendata.resas-portal.go.jp/docs/api/v1/townPlanning/estateTransaction/bar.html

Licence: cc-by

 https://opendata.resas-portal.go.jp/terms.html

## API 

https://opendata.resas-portal.go.jp/

- cityEstate(cityCode: "14150",
		year: 2009,
    area: Housing)

Fields

- cityName
- value
- year
- prefName
