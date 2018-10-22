# resas-estate-trans-graphql
GraphQL for RESAS estate transaction API

RESAS APIで公開されている不動産価格のGraphQL API
（RESAS（地域経済分析システム）を加工して作成したものである）

## Data source and Licence

https://opendata.resas-portal.go.jp/docs/api/v1/townPlanning/estateTransaction/bar.html

Licence: cc-by

 https://opendata.resas-portal.go.jp/terms.html

## API 

http://resas-estate-trans.now.sh

- cityEstate(cityCode: "14150",
		year: 2009,
    area: Housing)

Fields

- cityName
- value
- year
- prefName

Example

```graphql
{
  cityEstate(cityCode: "14150",
		year: 2009,
        area: Housing) {
    cityName
    value
    year
    prefName
  }
}
```

Result

```json
{
  "data": {
    "cityEstate": {
      "cityName": "相模原市",
      "value": "206431",
      "year": 2009,
      "prefName": "神奈川県"
    }
  },
  "meta": {
    "data_origin": "RESAS（地域経済分析システム）を加工して作成",
    "source_url": "https://opendata.resas-portal.go.jp/",
    "lisence_type": "cc-by https://opendata.resas-portal.go.jp/terms.html"
  }
}
```