import { GraphQLServer } from 'graphql-yoga'
import fetch from 'node-fetch'
import { config } from 'dotenv'
config()

const API_URL = "https://opendata.resas-portal.go.jp/api/v1/townPlanning/estateTransaction/bar"
const API_KEY = process.env.API_KEY
const PORT = process.env.PORT

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
  return (await response.json())['result']
}

const estate =  async (cityCode: string, year: Number, area: string) => {
  return await download(`${API_URL}?year=${year}&prefCode=${cityCode.substr(0,2)}&displayType=${AreaType[<any>area]}&cityCode=${cityCode}`)
}

async function run() {
  const typeDefs = `
    # City estate value type (e.g. value)
    type CityEstate {
      # Prefecture Code as String
      prefCode: String
      # Prefecture name as String
      prefName: String
      # City code as String
      cityCode: String
      # City name as String
      cityName: String
      # Display type as String defined orginally in RESAS
      displayType: String
      # Estate transacation value
      value: String
      # Estate transaction year
      year: Int
    }
    type Query {
      # City estate value query/args: cityCode etc.
      cityEstate(
        # City code like "14150", 5 digits
        cityCode: String!,
        # Year number, only one year between 2009-2015 is allowed
        year: Int,
        # Area type (one from 5 types defined in AreaType enum)
        area: AreaType): CityEstate
    }
    # Enum type representing city type
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
	server.start({port: PORT, formatResponse}, () =>
		console.log(`Your GraphQL server is running now ...`),
	)
}

try {
	run()
} catch(e) {
	console.log(e)
}
