import Head from 'next/head'
import utilStyles from '../styles/utils.module.css'
import dateFormat from 'dateformat'

export const siteTitle = 'Valor Dolar'


export async function getServerSideProps(context) {
    const apiAccess = process.env.ACCESS_KEY_API
    const openKey = process.env.OPEN_KEY

    var now = new Date()
    now = dateFormat(now, 'mm-dd-yyyy')    
    const res = await fetch(`https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarPeriodo(dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@dataInicial='01-01-2021'&@dataFinalCotacao='${now}'&$top=100&$orderby=dataHoraCotacao%20desc&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao`)
    const json = await res.json()
    now = dateFormat(now, 'dd/mm/yyyy')
    const resEuro = await fetch(`http://data.fixer.io/api/latest?access_key=${apiAccess}&symbols=USD,BRL&format=1`)
    const jsonEuro = await resEuro.json()
    const resDolar = await fetch(`https://openexchangerates.org/api/latest.json?app_id=${openKey}`)
    const jsonDolar = await resDolar.json()
    return {
        props: {
            value: json['value'][0].cotacaoCompra,
            value2: json['value'][0].cotacaoVenda,
            euro: jsonEuro.rates.BRL,
            dolar: jsonDolar.rates.BRL,
            dateHoje: now
        }
    }
}

function Home(props) {
    return (
        <div className="container">
            <Head>
                <title>{siteTitle}</title>
                <meta name="viewport" content="width=device-width,initial-scale=1"/>

                <meta property="og:title" content={siteTitle} />
                <meta property="og:description" content="Site rapido e minimalista com valor atual do Dolar PTAX "/>
                <meta property="og-locale" content="pt_BR"/>       
                <meta property="og:site_name" content="Valor Dolar"/>
                <meta property="og:type" content="website"/>
                <meta property="og:url" content="https://dolar.vercel.app"/>
                <meta property="og:image" content="https://dolar.vercel.app/images/dolar.jpg"/>

                <meta name="twitter:card" content="summary_large_image"/>
                <meta name="twitter:title" content="Valor Dolar"/>
                <meta name="twitter:description" content="Site rapido e minimalista com valor atual do Dolar PTAX"/>
                <meta name="twitter:image" content="https://dolar.vercel.app/images/dolar.jpg"/>

                <meta name="apple-mobile-web-app-title" content="Valor Dolar"/>
                <meta name="application-name" content="Valor Dolar"/>
                <meta name="msapplication-TileColor" content="#2c6fda"/>/
                <meta name="theme-color" content="#ffffff"/>
            </Head>

            <main>
                <div>
                    <h3 className={utilStyles.heading2Xl}>{props.dateHoje} </h3>
                </div>
                <div>
                    <h3 className={utilStyles.headingLg}>Dolar: R$ {props.dolar} </h3>
                </div>
                <div>
                    <h3 className={utilStyles.headingLg}>Dolar PTAX Compra: R$ {props.value} </h3>
                </div>
                <div>
                    <h3 className={utilStyles.headingLg}>Dolar PTAX Venda: R$ {props.value2}</h3>
                </div>
                <div>
                    <h3 className={utilStyles.headingLg}>Euro: R$ {props.euro}</h3>
                </div>

            </main>

            <footer>
                <a href="https://github.com/luisely/dolar" target="_blank" rel="noopener noreferrer">Criado por Fernando Ely</a>
            </footer>
        </div>
    )
}



export default Home
