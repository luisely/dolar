import Head from 'next/head'
import utilStyles from '../styles/utils.module.css'
import dateFormat from 'dateformat'

export const siteTitle = 'Valor Dolar'
export var now = new Date()
now = dateFormat(now, 'mm-dd-yyyy')
const apiAccess = process.env.ACCESS_KEY_API
const openKey = process.env.OPEN_KEY  

export async function getStaticProps(context) {
    try {
        const [dolarCompraRes, euroRes, dolarRes] = await Promise.all([
            fetch(`https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarPeriodo(dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@dataInicial='01-01-2021'&@dataFinalCotacao='${now}'&$top=100&$orderby=dataHoraCotacao%20desc&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao`),
            fetch(`http://data.fixer.io/api/latest?access_key=${apiAccess}&symbols=USD,BRL&format=1`),
            fetch(`https://openexchangerates.org/api/latest.json?app_id=${openKey}`)
        ]);
        const [dolarCompra, euro, dolar] = await Promise.all([
            dolarCompraRes.json(), 
            euroRes.json(),
            dolarRes.json()
        ]);
        return { 
            props: {
                dolarCompra,
                euro,
                dolar
            },
            revalidate: 20 
            }
    } catch {
        return {
            props: {}
        }
    }
}



function Home(props) {
    if (!props.dolarCompra){
        return (
        <div>
            <h3 className={utilStyles.heading2Xl}>Erro ao carregar os dados! </h3>
        </div>
        )
    } else {
    return (
        <div className="container">
            <Head>
                <title>{siteTitle}</title>
                <meta name="viewport" content="width=device-width,initial-scale=1"/>

                <meta property="og:title" content={siteTitle} />
                <meta property="og:description" content="Site rapido e minimalista com valor atual do Dolar PTAX "/>
                <meta property="og-locale" content="pt_BR"/>       
                <meta property="og:site_name" content={siteTitle}/>
                <meta property="og:type" content="website"/>
                <meta property="og:url" content="https://dolar.vercel.app"/>
                <meta property="og:image" content="https://dolar.vercel.app/images/dolar.jpg"/>

                <meta name="twitter:card" content="summary_large_image"/>
                <meta name="twitter:title" content={siteTitle}/>
                <meta name="twitter:description" content="Site rapido e minimalista com valor atual do Dolar PTAX"/>
                <meta name="twitter:image" content="https://dolar.vercel.app/images/dolar.jpg"/>

                <meta name="apple-mobile-web-app-title" content={siteTitle}/>
                <meta name="application-name" content={siteTitle}/>
                <meta name="msapplication-TileColor" content="#2c6fda"/>/
                <meta name="theme-color" content="#ffffff"/>
            </Head>


            <main>
                <div>
                    <h3 className={utilStyles.heading2Xl}>{dateFormat(now, 'dd/mm/yyyy')} </h3>
                </div>
                <div>
                    <h3 className={utilStyles.headingLg}>Dolar: R$ {props.dolar.rates.BRL} </h3>
                </div>
                <div>
                    <h3 className={utilStyles.headingLg}>Dolar PTAX Compra: R$ {props.dolarCompra['value'][0].cotacaoCompra} </h3>
                </div>
                <div>
                    <h3 className={utilStyles.headingLg}>Dolar PTAX Venda: R$ {props.dolarCompra['value'][0].cotacaoVenda}</h3>
                </div>
                <div>
                    <h3 className={utilStyles.headingLg}>Euro: R$ {props.euro.rates.BRL}</h3>
                </div>

            </main>

            <footer>
                <a href="https://github.com/luisely/dolar" target="_blank" rel="noopener noreferrer">Criado por Fernando Ely</a>
            </footer>
        </div>
    )
    }
}



export default Home
