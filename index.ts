import { GraphQLServer } from 'graphql-yoga'
import fetch from 'node-fetch'
import { config } from 'dotenv'
import { exists } from 'fs';
config()

const API_URL = "https://opendata.resas-portal.go.jp/api/v1/townPlanning/estateTransaction/bar"
const API_KEY = process.env.API_KEY

enum AreaType {
  Commercial = 1,
  Housing,
  UsedApartment,
  Agricultural,
  Forest
}

var download = async function(url: string) {
  if(API_KEY == undefined) {
    return null
  }
  var response = await fetch(url, { headers: { 'x-api-key': API_KEY }});
  var rtn = (await response.json())['result']
  return rtn
}

const estate =  async (cityCode: string, year: Number, area: string) => {
  console.log(API_URL.substr(0,2))
  return await download(`${API_URL}?year=${year}&prefCode=${cityCode.substr(0,2)}&displayType=${AreaType[<any>area]}&cityCode=${cityCode}`)
}

async function run() {
	const typeDefs = `
    type CityEstate {
      prefCode: String
      prefName: String
      cityCode: String
      cityName: String
      displayType: String
      value: String
      year: Int
    }
    type Query {
      cityEstate(cityCode: String!, year: Int, area: AreaType): CityEstate
    }
    enum AreaType {
      # Commercial area
      Commercial
      # Housing area
      Housing
      # Used apartment and so on
      UsedApartment
      # Agricultural area
      Agricultural
      # Forest
      Forest
    }
  `;

  const resolvers = {
    Query: {
      cityEstate: async (obj:any, param:any, context: any, info: any) => { return await estate(param.cityCode, param.year, param.area)}
    },
    CityEstate: {
      value: (obj:any) => obj.years[0].value,
      year: (obj:any) => obj.years[0].year
    }
  };

  const formatResponse = (response:any) => {
    var meta = {
      data_origin: "RESAS（地域経済分析システム）を加工して作成",
      source_url: "https://opendata.resas-portal.go.jp/",
      lisence_type: "cc-by https://opendata.resas-portal.go.jp/terms.html"
    }
    return {
      ...response,
      meta
    }
  }
	const server = new GraphQLServer({ typeDefs, resolvers })
	server.start({port: 4041, formatResponse}, () =>
		console.log(`Your GraphQL server is running now ...`),
	)
}

try {
	run()
} catch(e) {
	console.log(e)
}
